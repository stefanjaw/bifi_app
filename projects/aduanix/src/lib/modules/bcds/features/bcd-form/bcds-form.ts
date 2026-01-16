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
import { CrudBCD } from '../../services/crud-bcd';
import { BcdForm } from '../../services/bcd-form';
import { CrudCountries } from '@avalantec/base-app/countries';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModule } from '@avalantec/base-app/form';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TableLayout } from '@avalantec/base-app/resource';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'bifi-app-bcds-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    SelectModule,
    InputText,
    ButtonModule,
    ProgressBarModule,
    RadioButtonModule,
    TableLayout,
  ],
  templateUrl: './bcds-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BcdsForm {
  private formService = inject(BcdForm);
  private crudBCD = inject(CrudBCD);
  private crudCountries = inject(CrudCountries);
  private crudContacts = inject(CrudContacts);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input.required<string>();

  bcdResource = this.crudBCD.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });
  contactsResource = this.crudContacts.get({});
  countriesResource = this.crudCountries.get({});

  //data
  bcd = this.bcdResource.value;
  contactOptions = this.contactsResource.value;
  countryOptions = this.countriesResource.value;

  //state
  form = this.formService.form;

  isLoading = computed(
    () => this.contactsResource.isLoading() || this.countriesResource.isLoading()
  );

  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.bcd());
  error = this.bcdResource.error;



  constructor(){
    effect(() =>{
      const bcd = this.bcd();

      if(bcd){
        this.formService.patchValue({
          supplier: {
            contactId: bcd.supplier.contactId._id
          },
          importer: {
            contactId: bcd.importer.contactId._id
          },
          transport: {
            type: bcd.transport.type,
            aircraftOrVessel: bcd.transport.aircraftOrVessel,
            flightOrVoyage: bcd.transport.flightOrVoyage,
            port: bcd.transport.port,
            arrivalDate: bcd.transport.arrivalDate
          },
          manifest : bcd.manifest,
          masterBOLAWB: bcd.masterBOLAWB,
          houseBOLAWB: bcd.houseBOLAWB,
          directShipmentCountry: bcd.directShipmentCountry,
          originalShipmentCountry : bcd.originalShipmentCountry,
          warehouseId : bcd.warehouseId || '',
          
          // charges: bcd.charges.map(

          // )


          

        })
      }
    })
  }
}
