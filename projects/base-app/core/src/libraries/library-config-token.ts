import { InjectionToken } from '@angular/core';
import { libraryConfig } from '../interfaces/library-config';

export const LIBRARY_CONFIG = new InjectionToken<libraryConfig>('libraryConfig');
