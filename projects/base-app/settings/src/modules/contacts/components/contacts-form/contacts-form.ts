import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ContactForm, ContactFormModel } from '../../services/contact-form';
import { CrudContacts } from '../../services/crud-contacts';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'bifi-app-contacts-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    SelectModule,
    InputText,
    ButtonModule,
    ProgressBarModule,
  ],
  templateUrl: './contacts-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsForm implements OnInit {
  private formService = inject(ContactForm);
  private contactsService = inject(CrudContacts);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // inputs
  id = input.required<string>();

  contactResource = this.contactsService.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  parentOptionsResource = this.contactsService.get({});

  // data
  contact = this.contactResource.value;
  parentOptions = computed(() =>
    this.parentOptionsResource.value().filter(c => c._id !== this.contact()?._id)
  );

  // state
  form = this.formService.form;
  isLoading = computed(
    () => this.contactResource.isLoading() || this.parentOptionsResource.isLoading()
  );
  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.contact());
  error = this.contactResource.error;

  /**
   * Constructor that initializes the form values if the contact is being updated.
   * If the contact is not available (i.e. it's being created), it resets the form values.
   */
  constructor() {
    effect(() => {
      const contact = this.contact();

      if (contact) {
        this.formService.patchValue({
          name: contact.name,
          lastName: contact.lastName,
          parentId: contact.parentId?._id,
          email: contact.email,
          phoneNumber: contact.phoneNumber,
        });
      } else {
        this.formService.reset();
      }
    });
  }

  ngOnInit(): void {
    this.formService.reset();
  }

  /**
   * Handles submitting the contact form.
   *
   * If the contact is being updated, it will call the contacts service put method.
   * If the contact is being created, it will call the contacts service post method.
   *
   * @param data - The form value state
   */
  async handleSubmit(data: FormValueState<ContactFormModel>) {
    this.isSubmitLoading.set(true);

    const { rawValue } = data;

    if (!rawValue.parentId) delete rawValue.parentId;

    const action = this.isUpdate()
      ? this.contactsService.put({ _id: this.contact()?._id || '', data: rawValue })
      : this.contactsService.post({ data: rawValue });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.goBack();
      },
      error: () => {
        this.isSubmitLoading.set(false);
      },
    });
  }

  /**
   * Navigates back to the list of contacts.
   *
   * If the contact is being updated, it will navigate to the list of contacts.
   * If the contact is being created, it will navigate to the list of contacts.
   */
  goBack() {
    const route = this.isUpdate() ? '../../list' : '../list';
    this.router.navigate([route], { relativeTo: this.route });
  }
}
