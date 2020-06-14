import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Subscription} from 'rxjs';
import { UIService } from './../../shared/ui.service';

import { AuthService } from './../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  maxDate;
  minDate;
  isLoading = false;
  private loadingSubs : Subscription;

  constructor(private authService: AuthService, private uIService: UIService) { }

  ngOnDestroy(): void {
    if(this.loadingSubs)
      this.loadingSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.loadingSubs = this.uIService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    // Birth Date should not be 18 years old validation.
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);

    this.minDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear() - 31);
  }

  onSubmit(form : NgForm) {
    this.authService.registerUser(
      {
        email: form.value.email,
        password: form.value.password,
        userId: null
      }
    )
  }
}
