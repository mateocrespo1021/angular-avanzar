import { InventarioPublicaciones } from "app/modules/emprendedora/ecommerce/inventory/inventory.types";
import { Publicacion, PublicacionA } from "./publicaciones";
import { Usuario } from "./usuario";

export class Destacados {
    idDestacado: number;
    fecha: string;
    estadoDestacado: boolean;
    publicaciones?: InventarioPublicaciones;
    usuario?: Usuario;

}