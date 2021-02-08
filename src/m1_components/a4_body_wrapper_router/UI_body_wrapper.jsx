import React, {Suspense, useEffect, useRef, useState} from 'react';
import "./ST_body_wrapper.scss";
import {Route, Switch} from "react-router-dom";
import {HomeContent} from "./p1_home/HomeContent";
import {ErrorPage} from "../../m0_pages_routes/ErrorPage";
import {JobsContent} from "./p2_jobs/Jobs";
import {ServiceContent} from "./p3_services/ServiceContent";
import {BlogContent} from "./p4_blog/BlogContent";
import {AboutContent} from "./p5_about/AboutContent";
import {UI_login} from "../c1_auth/login/UI_login";
import {UI_register} from "../c1_auth/register/UI_register";
import {FullPageLoader} from "../../resources/miscellaneous/FullPageLoader";
import {UI_forgot_password} from "../c1_auth/forgot_password/UI_forgot_password";
import {UI_PrivacyPolicy} from "../z_privacy_policy/UI_PrivacyPolicy";

export const UI_body_wrapper = (props) => {

    return (
        <div className={"body_outer"}>
            <div  className={"body_wrapper"} style={{height: props.wrapperHeight}}>
                <Switch>
                    {/*navigation links*/}
                    <Route exact path={"/"}><HomeContent/></Route>
                    <Route path={"/jobs"}><JobsContent/></Route>
                    <Route path={"/services"}><ServiceContent/></Route>
                    <Route path={"/blog"}><BlogContent/></Route>
                    <Route path={"/about"}><AboutContent/></Route>

                    {/*normail pages*/}
                    <Route path={"/privacypolicy"}><UI_PrivacyPolicy/></Route>
                    {/*<Route path={""}>< /></Route>*/}
                    {/*<Route path={""}>< /></Route>*/}
                    {/*<Route path={""}>< /></Route>*/}
                    {/*<Route path={""}>< /></Route>*/}
                    {/*<Route path={""}>< /></Route>*/}
                    {/*<Route path={""}>< /></Route>*/}
                    {/*<Route path={""}>< /></Route>*/}
                    {/*<Route path={""}>< /></Route>*/}
                    {/*<Route path={""}>< /></Route>*/}
                    {/*<Route path={""}>< /></Route>*/}
                    {/*<Route path={""}>< /></Route>*/}
                    {/*<Route path={""}>< /></Route>*/}
                    {/*<Route path={""}>< /></Route>*/}
                    {/*<Route path={""}>< /></Route>*/}
                    {/*<Route path={""}>< /></Route>*/}
                    {/*<Route path={""}>< /></Route>*/}
                    {/*<Route path={""}>< /></Route>*/}
                    {/*<Route path={""}>< /></Route>*/}
                    {/*<Route path={""}>< /></Route>*/}
                    {/*<Route path={""}>< /></Route>*/}

                    {/*other pages links*/}
                    <Suspense fallback={FullPageLoader}>
                        <Route path={"/login"}><UI_login/></Route>
                        <Route path={"/register"}><UI_register/></Route>
                        <Route path={"/forgot_password"}><UI_forgot_password/></Route>
                    </Suspense>
                    <Route path={"*"}><ErrorPage/></Route>
                </Switch>
            </div>
        </div>
    );
}
