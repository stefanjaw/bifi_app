import { computed, inject, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Session } from './session-user';
import { mayBeSignalValue, LIBRARY_CONFIG } from '@avalantec/base-app/core';
import { maybeSignal } from '@avalantec/base-app/core';
import { condition, policyAction, resource, user } from '@avalantec/base-app/interfaces';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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

  createPermissionSignal<TModel = unknown>(
    resource: maybeSignal<resource>,
    action: maybeSignal<policyAction>,
    resourceData?: maybeSignal<TModel>,
    context?: maybeSignal<object>
  ): Signal<boolean> {
    return computed(() => {
      const user = this.user();
      if (!user) return false;

      const resourceValue = mayBeSignalValue(resource);
      const actionValue = mayBeSignalValue(action);
      const resourceDataValue = mayBeSignalValue(resourceData);
      const contextValue = mayBeSignalValue(context);

      return this.hasPermission(user, resourceValue, actionValue, resourceDataValue, contextValue);
    });
  }

  hasPermission<TModel = unknown>(
    user: TUser,
    resource: resource,
    action: policyAction,
    resourceData?: TModel,
    context = {}
  ): boolean {
    if (!this.rbacEnable) return true;

    // Get all user's policies
    const userPolicies = user.roles.flatMap(role => role.policies);

    // Find the policy that matches the resource and action
    const policies = userPolicies.filter(p => p.resource === resource && p.action === action);

    if (!policies.length) {
      return false; // No policy found for the resource and action
    }

    return policies.some(policy => {
      if (policy.conditions.length === 0) {
        return true; // No conditions, permission granted
      }

      // If conditions are provided, check if they match the resource data
      if (!resourceData) {
        return false; // No resource data provided, cannot evaluate conditions
      }

      // Check if all conditions are met
      return policy.conditions.every(condition => {
        return this.evaluateCondition(condition, user, resourceData, context);
      });
    });
  }

  private evaluateCondition<TModel>(
    cond: condition<TModel>,
    user: TUser,
    resourceData: TModel,
    context: object = {}
  ) {
    const left = resourceData[cond.key];
    const right = this.resolveConditionValue(cond.value, user, resourceData, context);

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

  private resolveConditionValue<TModel>(
    value: any,
    user: TUser,
    resourceData: TModel,
    context: object = {}
  ) {
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
