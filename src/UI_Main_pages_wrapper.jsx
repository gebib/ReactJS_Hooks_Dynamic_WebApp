import React, {useEffect, useState} from "react";
import './ST_Main_pages_wrapper.scss';
import {UI_nav_bar} from "./m1_components/a1_navbar/UI_nav_bar";
import {UI_logo_with_image} from "./m1_components/a2_logo_with_image/UI_logo_with_image";
import {UI_body_wrapper} from "./m1_components/a4_body_wrapper_router/UI_body_wrapper";
import {UI_footer} from "./m1_components/zz_footer/UI_footer";
import {useLocation} from 'react-router-dom';

// toast.error("toast test: ERROR");
// toast.success("toast test: SUCCEEDED");
// toast.info("toast test: INFO");
// toast.warn("toast test: WARNING");
import {ToastContainer, toast,} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useAuth} from "./m1_components/c1_auth/a0_auth_common/firebase/AuthContext";
import {UI_PrivacyPolicy} from "./m1_components/z_privacy_policy/UI_PrivacyPolicy";
import {UI_divider} from "./m1_components/a3_animated_divider/UI_divider";


// custom hook: to add event window event listener once/render and remove on exit.
export const useWindowSize = () => {
    const [size, setSize] = useState([window.innerHeight, window.innerWidth]);
    useEffect(() => {
        const handleWindowResize = () => {
            if (window.innerWidth >= 1440) {
                setSize([window.innerHeight, 1440]);
            } else {
                setSize([window.innerHeight, window.innerWidth]);
            }
        };
        window.addEventListener("resize", handleWindowResize);
        //clean up
        return () => {
            window.removeEventListener("resize", handleWindowResize);
        }
    }, []);
    return size;
}

//global show toast
export const showToast = (message, type) => {
    let errorColor;
    switch (type) {
        case "error":
            errorColor = "#ff6767";
            break;
        case "success":
            errorColor = "#1b6a34";
            break;
        case "info":
            errorColor = "#248C9D";
            break;
        default:
            errorColor = "#248C9D";
    }
    toast(message, {
        className: "good_toast",
        draggable: true,
        position: toast.POSITION.TOP_CENTER,
        style: {
            backgroundColor: errorColor
        },
        // progressClassName: 'progress_st',
        closeButton: false,
        type: "SUCCESS",
    });
}

export default function UI_Main_pages_wrapper() {
    const [shouldHideNavEtc, setShouldHideNavEtc] = useState(false);
    const location = useLocation();

    const [hideHomeBgi, setHideHomeBgi] = useState(false);
    const sizeHW = useWindowSize();

    //should fire only when routing path changes:
    useEffect(() => {
        if (location.pathname === "/login" ||
            location.pathname === "/register" ||
            location.pathname === "/privacypolicy" ||
            location.pathname === "/forgot_password") {
            setShouldHideNavEtc(true);
        } else {
            setShouldHideNavEtc(false);
        }
        if (location.pathname === "/" ||
            location.pathname === "/about") {
            setHideHomeBgi(false);
        } else {
            setHideHomeBgi(true);
        }
    }, [location.pathname]);

    const {addUserDataToList} = useAuth(); ////////////////////temp
    const {currentUser} = useAuth();

    // const setWrapper = (bodyWrapperHeight) => {
    //     setBodyWrapperPageHeight(bodyWrapperHeight);
    //     console.log("////:from bwr height: ", bodyWrapperHeight);
    // }

    return (
        <div className={"main_wrapper"}
             style={shouldHideNavEtc ? {backgroundColor: "#24818d", transition: "2s"} : null}>
            <div style={(shouldHideNavEtc || hideHomeBgi) ? {opacity: "0"} : {opacity: "1", transition: "10s"}}
                 className="custom-shape-divider-top-1612728068">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"
                     preserveAspectRatio="none">
                    <path
                        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                        opacity=".25" className="shape-fill"/>
                    <path
                        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                        opacity=".5" className="shape-fill"/>
                    <path
                        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                        className="shape-fill"/>
                </svg>
            </div>
            {/*<button onClick={() => {*/}
            {/*    let userInfo = {*/}
            {/*        userName: currentUser.displayName,*/}
            {/*        userPhotoUrl: currentUser.photoURL,*/}
            {/*        userUid: currentUser.uid,*/}
            {/*        verified: currentUser.emailVerified*/}
            {/*    }*/}
            {/*    console.log("////:userInfo ", userInfo, "\n\n");*/}
            {/*    console.log("////:currentUser ", currentUser);*/}
            {/*}}>TEST*/}
            {/*</button>*/}
            <ToastContainer className={"pop"}/>
            {shouldHideNavEtc ? null : <UI_nav_bar/>}
            {(shouldHideNavEtc || hideHomeBgi) ? null : <UI_logo_with_image/>}
            {/*<UI_divider/>*/}
            <div className={"page_content_wrapper"}>
                <UI_body_wrapper wrapperHeight={"auto"}/>
            </div>
            {shouldHideNavEtc ? null : <UI_footer/>}
        </div>
    );
}
