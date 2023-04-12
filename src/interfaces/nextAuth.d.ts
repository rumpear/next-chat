import { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

type UserId = string;

// interface AuthUser extends User {
//   id: UserId;
// }

// export interface AuthSessions extends Session {
//   user: AuthUser;
// }

declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId;
  }
}

declare module 'next-auth' {
  interface Session {
    user: User & { id: UserId };
  }
}
