import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { FirebaseAdapter } from "@next-auth/firebase-adapter";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/serverless/config";

export default NextAuth({
    pages: {
        signIn: "/login",
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {},
            async authorize(credentials): Promise<any> {
                return await signInWithEmailAndPassword(
                    auth,
                    (credentials as any).email || "",
                    (credentials as any).password || ""
                )
                    .then((userCredential) => {
                        if (userCredential.user) {
                            return userCredential.user;
                        }
                        return null;
                    })
                    .catch((error) => {
                        console.log(error);
                        return null;
                    });
            },
        }),
    ],
});
