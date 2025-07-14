import User from "./userModel.ts";

export interface UserRepositoryInterface {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  insert(user: User, hashedPassword: string, salt: string): Promise<User>;
}