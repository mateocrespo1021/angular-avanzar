import { Persona } from "./persona";

export class Usuario {
    id?: number;
    username: string='';
    name: string='';
    password: string='';
    enabled ?: boolean;
    visible: boolean;
    persona?:Persona;
}