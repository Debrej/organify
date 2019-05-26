import { Component, OnInit } from '@angular/core';
import {TaskService} from "../../task.service";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  private token: string;
  taskName: any;
  time: any;
  location: any;
  date: any;
  desc: any;
  private idTask: any;

  constructor(private _taskService: TaskService) {

    this.token = localStorage.getItem('token');

    this.location='TD C';

    this._taskService.passToken(this.token);

    this._taskService.getTaskAll().subscribe(ret => {
      let data = JSON.parse(JSON.stringify(ret));
      console.log(data.task[0]);
      this.desc = data.task[0].description;
      this.taskName = data.task[0].name;
      this.idTask = data.task[0].idTask;

      this._taskService.getTaskShift(this.idTask).subscribe(ret => {
        let data = JSON.parse(JSON.stringify(ret));

        console.log(data);

        let start_date = data.subshift[0].start_date.substr(11, 5);
        let end_date = data.subshift[data.subshift.length - 1].end_date.substr(11, 5);

        console.log(start_date + " - " + end_date);
        this.time = start_date + " - " + end_date;

        this.date = data.subshift[0].start_date.substr(0, 10);
      });

    });
  }

  ngOnInit() {
  }

}
