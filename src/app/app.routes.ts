import { Routes } from '@angular/router';

import { AuthenticatedGuard } from './shared/guards/authenticated.guard';
import { UnauthenticatedGuard } from './shared/guards/unauthenticated.guard';
import { MeetMemberResolver } from './shared/resolvers/meet-member.resolver';
import { StreamTypeResolver } from './shared/resolvers/stream-type.resolver';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(c => c.HomeComponent),
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./authentication/sign-in/sign-in.component').then(c => c.SignInComponent),
    canActivate: [UnauthenticatedGuard]
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./authentication/sign-up/sign-up.component').then(c => c.SignUpComponent),
    canActivate: [UnauthenticatedGuard]
  },
  {
    path: 'new-meeting',
    loadComponent: () => import('./new-meet/new-meet.component').then(c => c.NewMeetComponent),
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'stream/:streamId',
    loadComponent: () => import('./stream/stream.component').then(c => c.StreamComponent),
    resolve: { streamType: StreamTypeResolver, meetMember: MeetMemberResolver },
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'stream/join/:streamId',
    loadComponent: () => import('./stream-join/stream-join.component').then(c => c.StreamJoinComponent),
    resolve: { streamType: StreamTypeResolver },
    canActivate: [AuthenticatedGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];
