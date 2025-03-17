import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase-config";

const userAuthContext = createContext(null);

export function useUserAuthContext() {
    return useContext(userAuthContext);
}

export function UserAuthContextProvider({ children } : {children: React.ReactNode}){
    const [user, setUser] = useState(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user) {
                setUser(user);
            } else {
                setUser(null);
            }
        })
        return unsubscribe;
    }, [])

    return (
        <userAuthContext.Provider value={{ user }}>
            {children}
        </userAuthContext.Provider>
    )
}
