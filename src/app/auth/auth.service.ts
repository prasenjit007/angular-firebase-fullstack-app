import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from 'angularfire2/auth';

import { AuthData } from './auth-data.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingService } from './../training/training.service';
import { UIService } from './../shared/ui.service';



@Injectable()
export class AuthService{
    authChange = new Subject<boolean>()
    private isAuthenticated: boolean;

    constructor(private router: Router, 
        private afAuth: AngularFireAuth, 
        private trainingService: TrainingService,
        private uIService: UIService){

    }
    registerUser(authData : AuthData){
        /*this.user = {
            email: authData.email,
            userId: Math.round(Math.random() * 10000).toString(),
            password: authData.password
        }*/
        this.uIService.loadingStateChanged.next(true);
        this.afAuth.auth
        .createUserWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
            this.uIService.loadingStateChanged.next(false);
        })
        .catch(err => {
            console.log(err);
            this.uIService.loadingStateChanged.next(false);
            this.uIService.showSnackBar(err.message, null, 3000);
            /*this.snackBar.open(err.message, null, {
                duration: 3000
            })*/
        });
        
    }

    login(authData : AuthData){
        this.uIService.loadingStateChanged.next(true);
        /*this.user = {
            email: authData.email,
            userId: Math.round(Math.random() * 10000).toString(),
            password: authData.password
        }*/
        this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
            this.uIService.loadingStateChanged.next(false);
        })
        .catch(
            err => {
                console.log(err);
                this.uIService.loadingStateChanged.next(false);
                this.uIService.showSnackBar(err.message, null, 3000);
                /*this.snackBar.open(err.message, null, {
                    duration: 3000
                })*/
            }
        );
       //this.authSuccessfully();
    }

    logout(){
        this.afAuth.auth.signOut();
    }


    initOfListener(){
        this.afAuth.authState.subscribe(user => {
            if(user){
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/training']);
            }else{
                this.trainingService.cancelSubscription();
                this.isAuthenticated=false;
                this.authChange.next(false);
                this.router.navigate(['/login']);
            }
        })
    }
  

    isAuth(){
        return this.isAuthenticated;
    }
}