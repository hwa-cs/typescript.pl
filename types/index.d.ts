import IUser from '../models/user';

declare global {
  interface Error {
    status?: number;
  }

  namespace Express {
    interface User extends IUser{}
  }
  
  namespace Express {
    interface User {
      id: number;
      email: string;
      nick: string;
    }

    interface Request {
      login(user: Express.User, done: (err: any) => void): void;
      logout(done: (err: any) => void): void;
      user?: Express.User;
    }
  }
}