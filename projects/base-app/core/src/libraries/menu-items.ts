import { InjectionToken, Signal } from '@angular/core';
import { MenuItem } from 'primeng/api';

export const MENU_ITEMS = new InjectionToken<Signal<MenuItem[]>>('MENU_ITEMS');
