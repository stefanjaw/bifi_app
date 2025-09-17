/* eslint-disable @angular-eslint/directive-selector */
import { computed, Directive, effect, input } from '@angular/core';
import { injectAuthService } from '../libraries/providers/auth-service-provider';
import { BaseStructuralConditional, policyAction, resource } from '@avalantec/base-app/core';
import { permission } from '../interfaces/permission';

@Directive({
  selector: '[bifiAppHasPermission]',
})
export class HasPermission<TResourceData = unknown> extends BaseStructuralConditional {
  private auth = injectAuthService();

  permission = input.required<permission>({ alias: 'bifiAppHasPermission' });
  resourceData = input<TResourceData>();
  context = input<object>();

  resource = computed<resource>(() => {
    const split = this.permission().split(':');
    return split[0];
  });

  action = computed<policyAction>(() => {
    const split = this.permission().split(':');
    return split[1] as policyAction;
  });

  hasPermission = this.auth.createPermissionSignal(
    this.resource,
    this.action,
    this.resourceData,
    this.context
  );

  constructor() {
    super();
    effect(() => {
      this.setCondition(this.hasPermission());
    });
  }
}
