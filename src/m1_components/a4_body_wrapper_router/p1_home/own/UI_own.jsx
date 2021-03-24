import React, {useState} from "react";
import "./ST_own.scss";
import {useTranslation} from "react-i18next";
import cv from "../../../../resources/images/cv.jpg";
import {UI_carousel} from "../reviewCarousel/UI_carousel";
import {Link} from "react-router-dom";

export const UI_recruitment = () => {
    const {t, i18n} = useTranslation("SL_languages");

    return (
        <main className="vbs_mainContainerHome container-12 px-5 vbs_mc1">
            <div className={"vbs_innerContainer"}>
                <article>
                    <section className={"row vbs_section_with_images "}>
                        <figure className={"karianneImgWrap"}>
                            <img style={{borderRight: "1px solid #151515", borderTop: "2px solid #151515"}}
                                 src={cv}
                                 alt={"article image"}/>
                        </figure>
                    </section>
                    <section className={"row-12"}>
                        <header className={"vbs_wecome_header py-3"}>
                            <h3>{t("recruitment.h3h1")}</h3>
                            <h3>{t("recruitment.h3h2")}</h3>
                        </header>
                        <div className={"ownWraper"}>
                            <div className={"vbTextDiv"}>
                                <p>{t("recruitment.rcp1")}</p>
                                <p>{t("recruitment.rcp2")}</p>

                                <p>- {t("recruitment.rcp3")}</p>
                                <p>- {t("recruitment.rcp4")}</p>
                                <p>- {t("recruitment.rcp5")}</p>
                                <p>- {t("recruitment.rcp6")}</p>

                                <h4>{t("recruitment.h3h3")}</h4>

                                <p>{t("recruitment.rcp7")}</p>
                                <p>{t("recruitment.rcp8")}
                                    <Link className={"homeLinks"}
                                          style={{
                                              textDecoration: 'none',
                                              // border: "1px solid #248C9D",
                                              paddingRight: "10px",
                                              paddingLeft: "10px",
                                              borderRadius: "6px",
                                              color: "#248C9D"
                                          }}
                                          to={"/home/rent"}>{t("le.leie")}</Link>{t("recruitment.rcp9")}
                                </p>
                            </div>
                        </div>
                        <hr/>
                        <UI_carousel/>
                    </section>
                </article>
            </div>
        </main>
    );
};
