import { Persona } from "app/services/models/persona";

export class User
{
    constructor(){
        this.persona= new Persona();
    }
    id?: number;
    name:string;
    username: string;
    password:string;
    avatar?: string;
    enabled:boolean;
    visible:boolean;
    persona?:Persona;
}

export class UserA{
    id?: number;
    name?:string;
    username?: string;
    password?:string;
    avatar?: string;
    enabled?:boolean;
    visible?:boolean;
    persona?:Persona;
}
