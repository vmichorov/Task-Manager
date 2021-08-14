import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router
  ) {}

  listId: string = '';
  taskId: string = '';

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.listId = params.listId;
      this.taskId = params.taskId;
    });
  }
  updateTask(newContent: string) {
    this.taskService
      .updateTask(this.listId, this.taskId, newContent)
      .subscribe(() => {
        this.router.navigate(['/lists', this.listId]);
      });
  }
}
