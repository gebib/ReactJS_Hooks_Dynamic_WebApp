import "./ST_Job_Viewer.scss";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import "./ST_Job_Viewer.scss";
import {useHistory, useLocation, useParams} from "react-router-dom";
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
import {showToast} from "../../../../UI_Main_pages_wrapper";


export const UI_Job_Viewer = () => {
    const {t, i18n} = useTranslation("SL_languages");
    const location = useLocation();

    const jobId = useParams();
    const [jobToView, setJobToView] = useState();
    const {read_job_single} = useAuth();
    const {delete_job} = useAuth();
    const [isAdminSignedIn, setIsAdminSignedIn] = useState(true);/////////////////////
    const [imgToUse, setImgToUse] = useState(null);
    const [jobType, setJobType] = useState(null);
    const [conType, setConType] = useState(null);


    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const {handleSubmit, register, errors, watch, formState, setValue} = useForm({mode: "onChange"});

    const history = useHistory();

    const fetchSingleJobById = async () => {
        return await read_job_single(jobId.id);
    }

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
            }else{
                history.push("/badurl404");
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

    //handle delete!
    const handleAdminTaskDelete = (childKey) => {
        if (window.confirm(t("vjob.ruSure"))) {
            delete_job(childKey);
            showToast(t("vjob.deleted", "info"));
            history.push("/jobs");
        }
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
    };


    const chooseContractType = (snData) => {
        /////////////contract type
        if (snData.jobTypeAndContAr[3]) {
            setConType(t("jform.fultime"));
        } else if (snData.jobTypeAndContAr[4]) {
            setConType(t("jform.pt"));
        } else if (snData.jobTypeAndContAr[5]) {
            setConType(t("jform.project"));
        }
    };


    return (
        <main className={"jobs_view_main"}>
            <div className={"jobs_view_bgi"}/>
            <div className={"view_wrapper row"}>
                <div className={"job_view_left col-sm-12 col-xl-8"}>
                    {jobToView ? <div dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(jobToView.txtInHTMLform),
                    }}/> : <div/>}
                </div>
                <div className={"job_view_right col-sm-12 col-xl-4 order-lg-last"}>
                    <div className={"r_side row "}>
                        <div className={"editCP_div"}>{isAdminSignedIn ? <div className={"list_header_textDiv"}>
                            <div className={"admBtn"} onClick={() => {
                                handleAdminTaskDelete(jobToView.snKey);
                            }}><IconContext.Provider value={{size: "3em", color: "#be3515"}}>
                                <MdDeleteForever/>
                            </IconContext.Provider></div>
                        </div> : <div/>
                        }</div>
                        <div>
                            <h5 style={{
                                color: "#248C9D",
                                fontWeight: "400",
                                paddingTop: "15px",
                                paddingBottom: "10px"
                            }}>{conType} | {jobType}</h5>
                        </div>
                        <div className={"jobTypeImgDiv"}>
                            <img src={imgToUse} className="job_view_cards_img_self" alt="job type image"/>
                        </div>

                        <h5 style={{
                            color: "#ffffff",
                            fontWeight: "400",
                            marginTop: "20px",
                            marginBottom: "20px",
                        }}>{t("jform.interest")}</h5>
                        <a href={"mailto:marianne.haavardstun@silverliningit.no?subject=" + t("vjob.subject") + "&body=" + t("vjob.body") + ": https://www.silverliningit.no" + location.pathname + " " + t("vjob.contactMe")}>
                            <button style={{width: "100%"}} className={"btn btn-success mb-4"}
                                    type="submit">
                                {t("vjob.sendEmailToUs")}
                            </button>
                        </a>

                    </div>
                </div>
            </div>
        </main>
    );
};
