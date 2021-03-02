import React, {useContext, useEffect, useState} from "react";
import {auth, storage, database} from "./firebase";
import {showToast} from "../../../../UI_Main_pages_wrapper";


const AuthContext = React.createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);


    /////////////Auth | sign up | login | forgot /////////////////////
    const signup = (email, password) => {
        return auth.createUserWithEmailAndPassword(email, password);
    };

    const getFbStorage = () => {
        return storage;
    };
    // firebase.database().ref("users/" + currentAuth.user.uid).push(userInfo).then(err =>
    const addUserDataToList = (usersName, auth) => {
        const rtDBref = database.ref("users_data/");
        rtDBref.child(auth.user.uid).set({
            name: usersName
        }).then(r => {
            // console.log("////: user data set!", r);
        }).catch(err => {
            // console.log("////: update user data fail!", err);
        });
    };

    const login = (email, password) => {
        return auth.signInWithEmailAndPassword(email, password);
    };

    const loginWithGoogle = (provider) => {
        auth.signInWithRedirect(provider).then(r => {
            //login ok.
            // console.log("////: sign in with google");
        });

    };

    const loginWithFacebook = (provider) => {
        auth.signInWithRedirect(provider).then(r => {
            //login ok.
            // console.log("////: sign in with facebook");
        });
    };
    const resetPassword = (email) => {
        return auth.sendPasswordResetEmail(email);
    };

    const logout = () => {
        setCurrentUser(null);
        return auth.signOut();
    };

    ////////////////////////jobs list/////////////////////////////////
    const create_job = (jobAndContractTypeAndTxt) => {
        return database.ref("/jobs").push(jobAndContractTypeAndTxt);
    };
    const read_job = () => {
        return database.ref("/jobs").once("value");
    };

    const read_job_single = (jobKey) => {
        return database.ref("jobs/" + jobKey).once("value");
    };

    const update_job = () => {
        //fi
    };
    const delete_job = (jobAdKey) => {
        return database.ref("jobs/" + jobAdKey).remove();
    };
    //////////////////////////blog list///////////////////////////////
    //type: social | motivasjon/inspirasjon | artikkel | event
    const create_blog = () => {

    };
    const read_blog = () => {

    };
    const update_blog = () => {

    };
    const delete_blog = () => {

    };
    /////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////


    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        });
    }, []);

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
        loginWithFacebook,
        //job
        create_job,
        read_job,
        read_job_single,
        update_job,
        delete_job,
        //blog
        create_blog,
        read_blog,
        update_blog,
        delete_blog

    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} {/*not rendering anything until currentUser is set!*/}
        </AuthContext.Provider>
    );
}
