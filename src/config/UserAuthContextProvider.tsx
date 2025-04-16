import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
import { useEffect, useState } from "react";
import { userAuthContext } from "./UserAuthContext";
import { User } from "../types";


export function UserAuthContextProvider({ children } : {children: React.ReactNode}){
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if(currentUser) {
                const mappedUser: User = {
                    uid: currentUser.uid,
                    email: currentUser.email || "",
                    displayName: currentUser.displayName || "",
                    password: "",
                    hasAccount: true,
                }
                setUser(mappedUser);
            } else {
                setUser(null);
            }
        })
        return unsubscribe;
    }, [])

    return (
        <userAuthContext.Provider value={{user}}>
            {children}
        </userAuthContext.Provider>
    )
}
