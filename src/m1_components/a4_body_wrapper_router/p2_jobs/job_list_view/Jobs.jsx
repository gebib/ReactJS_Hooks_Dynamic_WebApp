import React, {useState} from "react";
import "./Jobs.scss";
import {useTranslation} from "react-i18next";
import {IconContext} from "react-icons";
import {MdWork} from "react-icons/md";
import {RiArrowDownSLine} from "react-icons/ri";
import {FaMapMarkerAlt} from "react-icons/fa";
import {GrStatusGoodSmall} from "react-icons/gr";
import {UI_jlist_card} from "../../../a0_shared_all/job_list_card/UI_jlist_card";
import Dropdown from "react-bootstrap/Dropdown";
import SelectSearch from 'react-select-search';
import {UI_drop_down} from "../../../a0_shared_all/drop_down/UI_drop_down";


export const JobsContent = () => {
    const {t, i18n} = useTranslation("SL_languages");

    return (
        <main className={"container jobs_list_main_wrapper "}>
            <header className={"jobs_header col-12 d-flex justify-content-center py-5"}
                    style={{fontWeight: "600", color: "#151515"}}>
                <h3 style={{fontWeight: "400"}}>{t("jobs.t1")}</h3>
            </header>

            <section className={"row asidePmainRow d-flex justify-content-center"}>

                <div className={"asideRow_wrapper col-xl-3 mx-1 py-2"}>
                    <div className={"row asideRow "}>

                        <div className={"as1  col-xl-12 col-md-6 col-sm-12 "}>
                            <p style={{fontWeight: "600", color: "#248c9d"}}>Job types</p>
                            <ul>
                                <li>
                                    <div className="form-check my-2">
                                        <input className="form-check-input" type="checkbox" value=""
                                               id="flexCheckDefault"/>
                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                            IT Developer
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check my-2">
                                        <input className="form-check-input" type="checkbox" value=""
                                               id="flexCheckDefault"/>
                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                            Project manager
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check my-2">
                                        <input className="form-check-input" type="checkbox" value=""
                                               id="flexCheckDefault"/>
                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                            Architect
                                        </label>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className={"as2 col-xl-12 col-md-6 col-sm-12 "}>
                            <p style={{fontWeight: "600", color: "#248c9d"}}>Work hours</p>
                            <ul>
                                <li>
                                    <div className="form-check my-2">
                                        <input className="form-check-input" type="checkbox" value=""
                                               id="flexCheckDefault"/>
                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                            Ful time
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check my-2">
                                        <input className="form-check-input" type="checkbox" value=""
                                               id="flexCheckDefault"/>
                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                            Part time
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check my-2">
                                        <input className="form-check-input" type="checkbox" value=""
                                               id="flexCheckDefault"/>
                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                            Project
                                        </label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={"col bmain"}>
                    <section className={"col2 col"}>
                        <header className={"top_bar row "}>
                            {/*take up 6 for lg else 8 for md*/}
                            <div className={"job_names col"}>
                                <div className={"icon_div"}>
                                    <IconContext.Provider value={{size: "1.5em"}}>
                                        <MdWork className={"d-none d-lg-block"}
                                                style={{marginLeft: "10px", color: "#248c9d"}}/>
                                    </IconContext.Provider>
                                    <div>
                                        <div className={"list_header_textDiv"} style={{color: "#ffffff"}}>
                                            Available job positions
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"type_tag d-none d-lg-block col-2"}>
                                <IconContext.Provider value={{size: "1.5em"}}>
                                    <FaMapMarkerAlt style={{marginLeft: "10px", color: "#E34934"}}/>
                                </IconContext.Provider>
                            </div>
                            <div className={"type_tag d-none d-md-block col-2 d-flex justify-content-center"}>
                                {/*<div className={"wortby_wrap"}>*/}
                                {/*    <div className={"list_header_textDiv"}>Sort by:</div>*/}
                                {/*    <IconContext.Provider value={{size: "1.5em"}}>*/}
                                {/*        <RiArrowDownSLine style={{marginLeft: "10px", color: "#000000"}}/>*/}
                                {/*    </IconContext.Provider>*/}
                                {/*</div>*/}
                                <UI_drop_down/>

                            </div>
                            {/*/////////////////////hide for any < xl = 1200px*/}
                            <div className={"type_tag col-1 d-none d-sm-block"}>
                                <div className={"list_header_textDiv"} style={{color: "#ffffff"}}>
                                </div>
                            </div>
                        </header>
                    </section>
                    {/*//////////////job entry list cards*/}
                    <UI_jlist_card/>
                    <UI_jlist_card/>
                    <UI_jlist_card/>
                    <UI_jlist_card/>
                    <UI_jlist_card/>
                    <UI_jlist_card/>
                    <UI_jlist_card/>
                    <UI_jlist_card/>
                    <UI_jlist_card/>
                    <UI_jlist_card/>
                    <UI_jlist_card/>
                    <UI_jlist_card/>
                    <UI_jlist_card/>
                    <UI_jlist_card/>
                    <UI_jlist_card/>


                </div>


            </section>

        </main>
    );
}
