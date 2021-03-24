import React, {useState} from "react";
import "./ST_ServiceContent.scss";
import apply from "../../../resources/images/apply.png";
import {Link} from "react-router-dom";
import sl3 from "../../../resources/images/sl3.png";
import sl4 from "../../../resources/images/sl4.webp";
import sl5 from "../../../resources/images/sl5.webp";
import {UI_PullCards} from "../p1_home/pullcards/UI_PullCards";
import {useTranslation} from "react-i18next";
import {IconContext} from "react-icons";
import {FaArrowRight} from "react-icons/fa";
import {UI_carousel} from "../p1_home/reviewCarousel/UI_carousel";


export const UI_ServiceContent = () => {
    const {t, i18n} = useTranslation("SL_languages");

    return (
        <main className="mainContainerHome container-12 px-5 srv_mc1">
            <div className={"srv_innerContainer"}>
                <article>
                    <section className={"row-12"}>
                        <header className={"srv_wecome_header py-3 mt-5"}>
                            <h3>{t("srv.h3a")}</h3>
                            <h3>{t("srv.h3b")}</h3>
                        </header>
                        <div className="row-12 ">
                            <p>{t("srv.p1")}</p>
                            <p>{t("srv.p2")}</p>
                            <p>{t("srv.p3")}</p>
                        </div>
                    </section>

                    <section className={"row srv_section_with_images "}>
                        <div className={"col-lg-6 srv_img_with_text px-0"}>
                            <figure>
                                <img style={{borderRight: "1px solid #151515", borderTop: "2px solid #151515"}}
                                     src={sl4}
                                     alt={"article image"}/>
                            </figure>
                            <div>
                                <div className={"blackBottomLeft srv_img_txt_header px-3"}>
                                    <div><h3 style={{color: "white", marginTop: "20px"}}>{t("srv.lh3l1")}</h3></div>
                                    <div><h3 style={{color: "white"}}>{t("srv.lh3l2")}</h3></div>
                                    <div className={"weHaveLexp"}>
                                        <p style={{
                                            color: "white",
                                            marginTop: "20px",
                                            maxWidth: "250px",
                                            textAlign: "center"
                                        }}>{t("srv.rp1")}</p>
                                        <button onClick={() => {
                                            //TODO/////////////////////////////////////////////////////////////////////////////////
                                        }} className={" btn btn-dark readMoreCardBtn"} style={{minWidth:"100%"}}>
                                            <IconContext.Provider value={{size: "1em"}}>
                                                <div className={"cards_btn"} onClick={() => {
                                                }}>{t("home.read_btn")}< FaArrowRight
                                                    style={{color: "#ffffff"}}/>
                                                </div>
                                            </IconContext.Provider>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"col-lg-6 srv_img_with_text px-0"}>
                            <div className={"blackBottomLeft srv_img_txt_header px-3"}>
                                <div><h3 style={{color: "white", marginTop: "20px"}}>{t("srv.rh3l1")}</h3></div>
                                <div><h3 style={{color: "white"}}>{t("srv.rh3l2")}</h3></div>
                                <div className={"weHaveLexp"}>
                                    <p style={{
                                        color: "white",
                                        marginTop: "20px",
                                        maxWidth: "250px",
                                        textAlign: "center"
                                    }}>{t("srv.rp1")}</p>
                                    <button onClick={() => {
                                            //TODO/////////////////////////////////////////////////////////////////////////////////
                                    }} className={" btn btn-dark readMoreCardBtn"} style={{minWidth:"100%"}}>
                                        <IconContext.Provider value={{size: "1em"}}>
                                            <div className={"cards_btn"} onClick={() => {
                                            }}>{t("home.read_btn")}< FaArrowRight
                                                style={{color: "#ffffff"}}/>
                                            </div>
                                        </IconContext.Provider>
                                    </button>
                                </div>
                            </div>
                            <figure>
                                <img style={{borderRight: "1px solid #151515", borderTop: "2px solid #151515"}}
                                     src={sl5}
                                     alt={"article image"}/>
                            </figure>
                        </div>
                    </section>
                </article>
                <hr/>
                <UI_carousel/>
            </div>
        </main>
    );
};
