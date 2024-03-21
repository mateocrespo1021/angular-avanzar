import { Routes } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { ListAdminClienteComponent } from './list-cliente.component';

export default [
    {
        path     : '',
        component: ListAdminClienteComponent,
    },
] as Routes;
