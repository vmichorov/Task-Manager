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
  deleteList(id: string) {
    return this.webService.delete(`lists/${id}`);
  }
  updateList(id: string, title: string) {
    return this.webService.patch(`lists/${id}`, { title });
  }
  createTask(content: string, listId: string) {
    return this.webService.post(`lists/${listId}/tasks`, { content });
  }
  getTasks(listId: string) {
    return this.webService.get(`lists/${listId}/tasks`);
  }
  deleteTask(listId: string, taskId: string) {
    return this.webService.delete(`lists/${listId}/tasks/${taskId}`);
  }
  updateTask(listId: string, taskId: string, content: string) {
    return this.webService.patch(`lists/${listId}/tasks/${taskId}`, {
      content,
    });
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
