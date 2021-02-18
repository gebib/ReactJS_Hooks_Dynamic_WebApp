import React, {useEffect, useRef, useState} from "react";
import "./Jobs_form.scss";
import {useTranslation} from "react-i18next";

import {showToast, useWindowSize} from "../../../../UI_Main_pages_wrapper";
import {UI_logo_with_image} from "../../../a2_logo_with_image/UI_logo_with_image";
import TextEditorWYSIWYG from "../../../a0_shared_all/wysiwyg/TextEditorWYSIWYG";
import projMngrImg from "../../../../resources/images/project-manager.jpg";
import itDevImg from "../../../../resources/images/developer.png";
import archiTkImg from "../../../../resources/images/architect.jpg";
import {EditorState, convertToRaw, ContentState} from "draft-js";

////////date picker///////////////
import "antd/dist/antd.css";
import DateInput from "../../../a0_shared_all/date_input/DateInput";
import DatePicker from "antd/es/date-picker";
import {useHistory, useLocation} from "react-router-dom";
import {Prompt} from "react-router-dom";
import moment from "moment";
import {Editor} from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";


export const Jobs_form = () => {
    const {t, i18n} = useTranslation("SL_languages");

    const [itDev, setItDev] = useState(true);
    const [projMn, setProjMn] = useState(false);
    const [archiTc, setArchiTc] = useState(false);
    const [fulTime, setFulTime] = useState(true);
    const [partTime, setPartTime] = useState(false);
    const [proj, setProj] = useState(false);

    const [jobTextHtml, setJobTextHtml] = useState(null);

    const [selectedDate, setSelectedDate] = useState(null);
    const [address, setAddress] = useState(null);


    const [imgToUse, setImgToUse] = useState(itDevImg);

    const [mustStay, setMustStay] = useState(false);

    const sizeHW = useWindowSize();
    const location = useLocation();
    const history = useHistory();
    const inputRef = useRef();
    let shouldPrompt = false;


    //////////date picker /////////////////
    const onDateChange = (moment) => {
        let day = moment.format('D');
        let month = moment.format('M');
        let year = moment.format('YYYY');
        setSelectedDate([day, month, year])
    };
    const onOpenChange = status => {
        if (status) {
            setTimeout(() => {
                document.querySelector(".ant-calendar-input").readOnly = status;
            }, 0);
        }
    };
    ///////////////////////////////////

    const handleButton = (actionType) => {
        if (actionType === "cancel") {
            if (window.confirm(t("jform.resetok"))) {
                localStorage.removeItem("tmpState");
                localStorage.removeItem("tempFormData");
                window.location.reload(false); // true = complete from the server, not from cached!.
            }
        } else if (actionType === "post") {
            let jobTypAndContractType = [itDev, projMn, archiTc, fulTime, partTime, proj];
            console.log("////: ", jobTypAndContractType, " ", jobTextHtml);
        }
    }

    //used by WYSIWYG through prop to pass here the data.
    const handleWYSIWYG = (editorState) => {
        setJobTextHtml(convertToRaw(editorState.getCurrentContent()));
    }

    useEffect(() => {
        try {
            let savedChecksEtc = JSON.parse(localStorage.getItem("tmpState"));
            if (savedChecksEtc) {
                setItDev(savedChecksEtc[0]);
                setProjMn(savedChecksEtc[1]);
                setArchiTc(savedChecksEtc[2]);
                setFulTime(savedChecksEtc[3]);
                setPartTime(savedChecksEtc[4]);
                setProj(savedChecksEtc[5]);
                setAddress(savedChecksEtc[6]);
                // inputRef.current.value = savedChecksEtc[6];
                setImgToUse(savedChecksEtc[8]);
            }
        } catch (e) {
            console.log("////:error at local storage!", e);
        }
    }, [/*input*/]);

    useEffect(() => {
        //effect
        //save state to ls on unmount!
        saveTempDataToLocalStorage();
        return () => {
        }
    }, [itDev, projMn, archiTc, fulTime, partTime, proj, address, selectedDate]);

    const saveTempDataToLocalStorage = () => {
        //then save to local storage
        try {
            let states = JSON.stringify([itDev, projMn, archiTc, fulTime, partTime, proj, address, selectedDate, imgToUse]);
            localStorage.setItem("tmpState", states);
        } catch (e) {
            console.log("////: could't write to local storage! ", e);
            shouldPrompt = true;
        }
    }

    return (
        <main className={"jobs_form_main"}>
            <Prompt when={shouldPrompt} message={t("jform.touchedInfo")}/>
            <div className={"jobs_form_bgi"}/>
            <div className={"form_wrapper row"}>
                <div className={"editor_form_left col-sm-12 col-xl-8"}>
                    <TextEditorWYSIWYG promptMsg={t("jform.touchedInfo")} setFormData={handleWYSIWYG}/>
                </div>
                {/*////////////////////////////Right side control panel/////////////////////*/}
                <div className={"editor_form_right col-sm-12 col-xl-4 order-lg-last"}>
                    <div className={"ed_f_r_top row py-3 "}>
                        <div className={"col-lg-6"}>
                            <strong style={{color: "#248c9d"}}>{t("jform.jobType")}</strong>
                            <div className={"col py-1 mt-2"}>
                                <input checked={itDev} className="form-check-input" type="checkbox" value=""
                                       onChange={(e) => {
                                           if (!itDev) {
                                               setItDev(e.target.checked);
                                               setProjMn(false);
                                               setArchiTc(false);
                                               setImgToUse(itDevImg);
                                           }
                                       }}/>
                                <label className="form-check-label px-2" htmlFor="flexCheckDefault">
                                    {t("jform.itdev")}
                                </label>
                            </div>
                            <div className={"col py-1"}>
                                <input checked={projMn} className="form-check-input" type="checkbox" value=""
                                       onChange={(e) => {
                                           if (!projMn) {
                                               setProjMn(e.target.checked);
                                               setItDev(false);
                                               setArchiTc(false);
                                               setImgToUse(projMngrImg);
                                           }
                                       }}/>
                                <label className="form-check-label px-2" htmlFor="flexCheckDefault">
                                    {t("jform.projM")}
                                </label>
                            </div>
                            <div className={"col py-1"}>
                                <input checked={archiTc} className="form-check-input" type="checkbox" value=""
                                       onChange={(e) => {
                                           if (!archiTc) {
                                               setArchiTc(e.target.checked);
                                               setItDev(false);
                                               setProjMn(false);
                                               setImgToUse(archiTkImg);
                                           }
                                       }}/>
                                <label className="form-check-label px-2" htmlFor="flexCheckDefault">
                                    {t("jform.arch")}
                                </label>
                            </div>
                        </div>
                        {/*/////checkBoxes right////////////*/}
                        <div className={"col-lg-6"}>
                            <strong style={{color: "#248c9d"}}>{t("jform.conType")}</strong>
                            <div className={"col py-1 mt-2"}>
                                <input checked={fulTime} className="form-check-input" type="checkbox" value=""
                                       onChange={(e) => {
                                           if (!fulTime) {
                                               setFulTime(e.target.checked);
                                               setPartTime(false);
                                               setProj(false);
                                           }

                                       }}/>
                                <label className="form-check-label px-2" htmlFor="flexCheckDefault">
                                    {t("jform.fultime")}
                                </label>
                            </div>
                            <div className={"col py-1"}>
                                <input checked={partTime} className="form-check-input" type="checkbox" value=""
                                       onChange={(e) => {
                                           if (!partTime) {
                                               setPartTime(e.target.checked);
                                               setFulTime(false);
                                               setProj(false);
                                           }
                                       }}/>
                                <label className="form-check-label px-2" htmlFor="flexCheckDefault">
                                    {t("jform.pt")}
                                </label>
                            </div>
                            <div className={"col py-1"}>
                                <input checked={proj} className="form-check-input" type="checkbox" value=""
                                       onChange={(e) => {
                                           if (!proj) {
                                               setProj(e.target.checked);
                                               setFulTime(false);
                                               setPartTime(false);
                                           }
                                       }}/>
                                <label className="form-check-label px-2" htmlFor="flexCheckDefault">
                                    {t("jform.project")}
                                </label>
                            </div>
                        </div>
                        <div className={"col mt-2"}>
                            <img src={imgToUse} className="job_view_cards_img_self" alt="..."/>
                        </div>
                        <div className={"infoDiv my-5"}>
                            {/*<div className={"input_wrappers workPlace my-2"}>*/}
                            {/*    <strong style={{color: "#248c9d"}}>Workplace address</strong>*/}
                            {/*    <input name={"workPlaceAddress"}*/}
                            {/*           type="text"*/}
                            {/*           ref={inputRef}*/}
                            {/*           onChange={(e) => {*/}
                            {/*               setAddress(e.target.value);*/}
                            {/*           }}*/}
                            {/*           className="form-control input_address mt-2"*/}
                            {/*           placeholder={"Workplace address"}/>*/}
                            {/*</div>*/}
                            {/*<strong style={{color: "#248c9d"}}>{t("jform.dld")}</strong>*/}
                            {/*<DatePicker*/}
                            {/*    className={"mt-2"}*/}
                            {/*    format={"DD-MM-YYYY"}*/}
                            {/*    placeholder={t("jform.dld")}*/}
                            {/*    style={{*/}
                            {/*        width: "100%",*/}
                            {/*        height: "40px",*/}
                            {/*        borderRadius: "4px"*/}
                            {/*    }}*/}
                            {/*    onChange={(e) => {*/}
                            {/*        onDateChange(e);*/}
                            {/*    }}*/}
                            {/*    // onOpenChange={onOpenChange}*/}
                            {/*/>*/}
                            <div className="btn-group mt-3" role="group" aria-label="Basic mixed styles example">
                                <button onClick={() => {
                                    handleButton("cancel");
                                }} type="button" className="btn btn-danger">{t("jform.reset")}
                                </button>
                                {/*<button onClick={() => handleButton} type="button" className="btn btn-warning">View</button>*/}
                                <button onClick={() => {
                                    handleButton("post");
                                }} type="button" className="btn btn-success">{t("jform.post")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
