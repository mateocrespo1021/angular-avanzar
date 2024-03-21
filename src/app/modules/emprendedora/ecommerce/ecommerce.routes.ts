import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryListComponent } from './inventory/list/inventory.component';
import { InventoryService } from './inventory/inventory.service';


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
                component: InventoryListComponent,
                resolve  : {
                    categoriesProducto: () => inject(InventoryService).getCategoriesProducto(),
                    categoriesPublicacion: () => inject(InventoryService).getCategoriesPublicacion(),
                    publicaciones  : () => inject(InventoryService).getProducts(),
                },
            },
        ],
    },
] as Routes;
