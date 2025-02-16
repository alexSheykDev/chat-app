import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import loginAction from "@/actions/auth/loginAction";
import { CustomUser } from "@/interfaces/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          const loginResponse = await loginAction({
            email: credentials.email,
            password: credentials.password,
          });

          if (!loginResponse || !loginResponse._id) {
            throw new Error("Invalid email or password");
          }

          return {
            id: loginResponse._id,
            name: loginResponse.name,
            email: loginResponse.email,
            accessToken: loginResponse.token,
          } as CustomUser;
        } catch (error) {
          console.error("Authorize Error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = (user as CustomUser).accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
