import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '@/lib/db';
import { ROUTES } from '@/constants/routes';
import type { User } from '@/interfaces/db';
import { fetchRedis } from './redis';

const getGoogleCredentials = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientId.length) {
    throw new Error('Missing GOOGLE_CLIENT_ID');
  }

  if (!clientSecret || !clientSecret.length) {
    throw new Error('Missing GOOGLE_CLIENT_SECRET');
  }

  return { clientId, clientSecret };
};

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: ROUTES.login,
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUserRes = await fetchRedis<string>('get', `user:${token.id}`);

      try {
        const dbUserParsed = JSON.parse(dbUserRes);
        // console.log(dbUserParsed, 'dbUser auth lib');
        // console.log(user, 'user auth lib');
        // console.log(token, 'token auth lib');

        if (!dbUserParsed) {
          token.id = user.id;
          return token;
        }

        return {
          id: dbUserParsed.id,
          name: dbUserParsed.name,
          email: dbUserParsed.email,
          picture: dbUserParsed.image,
        };
      } catch (error) {
        console.log(error, 'dbUserParsed error');
        return token;
      }
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },
    redirect() {
      return ROUTES.dashboard.base;
    },
  },
};
