import React, {useCallback, useEffect, useRef, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './ST_register.scss'
import silverlining_logo from "../../../resources/images/SL_logoBLK.svg";
import avatar from "../../../resources/images/avatar.svg";
import {useTranslation} from "react-i18next";
import {Link, useHistory} from "react-router-dom";
import {UI_sm_buttons} from "../../a0_shared_all/sm_buttons/UI_sm_buttons";
import {UI_hl_divider} from "../hl_divider/UI_hl_divider";
import {useForm} from "react-hook-form";
import {useAuth} from "../a0_auth_common/firebase/AuthContext";
import {showToast} from "../../../UI_Main_pages_wrapper";


///////////imgc/////////////////////////
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {useResizeObserver} from "./useResizeObserver";
import ReCAPTCHA from "react-google-recaptcha";


export const UI_register = () => {
    const {t, i18n} = useTranslation("SL_languages");
    //there are several mods to select for useForm: sonsult doc.
    /*{reValidateMode: "onSubmit"} // if needed to validate only on submit*/
    const {handleSubmit, register, errors, watch, formState, setValue} = useForm({mode: "onSubmit"});
    const password = useRef({});
    const history = useHistory();
    password.current = watch("password", "");
    const [loading, setLoading] = useState(false);
    const [editImage, setEditImage] = useState(true);
    const [terms, setTerms] = useState(false);

    const {signup} = useAuth();
    const {getFbStorage, getFbDb} = useAuth();
    // const {currentUser} = useAuth();/////////////////////////////////////////////////////////////current user
    const {addUserDataToList} = useAuth();

    /////////////////imgc///////////////////////////////////
    const [upImg, setUpImg] = useState();

    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({unit: 'px', width: 200, aspect: 1});
    const [completedCrop, setCompletedCrop] = useState(null);
    const [cropingDone, setCropingDone] = useState(false);///////////////////////////////////
    const [tempProfileImg, setTempProfileImg] = useState(null);
    const [progressNr, setProgressNr] = useState(0);

    //////////////recaptcha//////////////////////
    const SITE_KEY = '6Lc83XgaAAAAAKqZIVnRoWAWRXdUScInPXTsOiQJ';
    const [expired, setExpired] = useState(true);


    // triggered when recatpcha is triggered or expires
    const handleRecaptchaChange = (value) => {
        if (value) {
            setExpired(false);
        } else {
            setExpired(true);
        }
    };


    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setUpImg(reader.result));
            reader.readAsDataURL(e.target.files[0]);
            setFileSelection(true);
        } else {
            setFileSelection(false);
            setEditImage(false);
        }

    };

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    async function registerValidUser(formData) {
        try {
            setLoading(true);
            await signup(formData.email, formData.password).then(auth => {
                setLoading(false);
                showToast(t("register.registeredOk"), "info");

                //if user have has profile photo selected::
                if (tempProfileImg) {
                    // console.log("////: attempt adding img");
                    const storage = getFbStorage(); //formData.name, tempProfileImg, auth
                    storage.ref("profile_imgs/" + auth.user.uid + "/profile.png").put(tempProfileImg).on(
                        "state_changed",
                        snapshot => {
                            const progress = Math.round(
                                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                            );
                            setProgressNr(progress);
                        }, error => {
                            console.log(error);
                        }, () => {
                            // .getDownloadURL().then(url =>
                            storage.ref("profile_imgs/" + auth.user.uid + "/profile.png");
                            clearRegisteringProcess();
                        }
                    );
                } else {
                    console.log("////: no image selected");
                    clearRegisteringProcess();
                }
                //add additional user info etc.
                addUserDataToList(formData.name, auth, (tempProfileImg !== null)); //no need to set profile img url since they use uid.
            });
        } catch (e) { // in case signup has failed
            console.log("///Failed some: ", e.message);
            setLoading(false);
            if (e.message === "The email address is already in use by another account.") {
                showToast(t("register.inUse"), "error");
            } else {
                showToast(t("register.tryAgain"), "error");
            }
        }
    }

    const clearRegisteringProcess = () => {
        setLoading(false);
        history.push("/");
    };

    function getCroppedImage(canvas, crop) {
        if (!crop || !canvas) {
            return;
        }
        canvas.toBlob((blob) => {
            setTempProfileImg(blob);
        });
    }

    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;

        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
    }, [completedCrop]);
    ////////////////////imgc///////////////////////////////
    const [dimensions, setDimensions] = useState({top: 0, left: 0});
    const imgContainerRef = useRef(null);

    // Optional callback to access the full DOMRect object if required.
    const optionalCallback = (entry: DOMRectReadOnly) => {
        setDimensions({top: entry.x, left: entry.left});
    }

    // Access the width and the height returned from the observed element.
    const [width, height] = useResizeObserver(imgContainerRef, optionalCallback);
    const [imgWidth, setImgWidth] = useState(800);

    //file selection etc.
    const [fileSelection, setFileSelection] = useState(false);


    useEffect(() => {
        if (height > 700) {
            let overFlow = height - 700;
            let reductionPrsnt = (overFlow * 100) / height;
            setImgWidth(width - ((width / 100) * reductionPrsnt));
        } else {
            // console.log("////width to set: ", imgWidth);
        }
    }, [width, height]);


    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [p1, setP1] = useState("");
    const [p2, setP2] = useState("");


    useEffect(() => {
        let tempData = localStorage.getItem("tempFormData");
        if (tempData) {
            let restoredValues = JSON.parse(tempData);
            setName(JSON.parse(tempData)[0]);
            setValue("name", JSON.parse(tempData)[0]);

            setEmail(JSON.parse(tempData)[1]);
            setValue("email", JSON.parse(tempData)[1]);

            setP1(JSON.parse(tempData)[2]);
            setValue("password", JSON.parse(tempData)[2]);

            setP2(JSON.parse(tempData)[3]);
            setValue("confirm_password", JSON.parse(tempData)[3]);

            setP2(JSON.parse(tempData)[4]);
            setValue("confirm_password", JSON.parse(tempData)[3]);

            localStorage.removeItem("tempFormData");
        }
    }, [name]);

    const cropState = (c) => {
        setCompletedCrop(c);
        setCropingDone(true);
    };


    return (
        <div className={"register_page_container"}>
            { /*to set img size dynamically so it istays within parent div*/
                (!cropingDone) ? null :
                    <style>{".ReactCrop__image{width: " + imgWidth + "px;"}</style>
                /*/////////////////////////////////////////////////////////////*/
            }
            <form onSubmit={handleSubmit((formData) => {
                registerValidUser(formData).then(r => {
                });
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
                    <div className={"profilePic"}>
                        {(!cropingDone) ?
                            <div className={"avatar_image_or_canvas"}>
                                <label onClick={() => editImage ? setEditImage(false) : setEditImage(true)}
                                       htmlFor="file-upload" className="custom-file-upload"><img
                                    className={"avat_image_self"} src={avatar} alt={"user avatar"}
                                    style={{cursor: "pointer"}}/></label>
                                <input id="file-upload" type="file" accept="image/*" onChange={onSelectFile}/>
                            </div> :
                            <canvas className={"avatar_image_or_canvas"} ref={previewCanvasRef}
                                // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                                //     style={{
                                //         width: Math.round(completedCrop?.width ?? 0),
                                //         height: Math.round(completedCrop?.height ?? 0),
                                //         cursor: "pointer"
                                //     }}
                                    onClick={() => {
                                        localStorage.setItem("tempFormData", JSON.stringify([name, email, p1, p2, terms]));
                                        window.location.reload();
                                    }}
                            />
                        }
                    </div>
                    <div className={"input_wrappers input_name"}>
                        <input name={"name"}
                               onChange={(e) => {
                                   setName(e.target.value);
                               }}

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
                               placeholder={t("register.input_name")}/>
                        <div className={"show_error"}>{errors.name ? <div>{errors.name.message}</div> : null}</div>
                    </div>

                    <div className={"input_wrappers input_mail"}>
                        <input name={"email"}
                               onChange={(e) => {
                                   setEmail(e.target.value);
                               }}
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
                                   onChange={(e) => {
                                       setP1(e.target.value);
                                   }}
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
                                   placeholder={t("register.password")}/>
                            <div className={"show_error"}>{errors.password ?
                                <div>{errors.password.message}</div> : null}</div>
                        </div>

                        <div className={"input_wrappers input_pass2"}>
                            <input name={"confirm_password"}
                                   onChange={(e) => {
                                       setP2(e.target.value);
                                   }}
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
                                   placeholder={t("register.c_password")}/>
                            <div className={"show_error"}>{errors.confirm_password ?
                                <div>{errors.confirm_password.message}</div> : null}</div>
                        </div>
                    </div>
                    {/*privacy policy agree check box*/}
                    <div className={"terms_indv"}>
                        <div className="register_cb form-check">
                            <input name={"terms"}
                                   onChange={(e) => {
                                       setTerms(e.target.checked);
                                   }}
                                   className="form-check-input"
                                   ref={register({
                                       required: {
                                           value: true,
                                           message: t("register.checkAgreement")
                                       },
                                   })}
                                   type="checkbox"/>
                            <label className="form-check-label"
                                   htmlFor="flexCheckIndeterminate">{t("register.i_accept_the")}
                                {t("register.terms")} {t("register.and")}
                                <Link style={{textDecoration: 'none'}}
                                      to={`/privacypolicy`}> {t("register.privacy_policy")} </Link>
                            </label>
                        </div>
                        <div className={"show_error mb-2"}>{errors.terms ?
                            <div>{errors.terms.message}</div> : null}</div>
                    </div>

                    <div className="mail_register_btn">
                        <button className={!formState.isValid ? "btn btn-danger" : "btn btn-success"}
                                type="submit">
                            {loading ? <span className="spinner-border mx-1 text-info spinner-border-sm" role="status"
                                             aria-hidden="true"/> : null}
                            {t("register.lbl_register")}
                        </button>
                    </div>

                    {/*/!*hr divider line*!/*/}
                    {/*<UI_hl_divider middleText={t("register.lbl_or_register_with")}/>*/}
                    {/*/!*SocialMedia buttons*!/*/}
                    {/*<UI_sm_buttons/>*/}
                    {/*TODO add exception include recaptcha check before registration is valid!*/}
                    <div className={"reCaptcha"}>
                        <ReCAPTCHA
                            theme="dark"
                            onChange={handleRecaptchaChange}
                            sitekey={SITE_KEY}
                        />
                    </div>

                    <div className={"progress_wrapper"}>
                        <div className="progress">
                            <div className="progress " style={{width: progressNr + "%", backgroundColor: "#248C9D"}}
                                 role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"/>
                        </div>
                    </div>
                </div>
            </form>
            <div hidden={!fileSelection} className={"imageEdit"}>
                <div ref={imgContainerRef} className={"editorL1Container"}>
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onSelectFile}/>
                    </div>
                    <ReactCrop
                        src={upImg}
                        onImageLoaded={onLoad}
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => {
                            cropState(c);
                        }}/>
                </div>
                <div className={"row my-1"}>
                    <button
                        className={(!cropingDone) ? "btn btn-danger" : "btn btn-success"}
                        type="button"
                        disabled={!cropingDone}
                        style={(!cropingDone) ? {width: 200} : {width: imgWidth}}
                        onClick={() => {
                            getCroppedImage(previewCanvasRef.current, completedCrop);
                            setFileSelection(false);
                        }
                        }>OK
                    </button>

                </div>
            </div>
        </div>);
}
