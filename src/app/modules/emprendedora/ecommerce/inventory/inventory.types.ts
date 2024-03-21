import { Vendedor } from "app/services/models/vendedora";

export interface InventarioProductos {
    idProducto: number;
    nombreProducto: string;
    precioInicialProducto:number;
    precioFinalProducto:number;
    precioFijoProducto: number;
    cantidadDisponible: number;
    estadoProducto: boolean;
    descripcionProducto: string;
    miniaturaProducto: string;
    pesoProducto: string;
    categoriaProducto: CategoriaProducto;
}

export interface InventarioServicios {
    idServicio: number;
    nombreServicio: string;
}

export interface CategoriaProducto {
    idCategoriaProducto: number;
    nombreCategoria: string;

}

export interface InventarioPublicaciones {

    idPublicacion: number;
    tituloPublicacion: string;
    descripcionPublicacion: string;
    estado: boolean;
    visible:boolean;
    fechaPublicacion: Date;
    imagenes: string[];
    tiempoTranscurrido:string;
    vendedor?: Vendedor ;
    categoria?: CategoriaPublicacion ;
    productos?: InventarioProductos;
    servicios?: InventarioServicios;
}



export interface CategoriaPublicacion {

    idCategoria: number;
    nombreCategoria: string;

}

export interface InventoryPagination {
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}
