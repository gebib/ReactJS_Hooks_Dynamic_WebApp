import "./ST_Job_Viewer.scss";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import "./ST_Job_Viewer.scss";
import {useParams} from "react-router-dom";
import {useAuth} from "../../../c1_auth/a0_auth_common/firebase/AuthContext";
import htmlToDraft from "html-to-draftjs";
import {ContentState, EditorState} from "draft-js";
import DOMPurify from 'dompurify';
import {MdDeleteForever} from "react-icons/md";
import {RiEdit2Fill} from "react-icons/ri";
import {IconContext} from "react-icons";
import projMngrImg from "../../../../resources/images/project-manager.jpg";
import itDevImg from "../../../../resources/images/developer.png";
import archiTkImg from "../../../../resources/images/architect.jpg";
import devImg from "../../../../resources/images/developer.png";
import projMngr from "../../../../resources/images/project-manager.jpg";
import archiImg from "../../../../resources/images/architect.jpg";
import {useForm} from "react-hook-form";



export const UI_Job_Viewer = () => {
    const {t, i18n} = useTranslation("SL_languages");

    const jobId = useParams();
    const [jobToView, setJobToView] = useState();
    const {read_job_single} = useAuth();
    const [isAdminSignedIn, setIsAdminSignedIn] = useState(false);/////////////////////
    const [imgToUse, setImgToUse] = useState(null);
    const [jobType, setJobType] = useState(null);
    const [conType, setConType] = useState(null);



    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const fetchSingleJobById = async () => {
        return await read_job_single(jobId.id);
    }

    const {handleSubmit, register, errors, watch, formState, setValue} = useForm({mode: "onChange"});

    useEffect(() => {
        fetchSingleJobById().then(child => {
            if (child.val() !== null) {
                let snData = {
                    snKey: child.key,
                    jobTypeAndContAr: JSON.parse(child.val()[0]),
                    jobTxtRawTableData: JSON.parse(child.val()[1][0]).blocks,
                    txtInHTMLform: JSON.parse(child.val()[1][1]),
                    postedDate: JSON.parse(child.val()[2])
                }
                chooseImageToUse(snData);
                chooseContractType(snData);
                setJobToView(snData);
            }
        });
        // }
        return () => {
            //cleanup
        }
    }, [/*for update on change*/]);

    const convertHtmlToDraftForViewing = () => {

        let contentBlock = htmlToDraft(jobToView.txtInHTMLform);

        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(
                contentBlock.contentBlocks
            );
            return EditorState.createWithContent(contentState);
        }
    }

    //edit/delete any job.
    const handleAdminTaskEdit = (childKey) => {
        console.log("////:edit ", childKey);
        //TODO deleteLocalCache, gotoEditWithDataToUpdate
    }

    const handleAdminTaskDelete = (childKey) => {
        console.log("////:delete ", childKey);
        //TODO deleteLocalCache, gotoListOfJobs
    }

    const chooseImageToUse = (snData) => {
        if (snData.jobTypeAndContAr[0]) {
            setImgToUse(devImg);
            setJobType(t("jform.itdev"));
        } else if (snData.jobTypeAndContAr[1]) {
            setImgToUse(projMngr);
            setJobType(t("jform.projM"));
        } else if (snData.jobTypeAndContAr[2]) {
            setImgToUse(archiImg);
            setJobType(t("jform.arch"));
        }
    }


    const chooseContractType = (snData) =>{
        /////////////contract type
        if (snData.jobTypeAndContAr[3]) {
            setConType(t("jform.fultime"));
        } else if (snData.jobTypeAndContAr[4]) {
            setConType(t("jform.pt"));
        } else if (snData.jobTypeAndContAr[5]) {
            setConType(t("jform.project"));
        }
    }

    const sendInterest = (contactInfo) => {
         console.log("////: ", contactInfo);
         alert(t("vjob.thanks"));
        window.location.reload();
    }


    return (
        <main className={"jobs_view_main"}>

            {/*<Prompt when={shouldPrompt} message={t("jform.touchedInfo")}/>*/}
            <div className={"container jobs_view_bgi"}/>
            <div className={"view_wrapper row"}>
                <div className={"job_view_left col-sm-12 col-xl-8"}>
                    {/*the job ad text*/}
                    {jobToView ? <div dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(jobToView.txtInHTMLform),
                    }}/> : <div/>}
                </div>
                {/*////////////////////////////Right side control panel/////////////////////*/}
                <div className={"job_view_right col-sm-12 col-xl-4 order-lg-last"}>
                    <div className={"r_side row "}>
                        <div className={"editCP_div"}>{isAdminSignedIn ? <div className={"list_header_textDiv"}>
                            <div className={"admBtn"} onClick={() => {
                                handleAdminTaskEdit(jobToView.snKey);
                            }}><IconContext.Provider
                                value={{size: "3em", color: "#123456", "&:hover": {color: "green"}}}>
                                <RiEdit2Fill/>
                            </IconContext.Provider></div>
                            <div className={"admBtn"} onClick={() => {
                                handleAdminTaskDelete(jobToView.snKey);
                            }}><IconContext.Provider value={{size: "3em", color: "#be3515"}}>
                                <MdDeleteForever/>
                            </IconContext.Provider></div>
                        </div> : <div/>
                        }</div>
                        <div>
                            <h5 style={{ color: "#248C9D", fontWeight: "400", paddingTop: "15px",paddingBottom: "10px"}}>{conType} | {jobType}</h5>
                        </div>
                        <div className={"jobTypeImgDiv"}>
                            <img src={imgToUse} className="job_view_cards_img_self" alt="job type image"/>
                        </div>
                        <form className={"contactForm"} onSubmit={handleSubmit((formData) => {
                            sendInterest(formData);
                        })} noValidate={true}>
                            <div className={"input_wrappers input_name my-4"}>
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
                                <div className={"show_error"}>{errors.name ?
                                    <div>{errors.name.message}</div> : null}</div>
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
                                <div className={"show_error"}>{errors.email ?
                                    <div>{errors.email.message}</div> : null}</div>
                            </div>
                            <div className="d-grid gap-2 col-12 mx-auto">
                            <button disabled={!formState.isValid} className={!formState.isValid ? "btn btn-danger my-4" : "btn btn-success my-4"}
                                    type="submit">
                                {t("vjob.sendIn")}
                            </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
