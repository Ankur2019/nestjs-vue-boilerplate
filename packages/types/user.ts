import { TimeStamp } from './util';

export type Role = 'student' | 'admin';
export type MutateUserItemsType = 'add' | 'remove';

export interface SocialLogin {
  name: 'Google' | 'Facebook';
  token: string;
  meta: Record<string, unknown>;
}

interface BaseUser extends TimeStamp {
  _id?: string;
  uid: number;
  firstName: string;
  lastName: string;
  username: string;
  role: Role;
  referralCode: string;
  referredCode?: string;
  isFirstLogin?: boolean;
  userLevel: string;
  preferredStyles: string[];
  experienceLevels: string[];
  profileImage?: string;
  socialLogins?: SocialLogin[];
}

export interface User extends BaseUser {
  _id: string;
  password: boolean;
}

export interface ServerUser extends BaseUser {
  password: string;
  resetPasswordToken?: string;
  verificationToken?: string;
  isVerified?: boolean;
}
