import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Exercise } from './../exercise.model';
import { TrainingService } from './../training.service';
import {MatSort} from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private finishedExchangedSubscription: Subscription;

  displayedColumns = ['date', 'name', 'calories', 'duration', 'state'];
  dataSource = new MatTableDataSource<Exercise>();

  constructor(private trainingService: TrainingService) { }

  ngOnDestroy(): void {
    if(this.finishedExchangedSubscription)
      this.finishedExchangedSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.finishedExchangedSubscription = this.trainingService.finishedExercisesChanged.subscribe(
      (exercises: Exercise[]) =>{
      this.dataSource.data=exercises;
      }
    );
    this.trainingService.fetcheCancelledOrCompletedExercises()
  }

  doFilter(filterValue: String){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
