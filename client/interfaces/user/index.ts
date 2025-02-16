export interface IUser {
  _id: string;
  name: string;
  email: string;
  online?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export type GetUsersResponse = IUser[];
