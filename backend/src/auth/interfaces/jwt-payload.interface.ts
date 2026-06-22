// src/auth/interfaces/jwt-payload.interface.ts
import { RoleName } from '@prisma/client';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  roles: RoleName[];
}
