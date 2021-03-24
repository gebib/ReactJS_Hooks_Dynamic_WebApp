import React, {useState} from "react";
import "./ST_leie.scss";
import {useTranslation} from "react-i18next";
import leie from "../../../../resources/images/leie.webp";
import {UI_carousel} from "../reviewCarousel/UI_carousel";
import {Link} from "react-router-dom";

export const UI_leie = () => {
    const {t, i18n} = useTranslation("SL_languages");

    return (
        <main className="leie_mainContainerHome container-12 px-5 leie_mc1">
            <div className={"leie_innerContainer"}>
                <figure className={"karianneImgWrap"}>
                    <img style={{borderRight: "1px solid #151515", borderTop: "2px solid #151515"}}
                         src={leie}
                         alt={"article image"}/>
                </figure>
                <article>
                    <section className={"row leie_section_with_images "}>
                    </section>
                    <section className={"row-12"}>
                        <header className={"leie_wecome_header py-3"}>
                            <h3>{t("le.lh3h1")}</h3>
                            <h3>{t("le.lh3h2")}</h3>
                        </header>
                        <div className={"textDivMainWraper"}>
                            <div className={"vbTextDiv"}>
                                <h5 className={"vbTextDiv"}>{t("le.h4h3")}</h5>
                                <p>{t("le.lep1")}</p>
                                <p>{t("le.lep2")}</p>
                                <p>{t("le.lep3")}</p>


                                <h5>{t("le.h4h4")}</h5>
                                <p>{t("le.lep4")}</p>
                                <p>{t("le.lep5a")}
                                <Link className={"homeLinks"}
                                    style={{
                                        textDecoration: 'none',
                                        // border: "1px solid #248C9D",
                                        paddingRight: "10px",
                                        paddingLeft: "10px",
                                        borderRadius: "6px",
                                        color: "#248C9D"
                                    }}
                                      to={"/home/own"}>{t("le.eie")}</Link>{t("le.lep5b")}</p>
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
