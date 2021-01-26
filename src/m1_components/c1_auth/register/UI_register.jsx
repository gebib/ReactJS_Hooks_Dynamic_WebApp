import React, {useEffect, useRef, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './ST_register.scss'
import silverlining_logo from "../../../resources/images/SL_logo.svg";
import {useTranslation} from "react-i18next";
import {Link, useHistory} from "react-router-dom";
import {UI_sm_buttons} from "../a0_auth_common/sm_buttons/UI_sm_buttons";
import {UI_hl_divider} from "../a0_auth_common/hl_divider/UI_hl_divider";
import {useAuth} from "../../a0_shared_all/context/AuthProvider";
import {useForm} from "react-hook-form";


export const UI_register = () => {
    let isRegisterButtonDisabled = false;
    const {t, i18n} = useTranslation("SL_languages");

    //there are several mods to select for useForm: sonsult doc.
    /*{reValidateMode: "onSubmit"} // if needed to validate only on submit*/
    const {handleSubmit, register, errors, watch, formState} = useForm({mode: "onChange"});
    const password = useRef({});
    const history = useHistory();
    password.current = watch("password", "");

    // const {signup} = useAuth();

    const registerValidUser = (formData) => {
        console.log(" ::////", formData);
    }


    return (
        <div className={"register_page_container"}>
            <form onSubmit={handleSubmit((formData) => {
                registerValidUser(formData);
            })} noValidate={true}>
                <div className={"long_logo_container"}>
                    <img id={"logo_image"} src={silverlining_logo} alt={"SILVERLINING logo"}
                         onClick={() => history.push("/")} style={{cursor: "pointer"}}/>
                </div>

                <div className={"register-main-container"}>
                    <div className={"label_register"}>{t("register.lbl_register")}</div>
                    <div className={"label_or right_items"}>
                        {t("register.have_account")}<Link style={{textDecoration: 'none'}}
                                                          to={"/login"}>{t("sign_in.login")}</Link>
                    </div>
                    <div className={"input_wrappers input_name"}>
                        <input name={"name"}
                               ref={register({
                                   required: {
                                       value: true,
                                       message: t("register.typeInYourName")
                                   },
                                   pattern: {
                                       value: /^[ÆØÅæøåA-Za-z._ -]+[A-Za-z]{0,15}$/, //enything of the set [] between 1 to 15 chars.
                                       message: "Name should be within: A to Z, and can include Æ, Ø, Å."
                                   }
                               })}
                               type="text"
                               className="form-control input_name"
                               id="register_name_input"
                            // style={errors.name ? {border: "1px solid red"} : null}
                               placeholder={t("register.input_name")}/>
                        <div className={"show_error"}>{errors.name ? <div>{errors.name.message}</div> : null}</div>
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
                                       message: "Please type in a valid email"
                                   }
                               })}
                               type="email"
                               className="form-control input_mail"
                               id="register_email_input"
                               placeholder={t("sign_in.place_holder_mail")}/>
                        <div className={"show_error"}>{errors.email ? <div>{errors.email.message}</div> : null}</div>
                    </div>

                    <div className={"register_pass input_pass1"}>
                        <div className={"input_wrappers"}>
                            <input name={"password"} type="password"
                                   ref={register({
                                       required: {
                                           value: true,
                                           message: t("register.addPassword")
                                       },
                                       minLength: {
                                           value: 6,
                                           message: t("register.passwordIsTooShort")
                                       }
                                   })}
                                   className="form-control input_pass1"
                                   id="register_pass_input1"
                                // style={errors.password ? {border: "1px solid red"} : null}
                                   placeholder={t("register.password")}/>
                            <div className={"show_error"}>{errors.password ?
                                <div>{errors.password.message}</div> : null}</div>
                        </div>

                        <div className={"input_wrappers input_pass2"}>
                            <input name={"confirm_password"}
                                   ref={register({
                                       required: {
                                           value: true,
                                           message: t("register.confirmPassword")
                                       },
                                       validate: value =>
                                           value === password.current || t("register.passwordDontMatch")
                                   })}
                                   type="password"
                                   className="form-control input_pass2"
                                   id="register_pass_input2"
                                // style={errors.confirm_password ? {border: "1px solid red"} : null}
                                   placeholder={t("register.c_password")}/>
                            <div className={"show_error"}>{errors.confirm_password ?
                                <div>{errors.confirm_password.message}</div> : null}</div>
                        </div>
                    </div>

                    <div className={"terms_indv"}>
                        <div className="register_cb form-check">
                            <input className="form-check-input"
                                   name={"terms"}
                                   ref={register({
                                       required: {
                                           value: true,
                                           message: t("register.checkAgreement")
                                       },
                                   })}
                                   type="checkbox"/>
                            <label className="form-check-label"
                                   htmlFor="flexCheckIndeterminate">{t("register.i_accept_the")}
                                <Link style={{textDecoration: 'none'}}
                                      to={`/router/path`}> {t("register.terms")} </Link> {t("register.and")}
                                <Link style={{textDecoration: 'none'}}
                                      to={`/router/path`}> {t("register.privacy_policy")} </Link>
                            </label>
                        </div>
                        <div className={"show_error"}>{errors.terms ? <div>{errors.terms.message}</div> : null}</div>
                    </div>

                    <div className="mail_register_btn">
                        <button className={!formState.isValid ? "btn btn-danger" : "btn btn-success"}
                                type="submit"
                                disabled={!formState.isValid}>{t("register.lbl_register")}</button>
                    </div>

                    {/*hr divider line*/}
                    <UI_hl_divider middleText={t("register.lbl_or_register_with")}/>

                    {/*SocialMedia buttons*/}
                    <UI_sm_buttons/>
                </div>
            </form>

        </div>);
}