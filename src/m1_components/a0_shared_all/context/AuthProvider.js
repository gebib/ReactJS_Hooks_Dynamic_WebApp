import React, {useContext, useEffect, useState} from "react";
import {auth} from "./firebase";

const AuthContext = React.createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = (children) => {
    const [currentUser, setCurrentUser] = useState();

    const signup = (email, password) => {

        return auth.createUserWithEmailAndPassword(email, password);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            //will be set by the signup on callback.
            //and should be set only once.
            setCurrentUser(user);
        });
        //unsubscribe from listener: is cleanup
        return unsubscribe();
    }, []);

    const value = {
        currentUser,
        signup
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}