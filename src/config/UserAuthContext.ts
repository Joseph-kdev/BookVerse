import { createContext, useContext } from "react";
import { User } from "../types";

interface userAuthContextType {
    user: User | null;
}
export const userAuthContext = createContext<userAuthContextType>({user: null,});

export function useUserAuthContext() {
    return useContext(userAuthContext);
}