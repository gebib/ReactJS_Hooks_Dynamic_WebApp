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

// const JobCardStyle = styled.div
//     `
//     height: 50px;
//     width: 100%;
//     background-color: green;
//     font-size: 20px;
//     color: white;
//     display: flex;
//     justify-content: center;
//     align-items: center;`

//styled Component way!

export const UI_jlist_card = (props) => {
    const history = useHistory();

    const [aJobData, setAJobData] = useState(null);

    const prepareAjobDataForRender = (jd) => {
        let imgToUse = null;
        let title = null;
        let published = null;
        let deadline = null;
        let contractType = null;
        let city = null;
        let jobType = null;


        if (jd.jobTypeAndContAr[0]) {
            jobType = "it";
            imgToUse = devImg;
        } else if (jd.jobTypeAndContAr[1]) {
            jobType = "pm";
            imgToUse = projMngr;
        } else if (jd.jobTypeAndContAr[2]) {
            jobType = "ar";
            imgToUse = archiImg;
        }

        if (jd.jobTypeAndContAr[3]) {
            contractType = "ft";
        } else if (jd.jobTypeAndContAr[4]) {
            jobType = "pm";
        } else if (jd.jobTypeAndContAr[5]) {
            jobType = "ar";
        }

        title = jd.jobTxtRawTableData[0].text;


        // console.log("////: ", title);


        // setAJobData(
        //     [
        //         imgToUse,
        //         title,
        //         published,
        //         deadline,
        //         contractType,
        //         city,
        //         jobType
        //     ]);
    }


    useEffect(() => {
        prepareAjobDataForRender(props.aJobData);
        return () => {
            //cleanup
        }
    }, [/*for update on change*/]);

    return (
        <div className={"col bmain"} onClick={() => {
            history.push("jobs/jobview/123");
        }}>
            <section className={"col2 col"}>
                {/*<JobCardStyle>*/}
                {/*    ok!*/}
                {/*</JobCardStyle>*/}
                <header className={jlcStyle.top_bar_list + " row py-3"}>
                    {/*take up 6 for lg else 8 for md*/}
                    <div className={jlcStyle.job_icon_div + " d-none d-sm-block"}>
                        <img src={projMngr} className={jlcStyle.job_cards_img_self} alt="..."/>
                    </div>
                    <div className={jlcStyle.job_names_list + " col"}>
                        <div className={jlcStyle.icon_div_list}>
                            <div>
                                <div className={jlcStyle.job_text}>
                                    {/*should receive no more than this much text!*/}
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                    <div style={{
                                        fontWeight: "600",
                                        color: "#bababa",
                                        marginTop: "10px",
                                        fontSize: "13px"
                                    }}>
                                        <span style={{marginRight: "10px"}}>Published: 01.02.2021</span> | <span
                                        style={{marginLeft: "10px"}}>Published: 01.05.2021</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={jlcStyle.type_tag_list + "  d-none d-lg-block col-2"}>
                        <div className={jlcStyle.job_text}>
                            Ful-time
                        </div>
                        <div className={jlcStyle.job_text}>
                            <span style={{fontWeight: "600", color: "#bababa"}}>in</span> <span style={{color: "#E34934"}}>Bergen</span>
                        </div>
                    </div>
                    <div className={jlcStyle.type_tag_list + "  d-none d-md-block col-2 "}>
                        <div className={"wortby_wrap"}>
                            <div className={jlcStyle.job_text + " list_header_textDiv"}>Project Manager</div>
                        </div>
                    </div>
                    {/*/////////////////////hide for any < xl = 1200px*/}
                    <div  className={ "  col-1 d-none d-sm-block"}>
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
