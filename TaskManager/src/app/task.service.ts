import { Injectable } from '@angular/core';
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
  getTasks(listId: string) {
    return this.webService.get(`lists/${listId}/tasks`);
  }
}