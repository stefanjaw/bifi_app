import { filter } from '@avalantec/base-app/resource';
import { uom } from '../interfaces/uom';

export const uomFilters: filter<uom>[] = [{ field: 'name', operator: 'like', type: 'string' }];
