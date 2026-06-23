import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, EMPTY, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs';
import { CrudPricingEstimate } from '../../services/crud-pricing-estimate';
import { tokenEstimation } from '../../interfaces/pricing-estimate';
import { TokenEstimatorCard } from '../token-estimator-card/token-estimator-card';

@Component({
  selector: 'bifi-app-pricing-estimate-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
    CheckboxModule,
    RadioButtonModule,
    ProgressBarModule,
    TokenEstimatorCard,
  ],
  templateUrl: './pricing-estimate-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingEstimateForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private crudEstimate = inject(CrudPricingEstimate);
  private destroy$ = inject(DestroyRef);

  protected isSubmitting = signal(false);
  protected tokenData = signal<tokenEstimation | null>(null);
  protected tokenLoading = signal(false);

  private requestText$ = new Subject<string>();

  protected shippingOptions = [
    { label: 'Air Freight (FedEx)', value: 'air' },
    { label: 'Sea Freight', value: 'sea' },
    { label: 'Both', value: 'both' },
  ];

  protected form: FormGroup = this.fb.group({
    requestText: ['', Validators.required],
    shippingMethod: ['sea'],
    dutyFree: [false],
    pricingMethod: ['markup'],
    pricingValue: ['1.3', Validators.required],
    specialInstructions: [''],
  });

  ngOnInit() {
    this.requestText$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((text) => {
          if (text.trim().length <= 5) {
            this.tokenData.set(null);
            this.tokenLoading.set(false);
            return EMPTY;
          }
          this.tokenLoading.set(true);
          return this.crudEstimate.tokenEstimate(text).pipe(
            catchError(() => {
              this.tokenLoading.set(false);
              return EMPTY;
            })
          );
        }),
        takeUntilDestroyed(this.destroy$)
      )
      .subscribe((data) => {
        this.tokenData.set(data);
        this.tokenLoading.set(false);
      });

    this.form.get('requestText')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((val: string) => {
        this.requestText$.next(val ?? '');
      });

    this.form.get('pricingMethod')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((method: string) => {
        this.form.patchValue({
          pricingValue: method === 'markup' ? '1.3' : '30',
        });
      });
  }

  protected onGenerate() {
    if (this.form.invalid) return;
    this.isSubmitting.set(true);

    const v = this.form.getRawValue();
    const payload: Record<string, unknown> = {
      requestText: v.requestText,
      shippingMethod: v.shippingMethod,
      pricingControls: {
        dutyFree: v.dutyFree,
        method: v.pricingMethod,
        ...(v.pricingMethod === 'markup'
          ? { markupFactor: Number(v.pricingValue) }
          : { margin: Number(v.pricingValue) }),
      },
    };
    if (v.specialInstructions) {
      payload['specialInstructions'] = v.specialInstructions;
    }

    this.crudEstimate
      .generate(payload)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (estimate) => {
          this.isSubmitting.set(false);
          this.router.navigate(['/pricing/estimates', estimate._id]);
        },
        error: () => {
          this.isSubmitting.set(false);
        },
      });
  }
}
