import React, { createContext, useContext, useEffect, useState } from "react";
import {
    UserCredential,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth } from "@/serverless/config";

interface UserType {
    email: string | null;
    uid: string | null;
}

interface ContextType {
    user: UserType | null;
    logIn:
        | ((email: string, password: string) => Promise<UserCredential>)
        | null;
    logOut: (() => Promise<void>) | null;
}

const AuthContext = createContext<ContextType>({
    user: null,
    logIn: null,
    logOut: null,
});

export const useAuth = () => useContext<any>(AuthContext);

export const AuthContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [user, setUser] = useState<UserType>({ email: null, uid: null });
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({
                    email: user.email,
                    uid: user.uid,
                });
            } else {
                setUser({ email: null, uid: null });
            }
        });
        setLoading(false);

        return () => unsubscribe();
    }, []);

    const logIn = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logOut = async () => {
        setUser({ email: null, uid: null });
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, logIn, logOut }}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
