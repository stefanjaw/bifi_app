import { assetRoster } from '../interfaces/asset-roster';
import { assetType } from '../../asset-types';
import { DynamicComponent, tableColumn } from '@avalantec/base-app/resource';
import { contact } from '@avalantec/base-app/interfaces';
import { Tag } from 'primeng/tag';
import { Avatar } from 'primeng/avatar';
import { Signal, signal } from '@angular/core';


/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Returns an array of table columns for the asset roster module.
 *
/**
 * - Photo: An avatar component displaying the asset's photo.
 * - Type: The name of the asset type.
 * - Make: The name of the asset's make.
 * - Model: The name of the asset's model.
 * - Serial Number: The serial number of the asset.
 * - Location: The name of the asset's location.
 * - Vendor: The name of the asset's vendor.
 * - Acquired Date: The date the asset was acquired.
 * - Next PM Due: The date the asset is next due for maintenance.
 * - Status: The current status of the asset (active, awaiting commissioning, under service, decommissioned, or in PM).
 *
 * @param assetPictures A signal containing a record of asset IDs to their corresponding photos.
 * @returns An array of table columns for the asset roster module.
 */

export const assetRosterColumns = (
  assetPictures: Signal<Record<string, string>>
): tableColumn<assetRoster>[] => [
  //photo
{
    field: 'photo',
    title: 'PHOTO',
    type: 'text',
    component: (row: assetRoster): DynamicComponent<any> => ({
      component: Avatar,
      inputs: {
        image:
          assetPictures()[row._id] ||
          'https://st2.depositphotos.com/3904951/8925/v/450/depositphotos_89250312-stock-illustration-photo-picture-web-icon-in.jpg',
        shape: 'square',
        size: 'large',
      },
      outputs: {},
    }),
  },


  {
    field: 'assetTypeIds',
    parseField: (value: assetType[]) => value[0]?.name || 'Not set',
    title: 'TYPE',
    type: 'text',
  },
  {
    field: 'makeIds',
    parseField: (value: contact[]) => value[0]?.name || 'Not set',
    title: 'MAKE',
    type: 'text',
  },
  {
    field: 'productModel',
    sortable: true,
    title: 'MODEL',
    type: 'text',
  },
  {
    field: 'serialNumber',
    sortable: true,
    title: 'SERIAL NUMBER',
    type: 'text',
  },
  {
    field: 'locationId.name',
    title: 'LOCATION',
      parseField: (value) => value?.name || 'Not set',

    type: 'text',
  },
  {
    field: 'vendorIds',
    parseField: (value: contact[]) => value[0]?.name || 'Not set',
    title: 'VENDOR',
    type: 'text',
  },
  {
    field: 'acquiredDate',
    sortable: true,
    title: 'ACQUIRED DATE',
    type: 'date',
  },
  {
    field: 'maintenanceDate',
    sortable: true,
    title: 'NEXT PM DUE',
    type: 'date',
  },
  {
    field: 'status',
    sortable: true,
    component: (value: assetRoster) => {
      const inputs: { text: string; variant: Tag['severity'] } = (() => {
        switch (value.status) {
          case 'active':
            return {
              text: 'Active',
              variant: 'success',
            };
          case 'awaiting-commissioning':
            return {
              text: 'Awaiting commissioning',
              variant: 'warn',
            };
          case 'under-service':
            return {
              text: 'Under service',
              variant: 'warn',
            };
          case 'decommissioned':
            return {
              text: 'Decommissioned',
              variant: 'danger',
            };
          case 'in-pm':
            return {
              text: 'In PM',
              variant: 'info',
            };
          default: {
            return {
              text: 'Unknown',
              variant: 'warn',
            };
          }
        }
      })();

      const component: DynamicComponent<any> = {
        component: Tag,
        inputs: {
          value: inputs.text,
          severity: inputs.variant,
        },
        outputs: {},
      };

      return component;
    },
    title: 'STATUS',
    type: 'text',
  },
];
