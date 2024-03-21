import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'home'},

    // Redirect signed-in user to the '/example'
    //
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'home'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes')},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes')},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes')},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes')},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes')}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes')},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes')}
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'avanzar-shop', loadChildren: () => import('app/modules/landing/home/home.routes')},
            {path: 'home', loadChildren: () => import('app/modules/landing/home-tienda/home-tienda.routes')},
            {path: 'nosotros', loadChildren: () => import('app/modules/landing/nosotros/nosotros.routes')},
            {path: 'planes', loadChildren: () => import('app/modules/landing/planes/planes.routes')},
            {path: 'contactanos', loadChildren: () => import('app/modules/landing/contactanos/contactanos.routes')},
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
     canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'dash-admin', loadChildren: () => import('app/modules/admin/dashboard/dashboard.routes')},
            {path: 'list-responsables', loadChildren: () => import('app/modules/admin/list-responsables/list-responsables.routes')},
            {path: 'list-emprend', loadChildren: () => import('app/modules/admin/list-emprendedoras/list-emprendedoras.routes')},
            {path: 'list-clie', loadChildren: () => import('app/modules/admin/list-cliente/list-cliente.routes')},
            {path: 'profile-admin', loadChildren: () => import('app/modules/admin/profile/profile.routes')},
            {path: 'register-responsable', loadChildren: () => import('app/modules/admin/register-responsable/register-responsable.routes')},
            {path: 'example', loadChildren: () => import('app/modules/admin/example/example.routes')},
            {path: 'config-admin', loadChildren: () => import('app/modules/admin/settings/settings.routes')},

        ]
    },


        // Responsable de Ventas routes
        {
            path: '',
            canActivate: [AuthGuard],
            canActivateChild: [AuthGuard],
            component: LayoutComponent,
            resolve: {
                initialData: initialDataResolver
            },
            children: [
                {path: 'dash-resp', loadChildren: () => import('app/modules/responsable/dashboard/dashboard.routes')},
                {path: 'list-empre-resp', loadChildren: () => import('app/modules/responsable/list-emprendedoras/list-emprendedoras.routes')},
                {path: 'list-prod-resp', loadChildren: () => import('app/modules/responsable/list-productos/list-productos.routes')},
                {path: 'reg-empre-resp', loadChildren: () => import('app/modules/responsable/register-emprendedora/register-emprendedora.routes')},
                {path: 'profile-resp', loadChildren: () => import('app/modules/responsable/profile/profile.routes')},
                {path: 'config-resp', loadChildren: () => import('app/modules/responsable/settings/settings.routes')},
                {path: 'list-serv-resp', loadChildren: () => import('app/modules/responsable/list-servicios/list-servicios.routes')},
                {path: 'planes-resp', loadChildren: () => import('app/modules/responsable/planes/planes.routes')},

            ]
        },


        //Emprendedora routes
        {
            path: '',
            canActivate: [AuthGuard],
            canActivateChild: [AuthGuard],
            component: LayoutComponent,
            resolve: {
                initialData: initialDataResolver
            },
            children: [
                {path: 'dash-empre', loadChildren: () => import('app/modules/emprendedora/dashboard/dashboard.routes')},
                {path: 'list-empre-publi', loadChildren: () => import('app/modules/emprendedora/list-publicaciones/list-publicacion.routes')},
                {path: 'reg-empre-prod', loadChildren: () => import('app/modules/emprendedora/register-producto/register-producto.routes')},
                {path: 'ecommerce', loadChildren: () => import('app/modules/emprendedora/ecommerce/ecommerce.routes')},
                {path: 'ecommerce-servicios', loadChildren: () => import('app/modules/emprendedora/ecommerce copy/ecommerce.routes')},
                {path: 'reg-empre-serv', loadChildren: () => import('app/modules/emprendedora/register-servicio/register-servicio.routes')},
                {path: 'profile-empre', loadChildren: () => import('app/modules/emprendedora/profile/profile.routes')},
                {path: 'config-empre', loadChildren: () => import('app/modules/emprendedora/settings/settings.routes')},
                {path: 'subscripcion-empre', loadChildren: () => import('app/modules/emprendedora/subscripcion/subscripcion.routes')},
                {path: 'comments', loadChildren: () => import('app/modules/emprendedora/comments/comments.routes')},
            ]
        },

        {
            path: '',
            canActivate: [AuthGuard],
            canActivateChild: [AuthGuard],
            component: LayoutComponent,
            resolve: {
                initialData: initialDataResolver
            },
            children: [
                {path: 'home-cli', loadChildren: () => import('app/modules/client/home-tienda/home-tienda.routes')},
                {path: 'prod-cli', loadChildren: () => import('app/modules/client/productos-vent/productos-vent.routes')},
                {path: 'serv-cli', loadChildren: () => import('app/modules/client/servicios-vent/servicios-vent.routes')},
                {path: 'profile-cli', loadChildren: () => import('app/modules/client/profile/profile.routes')},
                {path: 'fav-cli', loadChildren: () => import('app/modules/client/favoritos/favoritos.routes')},
                {path: 'config-cli', loadChildren: () => import('app/modules/client/settings/settings.routes')},

            ]
        }
];
