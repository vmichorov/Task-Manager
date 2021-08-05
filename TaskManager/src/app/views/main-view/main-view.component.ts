import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
})
export class MainViewComponent implements OnInit {
  constructor(private taskService: TaskService) {}

  ngOnInit(): void {}

  createNewList() {
    this.taskService.createList('Test').subscribe((res: any) => {
      console.log(res);
    });
  }
}
