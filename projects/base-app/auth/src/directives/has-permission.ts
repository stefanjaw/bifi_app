/* eslint-disable @angular-eslint/directive-selector */
import { computed, Directive, effect, input } from '@angular/core';
import { injectAuthService } from '../libraries/providers/auth-service-provider';
import { BaseStructuralConditional } from '@avalantec/base-app/core';
import { permission } from '../interfaces/permission';
import { policyAction, policyType, resource } from '@avalantec/base-app/interfaces';

@Directive({
  selector: '[bifiAppHasPermission]',
})
export class HasPermission<TResourceData = unknown> extends BaseStructuralConditional {
  private auth = injectAuthService();

  permission = input.required<permission | undefined>({ alias: 'bifiAppHasPermission' });
  resourceData = input<TResourceData>();
  context = input<object>();

  resource = computed<resource | undefined>(() =>
    this.auth.getPermissionResource(this.permission())
  );

  action = computed<policyAction | undefined>(() =>
    this.auth.getPermissionAction(this.permission())
  );

  type = computed<policyType | undefined>(() => this.auth.getPermissionType(this.permission()));

  hasPermission = this.auth.createPermissionSignal({
    resource: this.resource,
    action: this.action,
    type: this.type,
    resourceData: this.resourceData,
    context: this.context,
  });

  constructor() {
    super();
    effect(() => {
      this.setCondition(this.hasPermission());
    });
  }
}
