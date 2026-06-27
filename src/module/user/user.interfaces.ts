import { Role } from "../../../generated/prisma/enums";

export interface IRegistration {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
}

// export interfaces  profile data
export interface IProfileGet {
  id: string;
  email: string;
  name: string;
  role: Role;
}

type TMeta = {
  page: number;
  limit: number;
  total: number;
};
export type TResponseData<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: TMeta;
};
