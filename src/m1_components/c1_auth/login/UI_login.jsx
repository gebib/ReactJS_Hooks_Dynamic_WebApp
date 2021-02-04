import React, {useRef, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './ST_login.scss'
import silverlining_logo from "../../../resources/images/SL_logo.svg";
import {useTranslation} from "react-i18next";
import {Link, useHistory} from "react-router-dom";
import {UI_sm_buttons} from "../sm_buttons/UI_sm_buttons";
import {UI_hl_divider} from "../hl_divider/UI_hl_divider";
import {useForm} from "react-hook-form";
import {showToast} from "../../../UI_Main_pages_wrapper";
import {useAuth} from "../a0_auth_common/firebase/AuthContext";


export const UI_login = () => {
    const {t, i18n} = useTranslation("SL_languages");


    const {handleSubmit, register, errors, watch, formState} = useForm({mode: "onChange"});
    const password = useRef({});
    const history = useHistory();
    password.current = watch("password", "");
    const [loading, setLoading] = useState(false);

    const {login} = useAuth();

    const signInValidUser = async (formData) => {
        try {
            setLoading(true);
            await login(formData.email, formData.password);
            history.push("/");
        } catch { // in case signup has failed
            showToast(t("sign_in.try_again"), "error");
        }
    }

    return (
        <div className={"login_page_container"}>
            <form onSubmit={handleSubmit((formData) => {
                signInValidUser(formData).then(r => {
                    setLoading(false);
                });
            })} noValidate={true}>
                <div className={"long_logo_container"}>
                    <img id={"logo_image"} src={silverlining_logo} alt={"SILVERLINING logo"} style={{cursor: "pointer"}}
                         onClick={() => history.push("/")}/>
                </div>

                <div className={"login-main-container"}>
                    <div className={"label_login"}>{t("sign_in.login")}</div>
                    <div className={"label_or right_items"}>{t("sign_in.or")}
                        <Link style={{textDecoration: 'none'}}
                              to={"/register"}>{t("sign_in.create_an_account")}</Link>
                    </div>

                    <div className={"input_wrappers input_mail"}>
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
                    </div>

                    <div className={"input_wrappers input_pass"}>
                        <input name={"password"} type="password"
                               ref={register({
                                   required: {
                                       value: true,
                                       message: t("sign_in.please_type_in_password")
                                   },
                                   minLength: {
                                       value: 6,
                                       message: t("register.passwordIsTooShort")
                                   }
                               })}
                               className="form-control input_pass"
                               placeholder={t("sign_in.place_holder_pass")}/>
                        <div className={"show_error"}>{errors.password ?
                            <div>{errors.password.message}</div> : null}</div>
                    </div>

                    <div className="login_checkBox form-check">
                        <input className="form-check-input"
                               name={"remember"}
                               ref={register}
                               type="checkbox"/>
                        <label className="form-check-label"
                               htmlFor="flexCheckIndeterminate">
                            {t("sign_in.remember_me")}
                        </label>
                    </div>

                    <div className={"lbl_forgot_ps right_items"}><Link style={{textDecoration: 'none'}}
                                                                       to={"/forgot_password"}>{t("sign_in.forgot_password")}</Link>
                    </div>

                    <div className="mail_login_btn">
                        <button className={!formState.isValid ? "btn btn-danger" : "btn btn-success"}
                                type="submit"
                                disabled={!formState.isValid || loading}>
                            {loading ? <span className="spinner-border mx-1 text-info spinner-border-sm" role="status"
                                             aria-hidden="true"/> : null}
                            {t("sign_in.login")}
                        </button>
                    </div>
                    {/*hr divider line*/}
                    <UI_hl_divider middleText={t("sign_in.or_login_with")}/>
                    {/*/SocialMedia buttons*/}
                    <UI_sm_buttons/>
                </div>
            </form>
        </div>);
}