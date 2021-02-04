import React, {Suspense } from "react";
import "./ST_body_wrapper.scss";
import {Route, Switch} from "react-router-dom";
import {HomeContent} from "../../../m0_pages_routes/HomeContent";
import {ErrorPage} from "../../../m0_pages_routes/ErrorPage";
import {JobsContent} from "../../../m0_pages_routes/Jobs";
import {ServiceContent} from "../../../m0_pages_routes/ServiceContent";
import {BlogContent} from "../../../m0_pages_routes/BlogContent";
import {AboutContent} from "../../../m0_pages_routes/AboutContent";
import {UI_login} from "../../c1_auth/login/UI_login";
import {UI_register} from "../../c1_auth/register/UI_register";
import {FullPageLoader} from "../../../resources/miscellaneous/FullPageLoader";
import {UI_forgot_password} from "../../c1_auth/forgot_password/UI_forgot_password";

export const UI_body_wrapper = (props) => {
    return (
        <div className={"body_outer"}>
            <div className={"body_wrapper"} style={{height: props.wrapperHeight}}>
                <Switch>
                    {/*navigation links*/}
                    <Route exact path={"/"}><HomeContent/></Route>
                    <Route path={"/jobs"}><JobsContent/></Route>
                    <Route path={"/services"}><ServiceContent/></Route>
                    <Route path={"/blog"}><BlogContent/></Route>
                    <Route path={"/about"}><AboutContent/></Route>

                    {/*other pages links*/}
                    <Suspense fallback={FullPageLoader}>
                        <Route path={"/login"}><UI_login/></Route>
                        <Route path={"/register"}><UI_register/></Route>
                        <Route path={"/forgot_password"}><UI_forgot_password/></Route>
                    </Suspense>
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
                    {/*<Route path={""}>< /></Route>*/}
                    <Route path={"*"}><ErrorPage/></Route>
                </Switch>
            </div>
        </div>
    );
}