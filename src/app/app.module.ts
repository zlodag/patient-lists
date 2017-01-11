import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AngularFireModule, FirebaseAppConfig, AuthProviders, AuthMethods } from 'angularfire2';
import { AppRoutingModule } from './app-routing.module';

import { AuthModule } from './auth.module';

import { LOCALE_ID } from '@angular/core';


import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { TabDashboardComponent, TabTeamComponent, TabPatientComponent } from './tab.component';
import { ProfileComponent } from './profile.component';
import { TeamApplicationsListComponent } from './team-applications-list.component';
import { TeamListComponent } from './team-list.component';
import { UserListComponent } from './user-list.component';
import { UserApplicantListComponent } from './user-applicant-list.component';
import { CommentListComponent } from './comment-list.component';
import { PatientListComponent } from './patient-list.component';
import { PatientComponent } from './patient.component';
import { ProblemListComponent, TaskListComponent } from './item-list.component';
import { NewItemFormComponent } from './new-item-form.component';
import { LoadingComponent } from './loading.component';
import { EditableComponent } from './editable.component';

export const firebaseConfig: FirebaseAppConfig = {
    apiKey: 'AIzaSyDi29E44ynsa53y81tgwj6MHDvAtBFeHn8',
    authDomain: 'patient-lists.firebaseapp.com',
    databaseURL: 'https://patient-lists.firebaseio.com',
    storageBucket: 'patient-lists.appspot.com',
};

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AppRoutingModule,
        AuthModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        ProfileComponent,
        TeamListComponent,
        TeamApplicationsListComponent,
        CommentListComponent,
        PatientListComponent,
        UserListComponent,
        UserApplicantListComponent,
        PatientComponent,
        ProblemListComponent,
        TaskListComponent,
        NewItemFormComponent,
        TabDashboardComponent,
        TabTeamComponent,
        TabPatientComponent,
        LoadingComponent,
        EditableComponent,
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'en-NZ' }
    ],
})
export class AppModule { }
