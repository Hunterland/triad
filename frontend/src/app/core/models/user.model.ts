export type UserRole = 'ADMIN' | 'ORGANIZER' | 'JUDGE' | 'STAFF' | 'ATHLETE';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
  roles: UserRole[];
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}
