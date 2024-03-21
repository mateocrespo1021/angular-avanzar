import { InventarioProductos } from "app/modules/emprendedora/ecommerce/inventory/inventory.types";
import { Vendedor } from "./vendedora";
import { InventarioServicios } from "app/modules/emprendedora/ecommerce copy/inventory/inventoryServicios.types";

export class Publicacion{
    idPublicacion: number;
    tituloPublicacion: string;
    descripcionPublicacion: string;
    estado: boolean;
    visible:boolean;
    fechaPublicacion: Date;
    tiempoTranscurrido:string;
    imagenes: string[];
    vendedor?: Vendedor ;
    categoria?: CategoriaPublicacion ;
    productos?: InventarioProductos;
    servicios?: InventarioServicios;

}

export class PublicacionA{
    idPublicacion?: number;
    tituloPublicacion: string;
    descripcionPublicacion: string;
    estado: boolean;
    visible: boolean;
    vendedor?: Vendedor ;
}

export class PublicacionB{
    estado: boolean;
    visible:boolean;
}
export class CategoriaPublicacion {

    idCategoria: number;
    nombreCategoria: string;

}