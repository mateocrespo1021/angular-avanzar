import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { InventoryComponent } from './inventory/inventoryServicios.component';
import { InventoryServiceServicios } from './inventory/inventoryServicios.service';
import { InventoryListComponentService } from './inventory/list/inventoryServicios.component';


export default [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'inventory',
    },
    {
        path     : 'inventory',
        component: InventoryComponent,
        children : [
            {
                path     : '',
                component: InventoryListComponentService,
                resolve  : {
                    categoriesServicio: () => inject(InventoryServiceServicios).getCategoriesServicio(),
                    categoriesPublicacion: () => inject(InventoryServiceServicios).getCategoriesPublicacion(),
                    publicaciones  : () => inject(InventoryServiceServicios).getPublicacionesServicios(),
                },
            },
        ],
    },
] as Routes;
