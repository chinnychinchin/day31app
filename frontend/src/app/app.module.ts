import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import {AuthService} from './auth.service';
import {CanLeaveService} from './canLeave.service'

import { AppComponent } from './app.component';
import { MainComponent } from './components/main.component';
import { LoginComponent } from './components/login.component';
import { ErrorComponent } from './components/error.component';

const ROUTES : Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'main', component: MainComponent, canActivate: [AuthService], canDeactivate: [CanLeaveService]},
  {path: 'error', component: ErrorComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    FormsModule,
    ReactiveFormsModule

  ],
  providers: [AuthService, CanLeaveService],
  bootstrap: [AppComponent]
})
export class AppModule { }
