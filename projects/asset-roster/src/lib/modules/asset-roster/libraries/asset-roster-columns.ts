import { assetRoster } from '../interfaces/asset-roster';
import { assetType } from '../../asset-types';
import { DynamicComponentConfig, tableColumn } from '@avalantec/base-app/resource';
import { contact } from '@avalantec/base-app/interfaces';
import { Tag } from 'primeng/tag';
import { Avatar } from 'primeng/avatar';
import { Signal } from '@angular/core';

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
    title: 'photo',
    type: 'text',
    component: (row: assetRoster): DynamicComponentConfig<any> => ({
      component: Avatar,
      inputs: {
        image:
          assetPictures()[row._id] ||
          'https://st2.depositphotos.com/3904951/8925/v/450/depositphotos_89250312-stock-illustration-photo-picture-web-icon-in.jpg',
        shape: 'square',
        size: 'large',
        styleClass: `
        relative
        origin-left
        will-change-transform
        hover:scale-[5]
        hover:z-50
        transition-transform
        duration-300
      `,
      },
      outputs: {},
    }),
  },

  {
    field: 'assetTypeIds',
    parseField: (value: assetType[]) => value[0]?.name || 'Not set',
    title: 'type',
    type: 'text',
  },
  {
    field: 'makeIds',
    parseField: (value: contact[]) => value[0]?.name || 'Not set',
    title: 'make',
    type: 'text',
  },
  {
    field: 'productModel',
    sortable: true,
    title: 'model',
    type: 'text',
  },
  {
    field: 'serialNumber',
    sortable: true,
    title: 'serialNumber',
    type: 'text',
  },
  {
    field: 'locationId.name',
    title: 'location',
    parseField: value => value?.name || 'Not set',

    type: 'text',
  },
  {
    field: 'vendorIds',
    parseField: (value: contact[]) => value[0]?.name || 'Not set',
    title: 'vendor',
    type: 'text',
  },
  {
    field: 'acquiredDate',
    sortable: true,
    title: 'acquiredDate',
    type: 'date',
  },
  {
    field: 'maintenanceDate',
    sortable: true,
    title: 'nextPmDue',
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

      const component: DynamicComponentConfig<any> = {
        component: Tag,
        inputs: {
          value: inputs.text,
          severity: inputs.variant,
        },
        outputs: {},
      };

      return component;
    },
    title: 'status',
    type: 'text',
  },
];
