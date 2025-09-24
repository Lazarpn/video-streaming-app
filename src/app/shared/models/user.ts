import { StreamModel } from './stream';

export interface AuthResponseModel {
  token: string;
}

export interface UserMeModel extends UserInitialsModel {
  id: string;
  email: string;
  emailConfirmed: boolean;
  createdAt: string;
  streams: StreamModel[];
}

export interface UserInitialsModel {
  thumbUrl: string;
  firstName: string;
  lastName: string;
  initials: string;
}

export interface UserConfirmEmailModel {
  emailVerificationCode: string;
}

export interface SignInModel {
  email: string;
  password: string;
}

export interface SignUpModel {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ChangeEmailModel {
  newEmail: string;
}

export interface ForgotPasswordModel {
  email: string;
}

export interface ResentEmailResponseModel {
  newCodeExpiryDate: Date;
}

export interface ResetPasswordModel {
  token: string;
  userId: string;
  password: string;
}

export enum SocialAccountType {
  Google = 'Google',
}
