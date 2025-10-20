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
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableLayout } from '@avalantec/base-app/resource';
import { SelectChildContactDialog } from './select-child-contact-dialog/select-child-contact-dialog';
import { contactColumns } from '../../libraries/contact-columns';
import { CrudCountries } from '@avalantec/base-app/countries';
import { contact } from '@avalantec/base-app/interfaces';

@Component({
  selector: 'bifi-app-contacts-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    SelectModule,
    InputText,
    ButtonModule,
    ProgressBarModule,
    RadioButtonModule,
    TableLayout,
    SelectChildContactDialog,
  ],
  templateUrl: './contacts-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsForm {
  private formService = inject(ContactForm);
  private crudContacts = inject(CrudContacts);
  private crudCountries = inject(CrudCountries);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // inputs
  id = input.required<string>();
  contactCols = contactColumns;

  contactResource = this.crudContacts.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  // get countries for country select
  countriesResource = this.crudCountries.get({});

  // for parent contact select and children list
  contactsResource = this.crudContacts.get({});

  // data
  contact = this.contactResource.value;
  countryOptions = this.countriesResource.value;

  parentOptions = computed(() =>
    this.contactsResource.value().filter(c => c._id !== this.contact()?._id)
  );

  childOptions = computed(() => {
    const contacts = this.contactsResource.value();
    const { childIds } = this.formService.value();

    return contacts.filter(
      c =>
        c._id !== this.contact()?._id &&
        !childIds?.includes(c._id) &&
        (!c.parentId || c.parentId?._id === this.contact()?._id)
    );
  });

  // state
  form = this.formService.form;
  contactType = this.formService.type;

  isLoading = computed(
    () =>
      this.contactResource.isLoading() ||
      this.contactsResource.isLoading() ||
      this.countriesResource.isLoading()
  );
  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.contact());
  error = this.contactResource.error;
  childIdsData = signal<contact[]>([]);

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
          website: contact.website,
          phoneNumber: contact.phoneNumber,
          childIds: contact.childIds?.map(c => c._id) || [],
          type: contact.type,
          countryId: contact.countryId?._id,
          state: contact.state,
          city: contact.city,
          zipCode: contact.zipCode,
          streetAddress: contact.streetAddress,
          streetAddress2: contact.streetAddress2,
        });

        this.formService.resetDirtyState();
        this.childIdsData.set(contact.childIds || []);
      } else {
        this.formService.reset();
        this.formService.form.controls.childIds.clear();
        this.childIdsData.set([]);
      }
    });
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
    if (!rawValue.countryId) delete rawValue.countryId;
    if (!rawValue.city) delete rawValue.city;
    if (!rawValue.state) delete rawValue.state;
    if (!rawValue.zipCode) delete rawValue.zipCode;
    if (!rawValue.streetAddress) delete rawValue.streetAddress;
    if (!rawValue.streetAddress2) delete rawValue.streetAddress2;
    if (!rawValue.website) delete rawValue.website;

    const action = this.isUpdate()
      ? this.crudContacts.put({ _id: this.contact()?._id || '', data: rawValue })
      : this.crudContacts.post({ data: rawValue });

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

  handleContactSelect(contacts: contact[]) {
    this.childIdsData.update(current => [...current, ...contacts]);
    contacts.forEach(p => this.form.controls.childIds.pushItem(p._id));
  }

  handleContactRemove(id: string) {
    this.childIdsData.update(current => current.filter(p => p._id !== id));
    const index = this.form.controls.childIds.value.indexOf(id);

    if (index > -1) {
      this.form.controls.childIds.removeAt(index);
    }
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
