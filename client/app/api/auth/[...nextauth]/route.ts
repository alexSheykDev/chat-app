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
          throw new Error("Email and password are required.");
        }

        try {
          const user = await loginAction({
            email: credentials.email,
            password: credentials.password,
          });

          if (!user || !user._id) {
            throw new Error("❌ Invalid email or password.");
          }

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            accessToken: user.token,
          } as CustomUser;
        } catch (error) {
          console.error("🛑 Authorization Error:", error);
          throw new Error("🚨 Authentication failed.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // If user logs in, store their data in the token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = (user as CustomUser).accessToken;
      }

      // When session update is triggered, re-fetch token if needed
      if (trigger === "update" && token.accessToken) {
        console.info("🔄 JWT Update Triggered");
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        accessToken: token.accessToken,
      };

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
