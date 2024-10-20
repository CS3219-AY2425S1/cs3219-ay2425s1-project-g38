import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { checkUserExists, verifyCredentials } from "./services/userService";

export const {auth, handlers, signIn, signOut} = NextAuth({
    ... authConfig,
  providers: [
        Credentials({
            async authorize(credentials: any) {
                try {
                    const response = await checkUserExists(credentials.id)
                    console.log(response);
                    if (response.exists === "false") {
                        return null;
                    } else {
                        const response = await verifyCredentials(credentials.id, credentials.password)
                        if (response.ok) {
                            return response.json();
                        } else {
                            return null;
                        }
                    }
                } catch (error) {
                    console.log("error: ", error);
                    return null;
                }
            }
        })
  ],
});
