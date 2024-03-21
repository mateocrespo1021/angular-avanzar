import { Routes } from '@angular/router';
import { DashboardResponsableComponent } from './dashboard.component';
import { inject } from '@angular/core';
import { dashboardService } from 'app/modules/responsable/dashboard/dashboard.service';
export default [
    {
        path     : '',
        component: DashboardResponsableComponent,
        resolve  : {
            data: () => inject(dashboardService).getData(),
        },
    },
] as Routes;
