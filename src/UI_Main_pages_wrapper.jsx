import React, {Suspense, useEffect, useState} from "react";
import './ST_Main_pages_wrapper.scss';

import {Row, Col} from "react-bootstrap";
import {UI_login} from "./m1_components/c1_auth/login/UI_login";
import {FullPageLoader} from "./resources/miscellaneous/FullPageLoader";
import {UI_register} from "./m1_components/c1_auth/register/UI_register";
import {UI_forgot_password} from "./m1_components/c1_auth/a0_auth_common/forgot_password/UI_forgot_password";
import {UI_nav_bar} from "./m1_components/a0_shared_all/a1_navbar/UI_nav_bar";
import {UI_logo_with_image} from "./m1_components/a0_shared_all/a2_logo_with_image/UI_logo_with_image";
import {UI_body_wrapper} from "./m1_components/a0_shared_all/a4_body_wrapper/UI_body_wrapper";
import {UI_footer} from "./m1_components/a0_shared_all/a5_footer/UI_footer";
import {UI_divider} from "./m1_components/a0_shared_all/a3_animated_divider/UI_divider";


// custom hook: to add event window event listener once.
const useWindowSize = () => {
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


export default function UI_Main_pages_wrapper() {
    const [height, width] = useWindowSize();

    return (
        // main container width = 1440 for all res >= that.
        // else container width === body width.
        <div className={"main_wrapper"}>
            <UI_nav_bar/>
            <UI_logo_with_image/>
            <div className={"page_content_wrapper"}>
                {/*<UI_divider/>*/}
                <UI_body_wrapper/>
                <Suspense fallback={FullPageLoader}>
                    {/*<UI_login/>*/}
                    {/*<UI_register/>*/}
                    {/*<UI_forgot_password/>*/}
                </Suspense>
            </div>
            <UI_footer/>
        </div>
    );
}