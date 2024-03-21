import { Publicacion } from "./publicaciones";
import { Usuario } from "./usuario";

export class Comentario{


    idComentario:number;
    texto:string;
    fecha:Date;
    usuario:Usuario
    publicaciones:Publicacion;
}