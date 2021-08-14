import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { List } from 'src/app/models/list.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss'],
})
export class MainViewComponent implements OnInit {
  lists: any = [];
  tasks: any = [];

  selectedListId: string = '';

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params.listId) {
        this.selectedListId = params.listId;
        this.taskService.getTasks(params.listId).subscribe((tasks: any) => {
          this.tasks = tasks;
        });
      } else {
        this.tasks = undefined;
      }
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
  onLogoutBtnClick() {
    this.authService.logout();
  }

  onDeleteListClick() {
    this.taskService.deleteList(this.selectedListId).subscribe((res: any) => {
      console.log(res);
      this.router.navigate(['/lists']);
    });
  }

  onDeleteTaskClick(id: string) {
    this.taskService
      .deleteTask(this.selectedListId, id)
      .subscribe((res: any) => {
        this.tasks = this.tasks.filter((value: any) => value._id !== id);
        console.log(res);
      });
  }
}
