import { InputSignal, OutputEmitterRef, Type } from '@angular/core';

export type ComponentInputs<T> = {
  [K in keyof T as T[K] extends InputSignal<infer R> ? K : never]?: T[K] extends InputSignal<
    infer R
  >
    ? R
    : never;
};

export type ComponentOutputs<T> = {
  [K in keyof T as T[K] extends OutputEmitterRef<infer R>
    ? K
    : never]?: T[K] extends OutputEmitterRef<infer R> ? OutputEmitterRef<R>['emit'] : never;
};

export type ComponentType = any;

export interface DynamicComponent<TComponent extends ComponentType = ComponentType> {
  component: Type<TComponent>;
  inputs?: ComponentInputs<TComponent>;
  outputs?: ComponentOutputs<TComponent>;
}