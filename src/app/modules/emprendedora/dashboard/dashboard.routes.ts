import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { DashboardEmprendedoraComponentimplements } from 'app/modules/emprendedora/dashboard/dashboard.component';
import { dashboardService } from 'app/modules/emprendedora/dashboard/dashboard.service';

export default [
    {
        path     : '',
        component: DashboardEmprendedoraComponentimplements,
        resolve  : {
            data: () => inject(dashboardService).getData(),
        },
    },

    
] as Routes;
