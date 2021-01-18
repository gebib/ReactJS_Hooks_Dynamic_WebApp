import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './ST_login.scss'
import silverlining_logo from "../../../resources/images/SL_logo.svg";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {UI_sm_buttons} from "../a0_auth_common/sm_buttons/UI_sm_buttons";
import {UI_hl_divider} from "../a0_auth_common/hl_divider/UI_hl_divider";


export const UI_login = () => {
    const {t, i18n} = useTranslation("SL_languages");
    let isRegisterButtonDisabled = true;

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

                    <input type="email" className="form-control input_mail" id="formGroupExampleInput"
                           placeholder={t("sign_in.place_holder_mail")}/>

                    <input type="password" className="form-control input_pass" id="formGroupExampleInput2"
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
                                disabled={isRegisterButtonDisabled}>{t("sign_in.login")}</button>
                    </div>
                    {/*hr divider line*/}
                    <UI_hl_divider middleText={t("sign_in.or_login_with")}/>
                    {/*/SocialMedia buttons*/}
                    <UI_sm_buttons/>
                </div>
            </div>

        </div>);
}