import React, {useState} from "react";
import "./HomeContent.scss";
import {useTranslation} from "react-i18next";
import apply from "../../../resources/images/apply.png";
import sl3 from "../../../resources/images/sl3.png";
import sl4 from "../../../resources/images/sl4.webp";
import sl5 from "../../../resources/images/sl5.webp";
import dw from "../../../resources/images/dont_worry.jpg";
import {Link} from "react-router-dom";
import {IconContext} from "react-icons";
import {FaArrowRight} from "react-icons/fa";
import {UI_PullCards} from "./pullcards/UI_PullCards";

export const HomeContent = () => {
    const {t, i18n} = useTranslation("SL_languages");
    return (
        <main className="mainContainerHome container-12 px-5 mc1">
            <div className={"innerContainer"}>
                <article>
                    <section className={"row-12"}>
                        <header className={"wecome_header py-3"}>
                            <h3>{t("home.t1")}</h3>
                        </header>
                        <div className="row-12 ">
                            <p>{t("home.p1")}</p>
                            <p>{t("home.p2")}</p>
                            <p>{t("home.p3")}</p>
                        </div>
                    </section>

                    <section className={"row section_with_images "}>
                        <div className={"col-lg-6 img_with_text px-0"}>
                            <figure>
                                <img style={{borderRight: "1px solid #151515", borderTop: "2px solid #151515"}}
                                     src={apply}
                                     alt={"article image"}/>
                            </figure>
                            <div>
                                <div className={"img_txt_header px-3"}>
                                    <div>
                                        <header>
                                            <h5>{t("home.t2")}</h5>
                                        </header>
                                        <div className={"x_p"}>
                                            <p style={{color: "#248C9D"}}>#</p>
                                            <p>{t("home.p4")}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={"d-flex justify-content-center"}>
                                    <p>{t("home.p5")}</p>
                                </div>
                                <p className={"px-3"}>{t("home.p6")}</p>
                                <p className={"px-3"}>{t("home.p7")}</p>
                                <p className={"px-3"}><Link
                                    className={"homeLinks"}
                                    style={{
                                        textDecoration: 'none',
                                        // border: "1px solid #248C9D",
                                        paddingRight: "10px",
                                        paddingLeft: "10px",
                                        borderRadius: "6px",
                                        fontWeight: "600",
                                        color: "#248C9D"
                                    }}
                                    to={"/home/wecare"}>{t("home.p8")}</Link></p>
                            </div>
                        </div>

                        <div className={"col-lg-6 img_with_text px-0"}>
                            <figure>
                                <img style={{borderLeft: "1px solid #151515", borderTop: "2px solid #151515"}} src={sl3}
                                     alt={"silverlining staffs image"}/>
                            </figure>
                            <div>
                                <div className={"img_txt_header px-3"}>
                                    <div>
                                        <header style={{textAlign: "center"}}>
                                            <h5>{t("home.t3")}</h5>
                                            <h5>{t("home.t4")}</h5>
                                        </header>
                                        <div className={"x_p d-flex justify-content-center"}>
                                            <p>{t("home.p9")}</p>
                                        </div>
                                    </div>
                                </div>
                                <p className={"px-3"}>{t("home.p10")}</p>
                                <p className={" px-3"}><Link
                                    className={"homeLinks"}
                                    style={{
                                        textDecoration: 'none',
                                        // border: "1px solid #248C9D",
                                        paddingRight: "10px",
                                        paddingLeft: "10px",
                                        borderRadius: "6px",
                                        fontWeight: "600",
                                        color: "#248C9D"
                                    }}
                                    to={"/home/own"}>{t("home.p8")}</Link></p>
                            </div>
                        </div>
                        <div className={"col-lg-6 img_with_text px-0"}>
                            <figure>
                                <img style={{borderRight: "1px solid #151515", borderTop: "2px solid #151515"}}
                                     src={sl4}
                                     alt={"article image"}/>
                            </figure>
                        </div>

                        <div className={"col-lg-6 img_with_text px-0"}>
                            <figure>
                                <img style={{borderLeft: "1px solid #151515", borderTop: "2px solid #151515"}} src={sl5}
                                     alt={"silverlining staffs image"}/>
                            </figure>
                        </div>
                        <p>{t("home.p11")}</p>
                        <p className={" px-3"}><Link
                            className={"homeLinks"}
                            style={{
                                textDecoration: 'none',
                                // border: "1px solid #248C9D",
                                paddingRight: "10px",
                                paddingLeft: "10px",
                                borderRadius: "6px",
                                fontWeight: "600",
                                color: "#248C9D"
                            }}
                            to={"/home/rent"}>{t("home.p8")}</Link></p>

                    </section>
                </article>
                <UI_PullCards getNewblog={null}/>
                <footer className={"google_map my-3"}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d2577.175644981354!2d5.340208183754848!3d60.37308703534332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sGREENHOUSE%20EDVARD%20GRIEGS%20VEI%203A%2C%205059!5e1!3m2!1sen!2sno!4v1612804445278!5m2!1sen!2sno"
                        width="100%" height="450" frameBorder="0" style={{border: "0"}} allowFullScreen=""
                        aria-hidden="false"
                        tabIndex="0"/>
                </footer>
                <section className={"can_w_h_you"}>
                    <>{t("home.p12")}</>
                    <br/> <>{t("home.p13")}</>
                </section>
            </div>
        </main>
    );
};
