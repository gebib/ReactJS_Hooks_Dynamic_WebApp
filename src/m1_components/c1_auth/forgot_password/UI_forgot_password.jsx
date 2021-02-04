import React, {useEffect, useState} from "react";
import "./ST_forgot_password.scss";
import silverlining_logo from "../../../resources/images/SL_logo.svg";
import {useTranslation} from "react-i18next";
import {Link, useHistory} from "react-router-dom";
import {useForm} from "react-hook-form";
import {showToast} from "../../../UI_Main_pages_wrapper";
import {useAuth} from "../a0_auth_common/firebase/AuthContext";


export const UI_forgot_password = () => {
    const {t, i18n} = useTranslation("SL_languages");
    const {btnDisable, setBtnDisable} = useState(true);
    const {handleSubmit, register, errors, watch, formState} = useForm({mode: "onChange"});
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const {resetPassword} = useAuth();

    const sendResetLink = async (formData) => {
        try {
            setLoading(true);
            await resetPassword(formData.email);
            showToast(t("forgot.resetLinkInfo"), "info");
            history.push("/");
        } catch { // in any error
            showToast(t("forgot.resendMeLink"), "error");
        }

    }
    return (
        <div className={"forgot_page_container"}>
            <form onSubmit={handleSubmit((formData) => {
                sendResetLink(formData).then(r => {
                    setLoading(false);
                });
            })} noValidate={true}>
                <div>
                    <div className={"long_logo_container"}>
                        <img id={"logo_image"} src={silverlining_logo} alt={"SILVERLINING logo"}
                             style={{cursor: "pointer"}}
                             onClick={() => history.push("/")}/>
                    </div>

                    <div className={"forgot-main-container"}>

                        <div className={"lbl_info_txt_wrapper"}>
                            <div className={"label_forgot"}>{t("forgot.lbl_forgot")}</div>
                            <div className={"i_txt"}>{t("forgot.info_txt")}</div>
                        </div>

                        <input name={"email"}
                               ref={register({
                                   required: {
                                       value: true,
                                       message: t("register.typeInYourEmail")
                                   },
                                   pattern: {
                                       value: /^[ÆØÅæøåA-Za-z0-9._%+-]+@(?:[ÆØÅæøåA-Za-z0-9-]+\.)+[A-Za-z]{2,15}$/,
                                       message: t("sign_in.typeInValidEmail")
                                   }
                               })}
                               type="email"
                               className="form-control input_mail"
                               id="register_email_input"
                               placeholder={t("sign_in.place_holder_mail")}/>
                        <div className={"show_error"}>{errors.email ? <div>{errors.email.message}</div> : null}</div>


                        <div className="mail_forgot_btn">
                            {/*<button className="btn btn-primary" type="button"*/}
                            {/*        disabled={btnDisable}>{t("forgot.send_reset_link")}</button>*/}
                            <button className={!formState.isValid ? "btn btn-danger" : "btn btn-success"}
                                    type="submit"
                                    disabled={!formState.isValid || loading}>
                                {loading ?
                                    <span className="spinner-border mx-1 text-info spinner-border-sm" role="status"
                                          aria-hidden="true"/> : null}
                                {t("sign_in.login")}
                            </button>
                        </div>

                        <Link className={"reset_help"} style={{textDecoration: 'none'}}
                              to={`/router/path`}>{t("forgot.info_txt2")}</Link>

                    </div>
                </div>
            </form>

        </div>
    );
}