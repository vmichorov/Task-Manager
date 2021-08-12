import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateListComponent } from './views/create-list/create-list.component';
import { CreateTaskComponent } from './views/create-task/create-task.component';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { MainViewComponent } from './views/main-view/main-view.component';

const routes: Routes = [
  { path: '', redirectTo: 'lists', pathMatch: 'full' },
  { path: 'lists', component: MainViewComponent },
  { path: 'lists/:listId', component: MainViewComponent },
  { path: 'create-list', component: CreateListComponent },
  { path: 'lists/:listId/create-task', component: CreateTaskComponent },
  { path: 'login', component: LoginPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
