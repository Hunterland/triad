// src/users/dto/user-response.dto.ts
import { RoleName } from '@prisma/client';

export interface UserResponseDto {
  id: string;
  email: string;
  displayName?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  roles: {
    userId: string;
    roleId: string;
    createdAt: Date;
    role: {
      id: string;
      name: RoleName;
      createdAt: Date;
      updatedAt: Date;
    };
  }[];
}
