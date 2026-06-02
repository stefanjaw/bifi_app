import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const EMAIL_MARKETING_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/dashboard/dashboard').then(m => m.EmailDashboard),
    data: { resource: 'email-marketing/dashboard' },
  },
  {
    path: 'campaigns',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/campaigns-list/campaigns-list').then(
        m => m.CampaignsList
      ),
    data: { resource: 'email-campaigns/list' },
  },
  {
    path: 'campaigns/create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/campaign-form/campaign-form').then(
        m => m.CampaignForm
      ),
    data: { resource: 'email-campaigns/create' },
  },
  {
    path: 'campaigns/edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/campaign-form/campaign-form').then(
        m => m.CampaignForm
      ),
    data: { resource: 'email-campaigns/update' },
  },
  {
    path: 'templates',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/templates-list/templates-list').then(
        m => m.TemplatesList
      ),
    data: { resource: 'email-templates/list' },
  },
  {
    path: 'templates/create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/template-form/template-form').then(
        m => m.TemplateForm
      ),
    data: { resource: 'email-templates/create' },
  },
  {
    path: 'templates/edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/template-form/template-form').then(
        m => m.TemplateForm
      ),
    data: { resource: 'email-templates/update' },
  },
  {
    path: 'lists',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/mailing-lists-list/mailing-lists-list').then(
        m => m.MailingListsList
      ),
    data: { resource: 'mailing-lists/list' },
  },
  {
    path: 'lists/create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/mailing-list-form/mailing-list-form').then(
        m => m.MailingListFormComponent
      ),
    data: { resource: 'mailing-lists/create' },
  },
  {
    path: 'lists/edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/mailing-list-form/mailing-list-form').then(
        m => m.MailingListFormComponent
      ),
    data: { resource: 'mailing-lists/update' },
  },
  {
    path: 'subscribers',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/subscribers-list/subscribers-list').then(
        m => m.SubscribersList
      ),
    data: { resource: 'subscribers/list' },
  },
  {
    path: 'subscribers/create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/subscriber-form/subscriber-form').then(
        m => m.SubscriberFormComponent
      ),
    data: { resource: 'subscribers/create' },
  },
  {
    path: 'subscribers/edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/subscriber-form/subscriber-form').then(
        m => m.SubscriberFormComponent
      ),
    data: { resource: 'subscribers/update' },
  },
];

export const EMAIL_MARKETING_SETTINGS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'config',
  },
  {
    path: 'config',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import(
        '../modules/email-settings/features/email-settings-form/email-settings-form'
      ).then(m => m.EmailSettingsFormComponent),
    data: { resource: 'email-settings/update' },
  },
];
