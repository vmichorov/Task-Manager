import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainViewComponent } from './views/main-view/main-view.component';
import { CreateListComponent } from './views/create-list/create-list.component';
import { CreateTaskComponent } from './views/create-task/create-task.component';

@NgModule({
  declarations: [AppComponent, MainViewComponent, CreateListComponent, CreateTaskComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
