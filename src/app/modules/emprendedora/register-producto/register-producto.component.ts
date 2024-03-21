import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
    selector     : 'register-producto',
    standalone   : true,
    templateUrl  : './register-producto.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class RegisterEmpreProductoComponent implements OnInit
{
    /**
     * Constructor
     */
    constructor(private fb: FormBuilder)
    {
        
    }

    ngOnInit(): void {
        
    }
}
