import React, {useContext, useEffect, useState} from "react";
import {auth, storage, database} from "./firebase";
import {showToast} from "../../../../UI_Main_pages_wrapper";
import {v4 as uuid} from "uuid";
import {useTranslation} from "react-i18next";


const AuthContext = React.createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export function AuthProvider({children}) {

    const {t, i18n} = useTranslation("SL_languages");
    const [currentUserInfo, setCurrentUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [blogPostLoading, setBlogPostLoading] = useState(false);
    const [resetFormFromAuth, setResetFormFromAuth] = useState(false);


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
            name: usersName,
            isAdmin: false //for all users except administrators.
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
        setCurrentUserInfo(null);
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

    ////////////////////////////blog list/////////////////////////////
    const create_blog = (stringifiedRaw, htmlTxt, stagedFilesAr, blogType, postDate, rating, isBlogApproved) => {
        let blogId = uuid();
        let listOfThisBlogImagesURL = [];
        setBlogPostLoading(true);

        // console.log("////:CU ", currentUserInfo);

        let dataToStore = {
            stringifiedRaw: stringifiedRaw,
            htmlTxt: htmlTxt,
            blogType: blogType,
            listOfBlogImgUrls: listOfThisBlogImagesURL,
            postDate: postDate,
            authorName: currentUserInfo[1],
            authorProfileImgUrl: currentUserInfo[3],
            ratingStars: rating,
            isBlogApproved: isBlogApproved
        };

        if (stagedFilesAr.length > 0) {
            for (let i = 0; i < stagedFilesAr.length; i++) {
                const imagesRef = storage.ref("blogImages").child(blogId + "/" + blogId + stagedFilesAr[i].file.name);
                imagesRef.put(stagedFilesAr[i].file).then(() => {
                    imagesRef.getDownloadURL().then((url) => {
                        listOfThisBlogImagesURL.push(url);
                        if (listOfThisBlogImagesURL.length === stagedFilesAr.length) {
                            addBlogRTdbPost(blogId, dataToStore);
                        }
                    });
                }).catch((e) => {
                    setBlogPostLoading(false);
                    console.log("////:e ", e);
                });
            }
        } else {
            addBlogRTdbPost(blogId, dataToStore);
        }
    };
    ////////post rtDb data.
    const addBlogRTdbPost = (blogId, dataToStore) => {
        setBlogPostLoading(false);
        database.ref("/blogs").push(dataToStore).then(() => {
            setBlogPostLoading(false);
            showToast(t("blog.posted"), "info");
            localStorage.removeItem("tmpBlogState");
            setResetFormFromAuth(true);
        }).catch((e) => {
            setBlogPostLoading(false);
            console.log("////:e ", e);
        });

    };


    const read_blog = () => {
        setBlogPostLoading(true);
        return database.ref("/blogs").once("value");
    };
    //used to delete by adm, or if over limit.
    const delete_blog = (blogId) => {
        database.ref("blogs/" + blogId).remove().then((r)=>{
            showToast(t("blog.removed"), "info");
        }).catch((e) => {
            console.log("////:e ", e);
        });
    };
    const approve_blog = (blogId) =>{

    };


    //////////////////////////blog list///////////////////////////////

    /////////////////////////////////////////////////////////

//fetch user information to local on user sign in or register.
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user !== null) {
                let userId = user.uid;
                let userName = "";
                let userType = "";
                let profileImgUrl = "";

                database.ref("users_data/" + userId).once("value").then((sn) => {
                    userType = sn.val().isAdmin;
                    userName = sn.val().name;
                    storage.ref("profile_imgs/").child(user.uid + "/profile.png").getDownloadURL().then((url) => {
                        profileImgUrl = url;
                        setCurrentUserInfo([userId, userName, userType, profileImgUrl]);
                    }).catch((e) => {
                        // console.log("////:e ", e);
                    });

                }).catch((e) => {
                    // console.log("////:e ", e);
                });
            } else {
                setCurrentUserInfo(null);
            }
            setLoading(false);
        });
    }, []);

    //context values that will be available to all that use the context.
    const value = {
        currentUserInfo,
        // setCurrentUserInfo,

        resetFormFromAuth,
        setResetFormFromAuth,
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
        blogPostLoading,
        setBlogPostLoading,
        read_blog,
        delete_blog,
        approve_blog

    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} {/*not rendering anything until currentUser is set!*/}
        </AuthContext.Provider>
    );
}
