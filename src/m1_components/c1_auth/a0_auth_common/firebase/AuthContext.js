import React, {useContext, useEffect, useState} from "react";
import {auth, storage, database} from "./firebase";


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

    const getFbStorage = () => {
        return storage;
    }
    // firebase.database().ref("users/" + currentAuth.user.uid).push(userInfo).then(err =>
    const addUserDataToList = (usersName, auth) => {
        const rtDBref = database.ref("users_data/");
        rtDBref.child(auth.user.uid).set({
            name: usersName
        }).then(r => {
            console.log("////: user data set!", r);
        }).catch(err => {
            console.log("////: update user data fail!", err);
        });
    }
    /////////////////////////////////////////////////////////

    /////////////////login/////////////////////////////////
    const login = (email, password) => {
        return auth.signInWithEmailAndPassword(email, password);
    }

    const loginWithGoogle = (provider) => {
        auth.signInWithRedirect(provider).then(r => {
            //login ok.
            // console.log("////: sign in with google");
        });

    }

    const loginWithFacebook = (provider) =>{
        auth.signInWithRedirect(provider).then(r => {
            //login ok.
            // console.log("////: sign in with facebook");
        });
    }
    /////////////////////////////////////////////////////////


    const resetPassword = (email) => {
        return auth.sendPasswordResetEmail(email);
    }

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        });
    }, []);

    const logout = () => {
        setCurrentUser(null);
        return auth.signOut();
    }

    //context values that will be available to all that use the context.
    const value = {
        currentUser,
        setCurrentUser,
        login,
        signup,
        logout,
        resetPassword,
        getFbStorage,
        addUserDataToList,
        loginWithGoogle,
        loginWithFacebook
    }


    return (
        <AuthContext.Provider value={value}>
            {!loading && children} {/*not rendering anything until currentUser is set!*/}
        </AuthContext.Provider>
    );
}
