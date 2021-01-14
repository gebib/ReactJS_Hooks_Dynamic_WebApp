import React, {useState} from "react";
import "./ST_forgot_password.scss";
import silverlining_logo from "../../../../resources/images/SL_logo.svg";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";


export const UI_forgot_password = () => {
    const {t, i18n} = useTranslation("SL_languages");
    let isRegisterButtonDisabled = true;
    return (
        <div className={"forgot_page_container"}>

            <div>
                <div className={"long_logo_container"}>
                    <img id={"logo_image"} src={silverlining_logo} alt={"SILVERLINING logo"}/>
                </div>

                <div className={"forgot-main-container"}>

                    <div className={"lbl_info_txt_wrapper"}>
                        <div className={"label_forgot"}>{t("forgot.lbl_forgot")}</div>
                        <div className={"i_txt"}>{t("forgot.info_txt")}</div>
                    </div>

                    <input type="email" className="form-control input_mail" id="forgot_email_input"
                           placeholder={t("sign_in.place_holder_mail")}/>


                    <div className="mail_forgot_btn">
                        <button className="btn btn-primary" type="button"
                                disabled={isRegisterButtonDisabled}>{t("forgot.send_reset_link")}</button>
                    </div>

                    <Link className={"reset_help"} style={{textDecoration: 'none'}} to={`/router/path`}>{t("forgot.info_txt2")}</Link>

                </div>
            </div>

        </div>
    );
}