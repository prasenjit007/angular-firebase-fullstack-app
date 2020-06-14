import {Subject} from 'rxjs';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class UIService{
    loadingStateChanged = new Subject<boolean>();

    constructor(private snackBar: MatSnackBar){

    }

    showSnackBar(message, action, dureation){
        this.snackBar.open(message, action, {
            duration: dureation
        })
    }
}