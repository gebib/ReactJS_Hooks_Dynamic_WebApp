import React, {useEffect, useState} from "react";
import {IconContext} from "react-icons";
import {GoTriangleRight} from "react-icons/go";

import {BsBoxArrowUpRight} from "react-icons/bs";

import devImg from "../../../resources/images/developer.png";
import archiImg from "../../../resources/images/architect.jpg";
import projMngr from "../../../resources/images/project-manager.jpg";
import {useHistory} from "react-router-dom";
import jlcStyle from "./ST_jlist_card.module.scss";
import styled from "styled-components";
import {useTranslation} from "react-i18next";

export const UI_jlist_card = (props) => {
    const history = useHistory();
    const {t, i18n} = useTranslation("SL_languages");

    const [aJobData, setAJobData] = useState(null);
    const [imgToUse, setImgToUse] = useState(null);
    const [jobType, setJobType] = useState(null);
    const [contractType, setContractType] = useState(null);
    const [title, setTitle] = useState(null);

    useEffect(() => {
        let jd = props.aJobData;
        if (jd.jobTypeAndContAr[0]) {
            setJobType("itdev");
            setImgToUse(devImg);
        } else if (jd.jobTypeAndContAr[1]) {
            setJobType("projM");
            setImgToUse(projMngr);
        } else if (jd.jobTypeAndContAr[2]) {
            setJobType("arch");
            setImgToUse(archiImg);
        }
        /////////////contract type
        if (jd.jobTypeAndContAr[3]) {
            setContractType("ft")
        } else if (jd.jobTypeAndContAr[4]) {
            setContractType("pt")
        } else if (jd.jobTypeAndContAr[5]) {
            setContractType("pr");
        }
        //shorten title if it is too long! max 100 cha, just to limit.
        if (jd.jobTxtRawTableData[0].text.length > 100) {
            setTitle(jd.jobTxtRawTableData[0].text.substring(0, 90) + ". . .");
        } else {
            setTitle(jd.jobTxtRawTableData[0].text);
        }
        setAJobData(jd);

        return () => {
            //cleanup
        }
    }, [/*for update on change*/]);

    return (
        <div className={"col bmain"} onClick={() => {
            console.log("////: ", aJobData.snKey);
            history.push("jobs/jobview/" + aJobData.snKey);
        }}>
            <section className={"col2 col"}>
                <header className={jlcStyle.top_bar_list + " row py-3"}>
                    {/*take up 6 for lg else 8 for md*/}
                    <div className={jlcStyle.job_icon_div + " d-none d-sm-block"}>
                        <img src={imgToUse} className={jlcStyle.job_cards_img_self} alt="job type avatar"/>
                    </div>
                    <div className={jlcStyle.job_names_list + " col"}>
                        <div className={jlcStyle.title}>
                            {/*should receive no more than this much text!*/}
                            {title}
                        </div>
                        <div className={jlcStyle.footerTxt}>
                            <span className={jlcStyle.published}>Published: 01.02.2021</span> |
                            <span className={jlcStyle.deadline}>Deadline: 01.05.2021</span>
                        </div>
                    </div>
                    <div className={jlcStyle.type_tag_list + "  d-none d-lg-block col-2"}>
                        <div hidden={(contractType !== "ft")} className={jlcStyle.job_text}>{t("jform.fultime")}</div>
                        <div hidden={(contractType !== "pt")} className={jlcStyle.job_text}>{t("jform.pt")}</div>
                        <div hidden={(contractType !== "pr")} className={jlcStyle.job_text}>{t("jform.project")}</div>
                        <div className={jlcStyle.job_text}>
                            <span style={{fontWeight: "600", color: "#bababa"}}>in</span> <span
                            style={{color: "#E34934"}}>Bergen</span>
                        </div>
                    </div>
                    <div className={jlcStyle.type_tag_list + "  d-none d-md-block col-2 "}>
                        <div className={"wortby_wrap"}>
                            <div hidden={(jobType !== "itdev")}
                                 className={jlcStyle.job_text + " list_header_textDiv"}>{t("jform.itdev")}</div>
                            <div hidden={(jobType !== "projM")}
                                 className={jlcStyle.job_text + " list_header_textDiv"}>{t("jform.projM")}</div>
                            <div hidden={(jobType !== "arch")}
                                 className={jlcStyle.job_text + " list_header_textDiv"}>{t("jform.arch")}</div>
                        </div>
                    </div>
                    {/*/////////////////////hide for any < xl = 1200px*/}
                    <div className={"  col-1 d-none d-sm-block"}>
                        <div className={"list_header_textDiv"}>
                            <IconContext.Provider value={{size: "2em"}}>
                                <BsBoxArrowUpRight style={{color: "#248C9D"}}/>
                            </IconContext.Provider>
                        </div>
                    </div>
                </header>
            </section>
        </div>
    );
}
