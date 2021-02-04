import React, {useContext, useEffect, useState} from "react";
import {auth, storage} from "./firebase";


const AuthContext = React.createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    /////////////sign up/////////////////////////////////////
    const signup = (email, password) => {
        return auth.createUserWithEmailAndPassword(email, password);
    }

    const addNewUserProfileInfo = () => {
        return storage;
    }
    /////////////////////////////////////////////////////////

    const login = (email, password) => {
        return auth.signInWithEmailAndPassword(email, password);
    }

    const resetPassword = (email) => {
        return auth.sendPasswordResetEmail(email);
    }

    useEffect(() => {
        return auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        })
    }, []);

    const logout = () => {
        setCurrentUser(null);
        return auth.signOut();
    }

    //context values that will be available to all that use the context.
    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        addNewUserProfileInfo
    }


    return (
        <AuthContext.Provider value={value}>
            {!loading && children} {/*not rendering anything until currentUser is set!*/}
        </AuthContext.Provider>
    );
}
