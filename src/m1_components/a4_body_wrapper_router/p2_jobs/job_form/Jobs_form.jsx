import React, {useEffect, useState} from "react";
import "./Jobs_form.scss";
import {useTranslation} from "react-i18next/src";

import {useWindowSize} from "../../../../UI_Main_pages_wrapper";
import {UI_logo_with_image} from "../../../a2_logo_with_image/UI_logo_with_image";
import TextEditorWYSIWYG from "../../../a0_shared_all/wysiwyg/TextEditorWYSIWYG";
// import {TextEditorWYSIWYG} from "../../../a0_shared_all/wysiwyg/TextEditorWYSIWYG";
import projMngrImg from "../../../../resources/images/project-manager.jpg";
import itDevImg from "../../../../resources/images/developer.png";
import archiTkImg from "../../../../resources/images/architect.jpg";

////////date picker///////////////

import "antd/dist/antd.css";
import DateInput from "../../../a0_shared_all/date_input/DateInput";
import DatePicker from "antd/es/date-picker";


export const Jobs_form = () => {
    const {t, i18n} = useTranslation("SL_languages");

    const [itDev, setItDev] = useState(true);
    const [projMn, setProjMn] = useState(false);
    const [archiTc, setArchiTc] = useState(false);
    const [fulTime, setFulTime] = useState(true);
    const [partTime, setPartTime] = useState(false);
    const [proj, setProj] = useState(false);


    const [imgToUse, setImgToUse] = useState(itDevImg);

    const sizeHW = useWindowSize();

    useEffect(() => {
        return () => {
            //cleanup
        }
    }, [itDev, projMn, archiTc]);


    //////////date picker /////////////////
    const onDateChange = (inOnChange) => {
        console.log(inOnChange._d);
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
            console.log("////: cancel!");
        } else if (actionType === "post") {
            console.log("////: post!");
        }
    }


    return (
        <main className={"jobs_form_main"}>
            <div className={"jobs_form_bgi"}/>
            <div className={"form_wrapper row"}>
                <div className={"editor_form_left col-sm-12 col-xl-8"}>
                    <TextEditorWYSIWYG/>
                </div>
                {/*////////////////////////////Right side control panel/////////////////////*/}
                <div className={"editor_form_right col-sm-12 col-xl-4 order-lg-last"}>
                    <div className={"ed_f_r_top row py-3 "}>
                        <div className={"col-lg-6"}>
                            <strong style={{color: "#248c9d"}}>Job type</strong>
                            <div className={"col py-1 mt-2"}>
                                <input checked={itDev} className="form-check-input" type="checkbox" value=""
                                       id="flexCheckDefault" onChange={(e) => {
                                    if (!itDev) {
                                        setItDev(e.target.checked);
                                        setProjMn(false);
                                        setArchiTc(false);
                                        setImgToUse(itDevImg);
                                    }
                                }}/>
                                <label className="form-check-label px-2" htmlFor="flexCheckDefault">
                                    IT Developer
                                </label>
                            </div>
                            <div className={"col py-1"}>
                                <input checked={projMn} className="form-check-input" type="checkbox" value=""
                                       id="flexCheckDefault" onChange={(e) => {
                                    if (!projMn) {
                                        setProjMn(e.target.checked);
                                        setItDev(false);
                                        setArchiTc(false);
                                        setImgToUse(projMngrImg);
                                    }
                                }}/>
                                <label className="form-check-label px-2" htmlFor="flexCheckDefault">
                                    Project manager
                                </label>
                            </div>
                            <div className={"col py-1"}>
                                <input checked={archiTc} className="form-check-input" type="checkbox" value=""
                                       id="flexCheckDefault" onChange={(e) => {
                                    if (!archiTc) {
                                        setArchiTc(e.target.checked);
                                        setItDev(false);
                                        setProjMn(false);
                                        setImgToUse(archiTkImg);
                                    }
                                }}/>
                                <label className="form-check-label px-2" htmlFor="flexCheckDefault">
                                    Architect
                                </label>
                            </div>
                        </div>
                        {/*/////checkBoxes right////////////*/}
                        <div className={"col-lg-6"}>
                            <strong style={{color: "#248c9d"}}>Contract type</strong>
                            <div className={"col py-1 mt-2"}>
                                <input checked={fulTime} className="form-check-input" type="checkbox" value=""
                                       id="flexCheckDefault" onChange={(e) => {
                                    if (!fulTime) {
                                        setFulTime(e.target.checked);
                                        setPartTime(false);
                                        setProj(false);
                                    }

                                }}/>
                                <label className="form-check-label px-2" htmlFor="flexCheckDefault">
                                    Full time
                                </label>
                            </div>
                            <div className={"col py-1"}>
                                <input checked={partTime} className="form-check-input" type="checkbox" value=""
                                       id="flexCheckDefault" onChange={(e) => {
                                    if (!partTime) {
                                        setPartTime(e.target.checked);
                                        setFulTime(false);
                                        setProj(false);
                                    }
                                }}/>
                                <label className="form-check-label px-2" htmlFor="flexCheckDefault">
                                    Part time
                                </label>
                            </div>
                            <div className={"col py-1"}>
                                <input checked={proj} className="form-check-input" type="checkbox" value=""
                                       id="flexCheckDefault" onChange={(e) => {
                                    if (!proj) {
                                        setProj(e.target.checked);
                                        setFulTime(false);
                                        setPartTime(false);
                                    }
                                }}/>
                                <label className="form-check-label px-2" htmlFor="flexCheckDefault">
                                    Project
                                </label>
                            </div>
                        </div>
                        <div className={"col mt-2"}>
                            <img src={imgToUse} className="job_view_cards_img_self" alt="..."/>
                        </div>
                        <div className={"infoDiv my-5"}>
                            <div className={"input_wrappers workPlace my-2"}>
                                <strong style={{color: "#248c9d"}}>Workplace address</strong>
                                <input name={"workPlaceAddress"}
                                       type="text"
                                       className="form-control input_address mt-2"
                                       placeholder={"Workplace address"}/>
                            </div>
                            <strong style={{color: "#248c9d"}}>Deadline date</strong>
                            <DatePicker
                                className={"mt-2"}
                                placeholder={"Deadline date"}
                                style={{
                                    width: "100%",
                                    height: "40px",
                                    borderRadius: "4px"
                                }}
                                onChange={(e) => {
                                    onDateChange(e);
                                }}
                                customInput={<DateInput/>}
                                // onOpenChange={onOpenChange}
                            />
                            <div className="btn-group mt-3" role="group" aria-label="Basic mixed styles example">
                                <button onClick={() => {
                                    handleButton("cancel");
                                }} type="button" className="btn btn-danger">Cancel
                                </button>
                                {/*<button onClick={() => handleButton} type="button" className="btn btn-warning">View</button>*/}
                                <button onClick={() => {
                                    handleButton("post");
                                }} type="button" className="btn btn-success">Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
