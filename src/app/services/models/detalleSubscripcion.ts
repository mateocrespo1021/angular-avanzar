import { Subscripcion } from "./subscripcion";
import { Vendedor } from "./vendedora";

export class DetalleSubscripcion {
    
    idDetalle_subscripcion: number;
    fechaInicio: Date;
    fechaFin: Date;
    estado: boolean;
    subscripcion ?: Subscripcion
    vendedor ?: Vendedor;

}

