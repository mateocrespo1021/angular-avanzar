import { CategoriaProducto } from "app/modules/emprendedora/ecommerce/inventory/inventory.types";

export class Productos {
    idProducto?: number;
    nombreProducto: string;
    precioInicialProducto:number;
    precioFinalProducto:number;
    precioFijoProducto: number;
    cantidadDisponible:number;
    pesoProducto: string;
    estadoProducto?: boolean;
    categoriaProducto: CategoriesProd;
}


export class ProductosModels {
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
    categoriaProducto: CategoriesProd;
}


export class CategoriesProd {
    idCategoriaProducto: number;
    nombreCategoria: string;

}
