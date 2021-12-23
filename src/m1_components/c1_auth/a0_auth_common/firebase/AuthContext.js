import React, {useContext, useEffect, useState} from "react";
import {auth, storage, database} from "./firebase";
import {showToast} from "../../../../UI_Main_pages_wrapper";
import {v4 as uuid} from "uuid";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";


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
    const [isPageUpdateLoading, setIsPageUpdateLoading] = useState(false);

    const history = useHistory();

    /////////////Auth | sign up | login | forgot /////////////////////
    const signup = (email, password) => {
        return auth.createUserWithEmailAndPassword(email, password);
    };

    const getFbStorage = () => {
        return storage;
    };

    const getFbDb = () => {
        return database;
    };
    // firebase.database().ref("users/" + currentAuth.user.uid).push(userInfo).then(err =>
    const addUserDataToList = (usersName, auth, hasProfileImage) => {
        const rtDBref = database.ref("users_data/");
        rtDBref.child(auth.user.uid).set({
            name: usersName,
            isAdmin: false, //for all users except administrators.
            hasPimage: hasProfileImage
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
            history.goBack();
        });

    };

    const loginWithFacebook = (provider) => {
        auth.signInWithRedirect(provider).then(r => {
            //login ok.
            // console.log("////: sign in with facebook");
            history.goBack();
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

    //////////aPartner logo/////////////////
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

    /////////common aPAGE_Edit handler///////////////
    const updateApageEditInDB = async (pageName, aPageContent) => {// aPageContent contains list of aBox
        setIsPageUpdateLoading(true);
        let uploadedImagesUrlList = []; //
        let nrOfImagesUploaded = 0;
        let nrOfImages = countNrOfImages(aPageContent);
        console.log("////:nr of pics: ", nrOfImages);

        for (const aBox of aPageContent) {
            if ((aBox.boxType === "singleDiv") && (aBox.contentType === "image")) {

                if (aBox.imageDbUrl === "") { //upload only if image does not have been uploaded before!.
                    await storage.ref("pages_images").child("s_" + aBox.divId).put(aBox.imgFile).then(() => {
                        storage.ref("pages_images").child("s_" + aBox.divId).getDownloadURL().then((url) => {
                            aBox.imageDbUrl = url;
                            nrOfImagesUploaded++;
                            if (nrOfImagesUploaded === nrOfImages) {
                                uplloadReadyDataToRtDb(pageName, aPageContent);
                            }
                            // console.log("////:DONE sImageupload");
                        }).catch((e) => {
                            console.log("////:upload singleDiv img: e: ", e);
                        });
                    }).catch((e) => {
                        console.log("////:storage singleDiv: e: ", e);
                    });
                } else {
                    nrOfImagesUploaded++;
                    if (nrOfImagesUploaded === nrOfImages) {
                        uplloadReadyDataToRtDb(pageName, aPageContent);
                    }
                }

            } else if ((aBox.boxType === "dualDiv") && ((aBox.rContentType === "image") || (aBox.lContentType === "image"))) {
                if (aBox.rContentType === "image") {

                    if (aBox.rImageDbUrl === "") {
                        await storage.ref("pages_images").child("r_" + aBox.divId).put(aBox.rImageFile).then(() => {
                            storage.ref("pages_images").child("r_" + aBox.divId).getDownloadURL().then((url) => {
                                aBox.rImageDbUrl = url;
                                nrOfImagesUploaded++;
                                if (nrOfImagesUploaded === nrOfImages) {
                                    uplloadReadyDataToRtDb(pageName, aPageContent);
                                }
                                // console.log("////:DONE rImageupload");
                            }).catch((e) => {
                                console.log("////:upload dualDiv r B: e: ", e);
                            });
                        }).catch((e) => {
                            console.log("////:storage dualDiv r A: e: ", e);
                        });
                    } else {
                        nrOfImagesUploaded++;
                        if (nrOfImagesUploaded === nrOfImages) {
                            uplloadReadyDataToRtDb(pageName, aPageContent);
                        }
                    }
                }

                if (aBox.lContentType === "image") {

                    if (aBox.lImageDbUrl === "") {
                        await storage.ref("pages_images").child("l_" + aBox.divId).put(aBox.lImageFile).then(() => {
                            storage.ref("pages_images").child("l_" + aBox.divId).getDownloadURL().then((url) => {
                                aBox.lImageDbUrl = url;
                                nrOfImagesUploaded++;
                                if (nrOfImagesUploaded === nrOfImages) {
                                    uplloadReadyDataToRtDb(pageName, aPageContent);
                                }
                                // console.log("////:DONE lImageupload");
                            }).catch((e) => {
                                console.log("////:upload dualDiv l B: e: ", e);
                            });
                        }).catch((e) => {
                            console.log("////:storage dualDiv l A: e: ", e);
                        });
                    } else {
                        nrOfImagesUploaded++;
                        if (nrOfImagesUploaded === nrOfImages) {
                            uplloadReadyDataToRtDb(pageName, aPageContent);
                        }
                    }
                }
            }
        }//end for
        if (nrOfImages === 0) {
            uplloadReadyDataToRtDb(pageName, aPageContent);
        }
    };

    //ready page data uploader to rtDb.
    const uplloadReadyDataToRtDb = (pageName, aPageContent) => {
        //clean out local File ref and prev
        aPageContent.forEach((aBox) => {
            if (aBox.boxType === "singleDiv") {
                aBox.imgFile = "";
                aBox.imgFilePrev = "";
                aBox.inputRef = "";
            } else if (aBox.boxType === "dualDiv") {
                aBox.lImageFile = "";
                aBox.lImageFilePrev = "";
                aBox.lInputRef = "";

                aBox.rImageFile = "";
                aBox.rImageFilePrev = "";
                aBox.rInputRef = "";
            }
        });
        database.ref("/pages_data/" + pageName).set(aPageContent).then(() => {
            setIsPageUpdateLoading(false);
            window.location.reload();
            // showToast(t("msl.homePageUpdated"));
        }).catch((e) => {
            console.log("////:e ", e);
        });
    };

    // //helper function:
    const countNrOfImages = (aPageContent) => {
        let result = 0;
        for (const aBox of aPageContent) {
            if ((aBox.boxType === "singleDiv") && (aBox.contentType === "image")) {
                result++;
            } else if (aBox.boxType === "dualDiv") {
                if ((aBox.rContentType === "image") && aBox.lContentType === "image") {
                    result += 2;
                } else if (aBox.rContentType === "image") {
                    result++;
                } else if (aBox.lContentType === "image") {
                    result++;
                }
            }
        }
        return result;
    };

    //get aPageData from rtDb
    const getApageData = async (pageName) => {
        return await database.ref("/pages_data/" + pageName).once("value");
    };
    /////////aPAGE_Edit end///////////////

    //read single blog
    const read_blog = () => {
        setBlogPostLoading(true);
        return database.ref("/blogs").once("value");
    };

    const read_blog_single = (blogKey) => {
        return database.ref("blogs/" + blogKey).once("value");
    };

    //used to delete blog X or/if over limit.
    const delete_blog = (aBlogData, isAuto) => {
        setIsLogDbActivity(true);
        database.ref("blogs/" + aBlogData.blogKey).remove().then((r) => {
            if (aBlogData.storageImgFolderId !== null) {
                storage.ref("blogImages/" + aBlogData.storageImgFolderId).listAll().then((res) => {
                    res.items.forEach(anItem => {
                        storage.ref("blogImages/" + aBlogData.storageImgFolderId + "/").child(anItem.name).delete().then(r => {
                            // console.log("////:DELETEd", anItem.name);
                        }).catch((e) => {
                            console.log("////:e ", e);
                        });

                    });
                    if (!isAuto) {
                        showToast(t("blog.removed"), "info");
                    }
                    setIsLogDbActivity(false);
                }).catch((e) => {
                    console.log("////:e ", e);
                });
            } else {
                setIsLogDbActivity(false);
                if (!isAuto) {
                    showToast(t("blog.removed"), "info");
                }
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


//fetch user information to local on user sign in or register.
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            // console.log("////:CU______:info: ", user);
            if (user !== null) {
                let userId = user.uid;
                let userName = user.displayName;
                let isAdmin = false;
                let profileImagePhoto = null;
                let slAvatar = "https://firebasestorage.googleapis.com/v0/b/silverlining-it-prod.appspot.com/o/avatar.svg?alt=media&token=b7b2c4a5-de05-4ca5-a393-e1983975bfa9";

                //all sl registered users are not necessarily verified their email, and have display name === null/undefined!.
                let isSMuser = ((user.displayName !== null) || (user.emailVerified === true));

                if (!isSMuser) {
                    database.ref("users_data/" + userId).once("value").then((sn) => {
                        isAdmin = sn.val().isAdmin;
                        userName = sn.val().name;
                        if (sn.val().hasPimage) {
                            storage.ref("profile_imgs/").child(user.uid + "/profile.png").getDownloadURL().then((url) => {
                                profileImagePhoto = url;
                                setCurrentUserInfo([userId, userName, isAdmin, profileImagePhoto]);
                                setLoading(false);
                            }).catch((e) => {//user has no profile image
                                setCurrentUserInfo([userId, userName, isAdmin, slAvatar]);
                                setLoading(false);
                            });
                        } else { // user has no profileImg
                            setCurrentUserInfo([userId, userName, isAdmin, slAvatar]);
                            setLoading(false);
                        }

                    }).catch((e) => {
                        // console.log("////:e ", e);
                    });
                } else if (isSMuser) {
                    profileImagePhoto = (user.photoURL !== null) ? user.photoURL : slAvatar;
                    setCurrentUserInfo([userId, userName, isAdmin, profileImagePhoto]);
                    setLoading(false);
                }
            } else {
                setCurrentUserInfo(null);
                setLoading(false);
            }
        });
    }, []);

    // useEffect(() => {
    //     console.log("////:Current user info in AUTH: ", currentUserInfo);
    // }, [currentUserInfo]);


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
        getFbDb,
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
        isLogDbActivity,
        //aPageData posting
        isPageUpdateLoading,
        updateApageEditInDB,
        getApageData
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} {/*not rendering anything until currentUser is set!*/}
        </AuthContext.Provider>
    );
}
