import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CrudCustomsTariffs } from '../../services/crud-customs-tariffs';
import { customsTariff } from '../../interfaces/customs-tariff';

@Component({
  selector: 'bifi-app-tariff-picker',
  imports: [FormsModule, AutoCompleteModule, DecimalPipe],
  templateUrl: './tariff-picker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TariffPicker),
      multi: true,
    },
  ],
})
export class TariffPicker implements OnDestroy {
  private crudTariffs = inject(CrudCustomsTariffs);

  placeholder = input<string>('Search tariff code or description');

  tariffSelected = output<customsTariff>();

  private searchSubject = new Subject<string>();

  private debouncedQuery = toSignal(
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' },
  );

  private tariffResource = this.crudTariffs.get({
    searchParams: computed(() => ({ search: this.debouncedQuery() })),
    triggerRequest: computed(() => (this.debouncedQuery()?.length ?? 0) >= 2),
  });

  suggestions = computed(() => this.tariffResource.value() ?? []);

  selectedTariff = signal<customsTariff | string | null>(null);
  disabled = signal(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.selectedTariff.set(value ?? null);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  search(query: string): void {
    this.searchSubject.next(query ?? '');
  }

  onSelect(event: AutoCompleteSelectEvent): void {
    const tariff = event.value as customsTariff;
    this.onChange(tariff.code);
    this.onTouched();
    this.selectedTariff.set(tariff);
    this.tariffSelected.emit(tariff);
  }

  onClear(): void {
    this.onChange('');
    this.onTouched();
    this.searchSubject.next('');
    this.selectedTariff.set(null);
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }
}
