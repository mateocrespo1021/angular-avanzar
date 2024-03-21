export class Servicios {
    idServicio?: number;
    nombreServicio: string;
    precioInicialServicio:number;
    precioFinalServicio:number;
    precioFijoServicio: number;
    tiempoServicio:string;
    cantidadDisponible: number;
    estado?: boolean;
    categoriaServicio:CategoriaServicio;
}

export class ServicioModels {
    idServicio: number;
    nombreServicio: string;
    descripcionServicio:string;
    precioInicialServicio:number;
    precioFinalServicio:number;
    precioFijoServicio: number;
    estado:boolean;
    tiempoServicio:string;
    cantidadDisponible: number;
    miniaturaServicio:string;
    categoriaServicio:CategoriaServicio;
}


export class CategoriaServicio {
    idCategoriaServicio: number;
    nombreCategoria: string;

}