import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './Login.scss'
import silverlining_logo from "../../../resources/images/SL_logo.svg";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {FcGoogle} from 'react-icons/fc';
import {ImFacebook} from 'react-icons/im';
import {VscTwitter} from "react-icons/vsc";
import {FaInstagramSquare} from "react-icons/fa";
import {IconContext} from "react-icons";


export const Login = () => {
    const {t, i18n} = useTranslation("SL_languages");
    let isLoginButtonDisabled = true;

    return (
        <div className={"login_page_container"}>

            <div>

                <div className={"long_logo_container"}>
                    <img id={"logo_image"} src={silverlining_logo} alt={"SILVERLINING logo"}/>
                </div>

                <div className={"login-main-container"}>

                    <div className={"label_login"}>{t("sign_in.login")}</div>

                    <div className={"label_or right_items"}>{t("sign_in.or")} <Link style={{textDecoration: 'none'}}
                                                                                    to={`/router/path`}>{t("sign_in.create_an_account")}</Link>
                    </div>

                    <input type="text" className="form-control input_mail" id="formGroupExampleInput"
                           placeholder={t("sign_in.place_holder_mail")}/>

                    <input type="text" className="form-control input_pass" id="formGroupExampleInput2"
                           placeholder={t("sign_in.place_holder_pass")}/>

                    <div className="login_cb form-check">
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate"/>
                        <label className="form-check-label" htmlFor="flexCheckIndeterminate">
                            {t("sign_in.remember_me")}
                        </label>
                    </div>

                    <div className={"lbl_forgot_ps right_items"}><Link style={{textDecoration: 'none'}}
                                                                       to={`/router/path`}>{t("sign_in.forgot_password")}</Link>
                    </div>

                    <div className="mail_login_btn">
                        <button className="btn btn-primary" type="button"
                                disabled={isLoginButtonDisabled}>{t("sign_in.login")}</button>
                    </div>

                    <div className="text-hr text-hr--center">
                        <span className="text-hr__text">{t("sign_in.or_login_with")}</span>
                    </div>

                    <div className={"social_media_buttons"}>

                        {/*<div className={"google_button"}>*/}
                        {/*    <button className="google_btn btn btn-primary"*/}
                        {/*            type="button">{t("sign_in.with_google")}</button>*/}
                        {/*</div>*/}

                        {/*<div className={"facebook_button"}>*/}
                        {/*    <button className="facebook_btn btn btn-primary"*/}
                        {/*            type="button">{t("sign_in.with_facebook")}</button>*/}
                        {/*</div>*/}

                        {/*<div className={"linkedin_button"}>*/}
                        {/*    <button className="linkedin_btn btn btn-primary"*/}
                        {/*            type="button">{t("sign_in.with_linkedin")}</button>*/}
                        {/*</div>*/}

                        {/*<div className={"twitter_button"}>*/}
                        {/*    <button className="twitter_btn btn btn-primary"*/}
                        {/*            type="button">{t("sign_in.with_twitter")}</button>*/}
                        {/*</div>*/}

                        {/*<div className={"insta_button"}>*/}
                        {/*    <button className="insta_btn btn btn-primary" type="button">{t("sign_in.with_insta")}</button>*/}
                        {/*</div>*/}


                        <button className='sm_b sm_button_google'>
                            <IconContext.Provider value={{size: "20px"}}>
                                <div className={"ico_div"}>
                                    <FcGoogle/>
                                </div>
                                <span>Google</span>
                            </IconContext.Provider>
                        </button>

                        <button className='sm_b sm_button_facebook'>
                            <IconContext.Provider value={{size: "20px", color: "#3B5998"}}>
                                <div className={"ico_div"}>
                                    <ImFacebook/>
                                </div>
                                <span>facebook</span>
                            </IconContext.Provider>
                        </button>
                        <button className='sm_b sm_button_twitter'>
                            <IconContext.Provider value={{size: "20px", color: "#1DA0F1"}}>
                                <div className={"ico_div"}>
                                    <VscTwitter/>
                                </div>
                                <span>twitter</span>
                            </IconContext.Provider>
                        </button>
                        <button className='sm_b sm_button_instagram'>
                            <IconContext.Provider value={{size: "20px", color: "#9c1c65"}}>
                                <div className={"ico_div"}>
                                    <FaInstagramSquare/>
                                </div>
                                <span>instagram</span>
                            </IconContext.Provider>
                        </button>
                    </div>

                </div>
            </div>

        </div>);
}