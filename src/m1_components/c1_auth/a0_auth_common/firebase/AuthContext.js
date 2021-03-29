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
    const [isLogDbActivity, setIsLogDbActivity] = useState(false);


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
        let listOfThisBlogImagesURL = [];
        setBlogPostLoading(true);
        let storageImgFolderId = (stagedFilesAr.length > 0) ? uuid() : null;

        // console.log("////:CU ", currentUserInfo);

        let dataToStore = {
            stringifiedRaw: stringifiedRaw,
            htmlTxt: htmlTxt,
            blogType: blogType,
            listOfBlogImgUrls: listOfThisBlogImagesURL,
            postDate: postDate,
            authorNameAndId: [currentUserInfo[1], currentUserInfo[0]],
            authorProfileImgUrl: currentUserInfo[3],
            ratingStars: rating,
            isBlogApproved: isBlogApproved,
            storageImgFolderId: storageImgFolderId
        };

        //if there are also images to be uploaded
        if (stagedFilesAr.length > 0) {
            for (let i = 0; i < stagedFilesAr.length; i++) {
                const imagesRef = storage.ref("blogImages").child(storageImgFolderId + "/" + storageImgFolderId + stagedFilesAr[i].file.name);
                imagesRef.put(stagedFilesAr[i].file).then(() => {
                    imagesRef.getDownloadURL().then((url) => {
                        listOfThisBlogImagesURL.push(url);
                        if (listOfThisBlogImagesURL.length === stagedFilesAr.length) {
                            addBlogRTdbPost(dataToStore);
                        }
                    });
                }).catch((e) => {
                    setBlogPostLoading(false);
                    console.log("////:e ", e);
                });
            }
        } else {
            addBlogRTdbPost(dataToStore);
        }
    };
    ////////post realTimeDb data.
    const addBlogRTdbPost = (dataToStore) => {
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

    //////////partners logo/////////////////
    const addNewPartnerLogo = async (aFile) => {
        setIsLogDbActivity(true);
        let logoId = uuid();
        await storage.ref("partnerLogos").child(logoId).put(aFile).then(() => {
            storage.ref("partnerLogos").child(logoId).getDownloadURL().then((url) => {
                database.ref("/partners/" + logoId).set({imgNameId: logoId, dUrl: url}).then(() => {
                    showToast(t("about.logoOk"));
                    setIsLogDbActivity(false);
                }).catch((e) => {
                    console.log("////:e ", e);
                });
            }).catch((e) => {
                console.log("////:e ", e);
            });
        }).catch((e) => {
            setBlogPostLoading(false);
            console.log("////:e ", e);
        });
    };

    const getAllPartnersLogo = () => {
        return database.ref("/partners").once("value");
    };

    const removeApartnersLogo = (logoId) => {
        setIsLogDbActivity(true);
        storage.ref("partnerLogos/").child(logoId).delete().then((r) => {
            database.ref("partners/" + logoId).remove().then((r) => {
                showToast(t("about.pRemoved"), "info");
                setIsLogDbActivity(false);
            }).catch((e) => {
                console.log("////:e ", e);
            });
        }).catch((e) => {
            console.log("////:e ", e);
        });
    };
    //////////partners logo/////////////////


    const read_blog = () => {
        setBlogPostLoading(true);
        return database.ref("/blogs").once("value");
    };

    //read single blog
    const read_blog_single = (blogKey) => {
        return database.ref("blogs/" + blogKey).once("value");
    };

    //used to delete by adm, or if over limit.
    const delete_blog = (aBlogData) => {
        setIsLogDbActivity(true);
        database.ref("blogs/" + aBlogData.blogKey).remove().then((r) => {
            if (aBlogData.storageImgFolderId !== null) {
                database.ref("blogImages/" + aBlogData.storageImgFolderId).remove().then((r) => { //TODO not working.. maybe loop remove?
                    setIsLogDbActivity(false);
                    showToast(t("blog.removed"), "info");
                }).catch((e) => {
                    console.log("////:e ", e);
                });
            } else {
                setIsLogDbActivity(false);
                showToast(t("blog.removed"), "info");
            }
        }).catch((e) => {
            console.log("////:e ", e);
        });
    };

    const approve_blog = (blogId) => {
        database.ref("blogs/").child(blogId).update({
                isBlogApproved: true
            }
        ).then((r) => {
            showToast(t("blog.blogApproved"), "info");
        }).catch((e) => {
            console.log("////:e ", e);
        });
    };
    //////////////////////////blog list///////////////////////////////

    /////////////////////////////////////////////////////////

//fetch user information to local on user sign in or register.
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user !== null) {
                let userId = user.uid;
                let userName;
                let isAdmin;
                let profileImgUrl = "https://firebasestorage.googleapis.com/v0/b/silverlining-it-prod.appspot.com/o/avatar.svg?alt=media&token=9c383d82-5f34-474c-9575-08afa5a9e5d4";

                database.ref("users_data/" + userId).once("value").then((sn) => {
                    isAdmin = sn.val().isAdmin;
                    userName = sn.val().name;
                    storage.ref("profile_imgs/").child(user.uid + "/profile.png").getDownloadURL().then((url) => {
                        profileImgUrl = (user.photoURL === null) ? url : user.photoURL; //case facebook/google? etc
                        setCurrentUserInfo([userId, userName, isAdmin, profileImgUrl]);
                        setLoading(false);
                    }).catch((e) => {//user has no profile image
                        setCurrentUserInfo([userId, userName, isAdmin, profileImgUrl]);
                        setLoading(false);
                    });
                }).catch((e) => {
                    // console.log("////:e ", e);
                });
                setLoading(false);
            } else {
                setCurrentUserInfo(null);
                setLoading(false);
            }
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
        read_blog_single,
        delete_blog,
        approve_blog,
        //partners logo
        addNewPartnerLogo,
        getAllPartnersLogo,
        removeApartnersLogo,
        isLogDbActivity

    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} {/*not rendering anything until currentUser is set!*/}
        </AuthContext.Provider>
    );
}
