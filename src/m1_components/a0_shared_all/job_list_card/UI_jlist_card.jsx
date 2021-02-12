import React, {useState} from "react";
import {IconContext} from "react-icons";
import {GoTriangleRight} from "react-icons/go";

import {MdWork} from "react-icons/md";

import "./ST_jlist_card.scss";
import devImg from "../../../resources/images/developer.png";
import archiImg from "../../../resources/images/architect.jpg";
import projMngr from "../../../resources/images/project-manager.jpg";


export const UI_jlist_card = () => {
    return (
        <div className={"col bmain"}>
            <section className={"col2 col"}>
                <header className={"top_bar_list row py-3"}>
                    {/*take up 6 for lg else 8 for md*/}
                    <div className={"job_icon_div d-none d-sm-block"}>
                        <img src={projMngr} className="job_cards_img_self" alt="..."/>
                    </div>
                    <div className={"job_names_list col"}>
                        <div className={"icon_div_list"}>
                            <div>
                                <div className={"job_text"}>
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
                    <div className={"type_tag_list d-none d-lg-block col-2"}>
                        <div className={"job_text"}>
                            Ful-time
                        </div>
                        <div className={"job_text"}>
                            <span style={{fontWeight: "600", color: "#bababa"}}>in</span> Bergen
                        </div>
                    </div>
                    <div className={"type_tag_list d-none d-md-block col-2 d-flex justify-content-center"}>
                        <div className={"wortby_wrap"}>
                            <div className={"list_header_textDiv"}>Project Manager</div>
                        </div>
                    </div>
                    {/*/////////////////////hide for any < xl = 1200px*/}
                    <div className={"type_tag_list col-1 d-none d-sm-block"}>
                        <div className={"list_header_textDiv"}>
                            <IconContext.Provider value={{size: "2em"}}>
                                <GoTriangleRight style={{marginLeft: "10px", color: "#248C9D"}}/>
                            </IconContext.Provider>
                        </div>
                    </div>
                </header>
            </section>
        </div>
    );
}
