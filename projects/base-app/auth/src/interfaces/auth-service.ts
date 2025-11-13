import { computed, inject, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Session } from './session-user';
import { mayBeSignalValue, LIBRARY_CONFIG } from '@avalantec/base-app/core';
import { maybeSignal } from '@avalantec/base-app/core';
import {
  condition,
  policyAction,
  policyType,
  resource,
  user,
} from '@avalantec/base-app/interfaces';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { permission } from './permission';

export abstract class IAuthService<
  TUser extends user,
  TSession extends Session<TUser> = Session<TUser>,
> {
  abstract authClient: AngularFireAuth | any;
  abstract session: Signal<TSession | null>;
  abstract user: Signal<TUser | null>;

  abstract isLoading: Signal<boolean>;
  abstract error: Signal<string | null>;

  abstract authStateReady$: Observable<void>;
  abstract authStateReady: Promise<void>;

  abstract idToken$: Observable<string | null>;

  abstract register(payload: unknown): Promise<boolean>;
  abstract login(payload: unknown): Promise<boolean>;
  abstract signWithGoogle(): Promise<boolean>;
  abstract logout(): Promise<boolean>;

  abstract clearError(): void;
  abstract sendResetPasswordEmail(email: string): Promise<void>;

  private readonly rbacEnable = inject(LIBRARY_CONFIG).rbacEnable;

  createPermissionSignal<TModel = unknown>({
    resource,
    action,
    type = 'model',
    resourceData,
    context,
  }: {
    resource: maybeSignal<resource | undefined>;
    action: maybeSignal<policyAction | undefined>;
    type: maybeSignal<policyType | undefined>;
    resourceData?: maybeSignal<TModel>;
    context?: maybeSignal<object>;
  }): Signal<boolean> {
    return computed(() => {
      const user = this.user();

      if (!user) return false;

      const resourceValue = mayBeSignalValue(resource);
      const actionValue = mayBeSignalValue(action);
      const typeValue = mayBeSignalValue(type);
      const resourceDataValue = mayBeSignalValue(resourceData);
      const contextValue = mayBeSignalValue(context);

      // If no resource or action is provided, grant permission by default
      if (!resourceValue || (!actionValue && !typeValue)) return true;

      return this.hasPermission({
        user: user,
        resource: resourceValue,
        action: actionValue,
        type: typeValue,
        resourceData: resourceDataValue,
        context: contextValue || {},
      });
    });
  }

  //#region Permission utils
  isPermissionAction(action: string) {
    return ['read', 'create', 'update', 'delete'].includes(action);
  }

  isPermissionType(type: string) {
    return ['view', 'menu', 'model'].includes(type);
  }

  getPermissionResource(permission: permission | undefined): resource | undefined {
    const split = permission?.split(':');
    return split?.[0];
  }

  getPermissionAction(permission: permission | undefined): policyAction | undefined {
    const split = permission?.split(':');

    // check if segment is an action
    const segment = split?.[1];

    if (segment && this.isPermissionAction(segment)) return segment as policyAction;
    else return undefined;
  }

  getPermissionType(permission: permission | undefined): policyType | undefined {
    const split = permission?.split(':');

    const segmentA = split?.[1];
    const segmentB = split?.[2];

    if (segmentA && this.isPermissionType(segmentA)) return segmentA as policyType;
    else if (segmentB && this.isPermissionType(segmentB)) return segmentB as policyType;
    else return undefined;
  }
  //#endregion

  hasPermission<TModel = unknown>({
    user,
    resource,
    action,
    type,
    resourceData,
    context = {},
  }: {
    user: TUser;
    resource: resource;
    action?: policyAction;
    type?: policyType;
    resourceData?: TModel;
    context: object;
  }): boolean {
    if (!this.rbacEnable) return true;

    // Get all user's policies
    const userPolicies = user.roles.flatMap(role => role.policies);

    // Find the policy that matches the resource and action and/or type
    const policies = userPolicies.filter(p => {
      // if resource doesnt match, then no
      if (p.policyId.resource !== resource) return false;

      // if action doesnt match if included, then no
      if (action && !p.actions.includes(action)) return false;

      // if type doesnt match if included, then no
      if (type && p.policyId.type !== type) return false;

      return true;
    });

    if (!policies.length) {
      return false; // No policy found for the resource and action
    }

    return policies.some(policy => {
      if (policy.policyId.conditions.length === 0) {
        return true; // No conditions, permission granted
      }

      // If conditions are provided, check if they match the resource data
      if (!resourceData) {
        return false; // No resource data provided, cannot evaluate conditions
      }

      // Check if all conditions are met
      return policy.policyId.conditions.every(condition => {
        return this.evaluateCondition({
          cond: condition,
          user: user,
          resourceData: resourceData,
          context: context,
        });
      });
    });
  }

  private evaluateCondition<TModel>({
    cond,
    user,
    resourceData,
    context = {},
  }: {
    cond: condition<TModel>;
    user: TUser;
    resourceData: TModel;
    context: object;
  }) {
    const left = resourceData[cond.key];
    const right = this.resolveConditionValue({
      value: cond.value,
      user: user,
      resourceData: resourceData,
      context: context,
    });

    switch (cond.operator) {
      case '==':
        return left === right;
      case '!=':
        return left !== right;
      case '>':
        return left > right;
      case '<':
        return left < right;
      case 'in':
        return Array.isArray(cond.value) ? cond.value.includes(left) : false;
      default:
        return false;
    }
  }

  private resolveConditionValue<TModel>({
    value,
    user,
    resourceData,
    context = {},
  }: {
    value: any;
    user: TUser;
    resourceData: TModel;
    context: object;
  }) {
    // Ejemplo {{user.id}}
    if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
      const path = value.slice(2, -2).trim(); // ej: "user.id"
      const [root, ...rest] = path.split('.');

      let source: any;
      if (root === 'user') source = user;
      else if (root === 'resource') source = resourceData;
      else if (root === 'context') source = context;
      else return null;

      return rest.reduce((acc, key) => acc?.[key], source);
    }

    return value;
  }
}
