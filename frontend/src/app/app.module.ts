import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/app-container/home/home.component';
import { LoginComponent } from './components/auth-container/login/login.component';
import { RegisterComponent } from './components/auth-container/register/register.component';
import { AuthContainerComponent } from './components/auth-container/auth-container/auth-container.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth/auth.interceptor';
import { AppContainerComponent } from './components/app-container/app-container/app-container.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChatComponent } from './components/app-container/chat/chat.component';
import { MessageComponent } from './components/app-container/message/message.component';
import { ChatInfoComponent } from './components/app-container/chat-info/chat-info.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AuthContainerComponent,
    AppContainerComponent,
    ChatComponent,
    MessageComponent,
    ChatInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    HttpClientModule,
    MatSidenavModule,
    MatIconModule,
    MatMenuModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
