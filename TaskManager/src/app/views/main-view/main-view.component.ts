import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { List } from 'src/app/models/list.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
})
export class MainViewComponent implements OnInit {
  lists: List[] = [];
  tasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.taskService.getTasks(params.listId).subscribe((tasks: any) => {
        this.tasks = tasks;
      });
    });
    this.taskService.getLists().subscribe((lists: any) => {
      this.lists = lists;
    });
  }

  onClick(task: Task) {
    this.taskService.complete(task).subscribe(() => {
      console.log('Completed');
      task.isCompleted = true;
    });
  }
}
