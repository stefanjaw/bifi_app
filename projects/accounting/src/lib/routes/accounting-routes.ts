import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const ACCOUNTING_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'accounts',
  },
  {
    path: 'accounts',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/accounts-list/accounts-list').then(m => m.AccountsList),
    data: { resource: 'accounting/accounts/list' },
  },
  {
    path: 'accounts/create',
    canActivate: [permissionGuard],
    loadComponent: () => import('../features/account-form/account-form').then(m => m.AccountForm),
    data: { resource: 'accounting/accounts/create' },
  },
  {
    path: 'accounts/edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () => import('../features/account-form/account-form').then(m => m.AccountForm),
    data: { resource: 'accounting/accounts/update' },
  },
  {
    path: 'journals',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/journals-list/journals-list').then(m => m.JournalsList),
    data: { resource: 'accounting/journals/list' },
  },
  {
    path: 'journals/create',
    canActivate: [permissionGuard],
    loadComponent: () => import('../features/journal-form/journal-form').then(m => m.JournalForm),
    data: { resource: 'accounting/journals/create' },
  },
  {
    path: 'journals/edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () => import('../features/journal-form/journal-form').then(m => m.JournalForm),
    data: { resource: 'accounting/journals/update' },
  },
  {
    path: 'journal-entries',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/journal-entries-list/journal-entries-list').then(
        m => m.JournalEntriesList
      ),
    data: { resource: 'accounting/journal-entries/list' },
  },
  {
    path: 'journal-entries/create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/journal-entry-form/journal-entry-form').then(m => m.JournalEntryForm),
    data: { resource: 'accounting/journal-entries/create' },
  },
  {
    path: 'journal-entries/edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/journal-entry-form/journal-entry-form').then(m => m.JournalEntryForm),
    data: { resource: 'accounting/journal-entries/update' },
  },
  {
    path: 'payments',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/payments-list/payments-list').then(m => m.PaymentsList),
    data: { resource: 'accounting/payments/list' },
  },
  {
    path: 'payments/create',
    canActivate: [permissionGuard],
    loadComponent: () => import('../features/payment-form/payment-form').then(m => m.PaymentForm),
    data: { resource: 'accounting/payments/create' },
  },
  {
    path: 'taxes',
    canActivate: [permissionGuard],
    loadComponent: () => import('../features/taxes-list/taxes-list').then(m => m.TaxesList),
    data: { resource: 'accounting/taxes/list' },
  },
  {
    path: 'taxes/create',
    canActivate: [permissionGuard],
    loadComponent: () => import('../features/tax-form/tax-form').then(m => m.TaxForm),
    data: { resource: 'accounting/taxes/create' },
  },
  {
    path: 'taxes/edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () => import('../features/tax-form/tax-form').then(m => m.TaxForm),
    data: { resource: 'accounting/taxes/update' },
  },
  {
    path: 'discounts',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/discounts-list/discounts-list').then(m => m.DiscountsList),
    data: { resource: 'accounting/discounts/list' },
  },
  {
    path: 'discounts/create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/discount-form/discount-form').then(m => m.DiscountForm),
    data: { resource: 'accounting/discounts/create' },
  },
  {
    path: 'discounts/edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/discount-form/discount-form').then(m => m.DiscountForm),
    data: { resource: 'accounting/discounts/update' },
  },
  {
    path: 'fiscal-positions',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/fiscal-positions-list/fiscal-positions-list').then(
        m => m.FiscalPositionsList
      ),
    data: { resource: 'accounting/fiscal-positions/list' },
  },
  {
    path: 'fiscal-positions/create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/fiscal-position-form/fiscal-position-form').then(
        m => m.FiscalPositionForm
      ),
    data: { resource: 'accounting/fiscal-positions/create' },
  },
  {
    path: 'fiscal-positions/edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/fiscal-position-form/fiscal-position-form').then(
        m => m.FiscalPositionForm
      ),
    data: { resource: 'accounting/fiscal-positions/update' },
  },
  {
    path: 'payment-terms',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/payment-terms-list/payment-terms-list').then(m => m.PaymentTermsList),
    data: { resource: 'accounting/payment-terms/list' },
  },
  {
    path: 'payment-terms/create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/payment-term-form/payment-term-form').then(m => m.PaymentTermForm),
    data: { resource: 'accounting/payment-terms/create' },
  },
  {
    path: 'payment-terms/edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/payment-term-form/payment-term-form').then(m => m.PaymentTermForm),
    data: { resource: 'accounting/payment-terms/update' },
  },
  {
    path: 'invoices',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/invoices-list/invoices-list').then(m => m.InvoicesList),
    data: { resource: 'accounting/invoices/list' },
  },
  {
    path: 'invoices/create',
    canActivate: [permissionGuard],
    loadComponent: () => import('../features/invoice-form/invoice-form').then(m => m.InvoiceForm),
    data: { resource: 'accounting/invoices/create' },
  },
  {
    path: 'invoices/edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () => import('../features/invoice-form/invoice-form').then(m => m.InvoiceForm),
    data: { resource: 'accounting/invoices/update' },
  },
];
