import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { TextareaModule } from 'primeng/textarea';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { SearchService } from '@avalantec/base-app/ui';
import { CrudSearchDestinations } from '../../services/crud-search-destinations';
import {
  SearchDestinationForm as SearchDestinationFormService,
  SearchDestinationFormModel,
} from '../../services/search-destination-form';

@Component({
  selector: 'bifi-app-search-destination-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    InputText,
    ToggleSwitchModule,
    ProgressBarModule,
    TextareaModule,
    ButtonModule,
  ],
  templateUrl: './search-destination-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchDestinationFormComponent {
  private formService = inject(SearchDestinationFormService);
  private crud = inject(CrudSearchDestinations);
  private searchService = inject(SearchService);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input<string>('');

  form = this.formService.form;

  destinationResource = this.crud.get({
    id: this.id,
    triggerRequest: computed(() => !!this.id()),
  });

  destination = this.destinationResource.value;
  isUpdate = computed(() => !!this.destination());
  isSystem = computed(() => !!this.destination()?.isSystem);
  isLoading = this.destinationResource.isLoading;
  isSubmitLoading = signal(false);
  error = this.destinationResource.error;

  constructor() {
    effect(() => {
      const dest = this.destination();
      if (dest) {
        this.formService.patchValue({
          key: dest.key,
          label: dest.label,
          route: dest.route,
          group: dest.group ?? '',
          icon: dest.icon ?? '',
          description: dest.description ?? '',
          resource: dest.resource ?? '',
          keywordsInput: (dest.keywords ?? []).join(', '),
          active: dest.active,
        });
        this.formService.resetDirtyState();
      } else if (!this.id()) {
        this.formService.reset();
      }
    });
  }

  handleSubmit(data: FormValueState<SearchDestinationFormModel>) {
    this.isSubmitLoading.set(true);
    const { rawValue } = data;

    const keywords = (rawValue.keywordsInput ?? '')
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    const payload: Record<string, any> = {
      key: rawValue.key,
      label: rawValue.label,
      route: rawValue.route,
      group: rawValue.group,
      icon: rawValue.icon,
      description: rawValue.description,
      resource: rawValue.resource,
      keywords,
      active: rawValue.active,
    };

    const action = this.isUpdate()
      ? this.crud.put({ _id: this.destination()?._id ?? '', data: payload })
      : this.crud.post({ data: payload });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.searchService.load(true);
        this.goBack();
      },
      error: () => this.isSubmitLoading.set(false),
    });
  }

  goBack() {
    const route = this.isUpdate() ? '../../list' : '../list';
    this.router.navigate([route], { relativeTo: this.route });
  }
}
