import { Subject } from 'rxjs/Subject';
import { Exercise } from './exercise.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
//import { TrainingService } from './training.service';
import { UIService } from './../shared/ui.service';

@Injectable()
export class TrainingService{
    exerciseChnaged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();

    private fbSubs: Subscription[]=[];

    private availableExercise: Exercise[] = [];
    private availableExerciseOLD: Exercise[] = [
        {
            id: 'crunches',
            name: 'Crunches',
            duration: 30,
            calories: 8
         },
         {
            id: 'side-lunges',
            name: 'Side Lunges',
            duration: 160,
            calories: 15
         },
         {
            id: 'touch-toes',
            name: 'Touch Toes',
            duration: 180,
            calories: 18
         },
         {
            id: 'burpees',
            name: 'Burpees',
            duration: 120,
            calories: 8
         },
         {
            id: 'pushups',
            name: 'Pushups',
            duration: 60,
            calories: 10
         },
         {
            id: 'squats',
            name: 'Squats',
            duration: 50,
            calories: 5
         },
    ];

    private runningExercise: Exercise;
    constructor(private db: AngularFirestore, private uIService: UIService){}


    cancelSubscription(){
        this.fbSubs.forEach(subs => subs.unsubscribe())
    }

    fetchAvailableExercise(){
        //return [...this.availableExercise]
        //or
        //return this.availableExercise.slice();
        

    this.fbSubs.push(this.db.collection("availableExercises")
    .snapshotChanges()
    .pipe(map(docArray => {
      return docArray.map(doc=>{
        const exercise = doc.payload.doc.data() as Exercise;
        const id = doc.payload.doc.id;
        return {
            id, ...exercise
        }
      })
    }))
    .subscribe((exercises : Exercise[])=>{
        console.log(exercises)
        this.availableExercise = exercises;
        this.exercisesChanged.next([...this.availableExercise]);
    }, err => {
        console.log(err)
        this.uIService.showSnackBar("Fetching Exercises failed, please try after sometime.", null, 3000);
    }));
    
    }

    startExercise(selectedId: string){
        //this.db.doc('availableExercises/'+selectedId).update({lastSelected: new Date()})
        this.runningExercise = this.availableExercise.find(
            ex => ex.id === selectedId
        );

        this.exerciseChnaged.next({...this.runningExercise});
    }

    getRunningExercise(){
        return {...this.runningExercise}
    }

    completeExercise(){
        this.addTrainingDataToDataBase({...this.runningExercise, date: new Date(), state: 'completed'});
        this.runningExercise = null;
        this.exerciseChnaged.next(null);
    }

    cancelExercise(progress: number){
        this.addTrainingDataToDataBase(
            {
                ...this.runningExercise, 
                duration: this.runningExercise.duration * (progress / 100),
                calories: this.runningExercise.calories * (progress / 100),
                date: new Date(), 
                state: 'cancelled'
            }
        );
        this.runningExercise = null;
        this.exerciseChnaged.next(null);
    }

    fetcheCancelledOrCompletedExercises(){
        //return this.finishedExercises.slice();
        //finishedExercisesChanged
        this.fbSubs.push(this.db.collection('finishedExercises')
        .valueChanges()
        .subscribe(
            (exe: Exercise[] )=> {
            this.finishedExercisesChanged.next(exe)
            }, err => {
                this.uIService.showSnackBar("Fetching Past Exercises failed, please try after sometime.", null, 3000);
            }
        ));
    }

    private addTrainingDataToDataBase(exercise: Exercise){
        this.db.collection('finishedExercises').add(exercise);
    }

}