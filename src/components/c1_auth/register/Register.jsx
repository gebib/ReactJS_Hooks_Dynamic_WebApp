import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './Register.scss'
import silverlining_logo from "../../../resources/images/SL_logo.svg";
import instaIconLogo from "../../../resources/images/insta_icon.webp";
import instaTextLogo from "../../../resources/images/insta_txt_logo.svg";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {FcGoogle} from 'react-icons/fc';
import {ImFacebook} from 'react-icons/im';
import {VscTwitter} from "react-icons/vsc";
import {FaInstagramSquare} from "react-icons/fa";
import {IconContext} from "react-icons";
import {GrLinkedinOption} from "react-icons/gr";


export const Register = () => {
    const {t, i18n} = useTranslation("SL_languages");
    let isRegisterButtonDisabled = true;

    return (
        <div className={"register_page_container"}>

            <div>

                <div className={"long_logo_container"}>
                    <img id={"logo_image"} src={silverlining_logo} alt={"SILVERLINING logo"}/>
                </div>

                <div className={"register-main-container"}>

                    <div className={"label_register"}>{t("register.lbl_register")}</div>

                    <div className={"label_or right_items"}>{t("register.have_account")} <Link
                        style={{textDecoration: 'none'}}
                        to={`/router/path`}>{t("sign_in.login")}</Link>
                    </div>

                    <input type="text" className="form-control input_name" id="formGroupExampleInput"
                           placeholder={t("register.pl_hl_name")}/>

                    <input type="email" className="form-control input_email" id="formGroupExampleInput"
                           placeholder={t("sign_in.place_holder_mail")}/>

                    <div className={"pass_div"}>
                        <input type="password" className="form-control input_pass" id="formGroupExampleInput1"
                               placeholder={t("sign_in.place_holder_pass")}/>

                        <input type="password" className="form-control input_pass" id="formGroupExampleInput2"
                               placeholder={t("sign_in.place_holder_pass")}/>
                    </div>

                    <div className="register_cb form-check">
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate"/>
                        <label className="form-check-label" htmlFor="flexCheckIndeterminate">
                            {t("sign_in.remember_me")}
                        </label>
                    </div>

                    <div className={"lbl_forgot_ps right_items"}><Link style={{textDecoration: 'none'}}
                                                                       to={`/router/path`}>{t("sign_in.forgot_password")}</Link>
                    </div>

                    <div className="name_register_btn">
                        <button className="btn btn-primary" type="button"
                                disabled={isRegisterButtonDisabled}>{t("sign_in.register")}</button>
                    </div>

                    <div className="text-hr text-hr--center">
                        <span className="text-hr__text">{t("sign_in.or_register_with")}</span>
                    </div>

                    <div className={"social_media_buttons"}>

                        <button className='sm_b sm_button_google'>
                            <IconContext.Provider value={{size: "20px"}}>
                                <div className={"ico_div"}>
                                    <FcGoogle/>
                                </div>
                                <span className={"icon_text"}>Google</span>
                            </IconContext.Provider>
                        </button>

                        <button className='sm_b sm_button_facebook'>
                            <IconContext.Provider value={{size: "20px", color: "#3B5998"}}>
                                <div className={"ico_div"}>
                                    <ImFacebook/>
                                </div>
                                <span className={"icon_text"}>facebook</span>
                            </IconContext.Provider>
                        </button>

                        {/*<button className='sm_b sm_button_twitter'>*/}
                        {/*    <IconContext.Provider value={{size: "20px", color: "#1DA0F1"}}>*/}
                        {/*        <div className={"ico_div"}>*/}
                        {/*            <VscTwitter/>*/}
                        {/*        </div>*/}
                        {/*        <span className={"icon_text"}>twitter</span>*/}
                        {/*    </IconContext.Provider>*/}
                        {/*</button>*/}

                        <button className='sm_b sm_button_instagram'>
                            <IconContext.Provider value={{size: "20px", color: "#9c1c65"}}>
                                <div className={"ico_div"}>
                                    <img height={"24px"} src={instaIconLogo} alt={"insta text logo"}/>
                                </div>
                                <span className={"icon_text"}><img height={"24px"} src={instaTextLogo}
                                                                   alt={"insta text logo"}/></span>
                            </IconContext.Provider>
                        </button>

                        <button className='sm_b sm_button_in'>
                            <IconContext.Provider value={{size: "20px", color: "#1DA0F1"}}>
                                <div className={"ico_div"}>
                                    <GrLinkedinOption/>
                                </div>
                                <span className={"icon_text"}>Linkedin</span>
                            </IconContext.Provider>
                        </button>

                    </div>

                </div>
            </div>

        </div>);
}