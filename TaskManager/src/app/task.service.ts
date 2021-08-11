import { Injectable } from '@angular/core';
import { Task } from './models/task.model';
import { WebService } from './web.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private webService: WebService) {}

  createList(title: string) {
    return this.webService.post('lists', { title });
  }
  getLists() {
    return this.webService.get('lists');
  }
  createTask(content: string, listId: string) {
    return this.webService.post(`lists/${listId}/tasks`, { content });
  }
  getTasks(listId: string) {
    return this.webService.get(`lists/${listId}/tasks`);
  }
  complete(task: Task) {
    return this.webService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      _id: task._id,
      content: task.content,
      _listId: task._listId,
      isCompleted: true,
    });
  }
}
