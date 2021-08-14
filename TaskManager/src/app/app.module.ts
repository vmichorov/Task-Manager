import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainViewComponent } from './views/main-view/main-view.component';
import { CreateListComponent } from './views/create-list/create-list.component';
import { CreateTaskComponent } from './views/create-task/create-task.component';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { WebReqInterceptor } from './web-req.interceptor.service';
import { RegisterPageComponent } from './views/register-page/register-page.component';
import { EditListComponent } from './views/edit-list/edit-list.component';
import { EditTaskComponent } from './views/edit-task/edit-task.component';

@NgModule({
  declarations: [
    AppComponent,
    MainViewComponent,
    CreateListComponent,
    CreateTaskComponent,
    LoginPageComponent,
    RegisterPageComponent,
    EditListComponent,
    EditTaskComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: WebReqInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
