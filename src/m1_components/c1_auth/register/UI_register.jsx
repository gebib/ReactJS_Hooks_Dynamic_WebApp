import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './ST_register.scss'
import silverlining_logo from "../../../resources/images/SL_logo.svg";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {UI_sm_buttons} from "../a0_auth_common/sm_buttons/UI_sm_buttons";
import {UI_divider} from "../a0_auth_common/hl_divider/UI_divider";


export const UI_register = () => {
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

                    <input type="text" className="form-control input_name" id="register_name_input"
                           placeholder={t("register.input_name")}/>

                    <input type="email" className="form-control input_mail" id="register_email_input"
                           placeholder={t("sign_in.place_holder_mail")}/>

                    <div className={"register_pass"}>
                        <input type="password" className="form-control input_pass1" id="register_pass_input1"
                               placeholder={t("register.password")}/>

                        <input type="password" className="form-control input_pass2" id="register_pass_input2"
                               placeholder={t("register.c_password")}/>
                    </div>

                    <div className="register_cb form-check">
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate"/>
                        <label className="form-check-label" htmlFor="flexCheckIndeterminate">
                            {t("register.i_accept_the")}
                            <Link style={{textDecoration: 'none'}}
                                  to={`/router/path`}> {t("register.terms")} </Link> {t("register.and")}
                            <Link style={{textDecoration: 'none'}}
                                  to={`/router/path`}> {t("register.privacy_policy")} </Link>
                        </label>
                    </div>

                    <div className="mail_register_btn">
                        <button className="btn btn-primary" type="button"
                                disabled={isRegisterButtonDisabled}>{t("register.lbl_register")}</button>
                    </div>

                    {/*hr divider line*/}
                    <UI_divider middleText={t("register.lbl_or_register_with")}/>

                    {/*/SocialMedia buttons*/}
                    <UI_sm_buttons/>
                </div>
            </div>

        </div>);
}