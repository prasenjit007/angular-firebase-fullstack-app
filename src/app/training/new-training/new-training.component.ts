import { Component, OnInit, OnDestroy} from '@angular/core';
import { TrainingService } from './../training.service';
import {  Subscription } from 'rxjs';

import { Exercise } from './../exercise.model';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exerciseSubscription : Subscription;
  availableExercise: Exercise[];

  constructor(private traningService: TrainingService) { }


  ngOnDestroy(): void {
    if(this.exerciseSubscription)
      this.exerciseSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.exerciseSubscription = this.traningService.exercisesChanged.subscribe(exercises =>{
      this.availableExercise = exercises
    });
    this.traningService.fetchAvailableExercise()

    //this.availableExercise = this.traningService.getAvailableExercise();

    // change is for angularfire
    //this.availableExercise = this.db.collection("availableExercises").valueChanges();

    //retrive value with id
    /*this.availableExercise = this.db.collection("availableExercises")
    .snapshotChanges()
    .pipe(map(docArray => {
      return docArray.map(doc=>{
        return {
          id: doc.payload.doc.id,
          name: doc.payload.doc.data().name,
          duration: doc.payload.doc.data().duration,
          calories: doc.payload.doc.data().calories
        }
      })
    }))*/


    
   
  }

  
  onStartTraining(form : NgForm){
    this.traningService.startExercise(form.value.exercise);
  }
}
