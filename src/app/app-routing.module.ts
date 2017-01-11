import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthModule } from './auth.module';
import { AuthGuardService } from './auth-guard.service';

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

const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: '',
        component: TabDashboardComponent,
        canActivateChild: [AuthGuardService],
        children: [
            { path: '', component: ProfileComponent },
            { path: 'applications', component: TeamApplicationsListComponent },
            {
                path: 'teams', children: [
                    { path: '', component: TeamListComponent },
                    {
                        path: ':team',
                        component: TabTeamComponent,
                        children: [
                            { path: '', component: UserListComponent },
                            { path: 'applicants', component: UserApplicantListComponent },
                            { path: 'discussion', component: CommentListComponent },
                            {
                                path: 'patients',
                                children: [
                                    { path: '', component: PatientListComponent },
                                    {
                                        path: ':nhi',
                                        component: TabPatientComponent,
                                        children: [
                                            { path: '', component: PatientComponent },
                                            { path: 'problems', component: ProblemListComponent },
                                            { path: 'tasks', component: TaskListComponent },
                                            { path: 'comments', component: CommentListComponent },
                                        ]
                                    },
                                ]
                            },
                        ],
                    }
                ],
            },
        ],
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes),
        AuthModule
    ],
    exports: [
        RouterModule
    ],
    providers: [
    ],
})
export class AppRoutingModule { }
