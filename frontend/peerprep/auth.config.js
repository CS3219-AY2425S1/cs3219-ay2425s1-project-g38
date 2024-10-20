export const authConfig = {
    pages: {
        signIn: "/sign-in",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl} }) {
            const isLoggedIn = !!auth?.user;
            const inRoute = nextUrl.pathname;
            if (isLoggedIn) {
                if (inRoute === "/sign-up" || inRoute === "sign-in")
                    return Response.redirect (new URL("/", nextUrl));
                return true;
            } else {
                if (inRoute === "/sign-up" || inRoute === "/sign-in") return true;
                return false;
            }
        },
        jwt({ token, user }) {
            if (user) {
              token.id = user.id
            }
            return token
          },
        session({ session, token }) {
            session.user.id = token.id
            return session
        },
    },
    providers: [],
};