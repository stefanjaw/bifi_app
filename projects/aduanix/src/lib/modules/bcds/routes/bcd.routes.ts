import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const BCD_ROUTES: Routes = [

    {
        //edit
        path: 'edit/:id',
        canActivate: [permissionGuard],
        data: { resource: 'bcds/form' },
    },
];