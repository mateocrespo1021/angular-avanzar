import { Routes } from '@angular/router';
import { DashboardAdminComponent } from './dashboard.component';
import { inject } from '@angular/core';
import { dashboardService } from 'app/modules/admin/dashboard/dashboard.service';
export default [
    {
        path     : '',
        component: DashboardAdminComponent,
        resolve  : {
            data: () => inject(dashboardService).getData(),
        },
    },
] as Routes;
