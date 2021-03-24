import React, {useState} from "react";
import "./ST_vibryross.scss";
import {useTranslation} from "react-i18next";
import sl3v2 from "../../../../resources/images/sl3v2.PNG";
import {IconContext} from "react-icons";
import sl5 from "../../../../resources/images/sl5.webp";
import {UI_carousel} from "../reviewCarousel/UI_carousel";

export const UI_vibryross = () => {
    const {t, i18n} = useTranslation("SL_languages");

    return (
        <main className="vbs_mainContainerHome container-12 px-5 vbs_mc1">
            <div className={"vbs_innerContainer"}>
                <article>
                    <section className={"row vbs_section_with_images "}>
                        <figure className={"karianneImgWrap"}>
                            <img style={{borderRight: "1px solid #151515", borderTop: "2px solid #151515"}}
                                 src={sl3v2}
                                 alt={"article image"}/>
                        </figure>
                    </section>
                    <section className={"row-12"}>
                        <header className={"vbs_wecome_header py-3"}>
                            <h3>{t("home.vbh1")}</h3>
                            <h3>{t("home.vbh2")}</h3>
                        </header>
                        <div className={"vbTextDivWrapper"}>
                            <h5 className={"vbTextDiv"}>{t("home.vbh5")}</h5>
                            <div className={"vbTextDiv"}>
                                <p>{t("home.vbh5")}</p>
                                <p>{t("home.vbp1")}</p>
                                <p>{t("home.vbp2")}</p>
                                <p>{t("home.vbp3")}</p>
                                <p>{t("home.vbp4")}</p>
                                <p>{t("home.vbp5")}</p>
                                <ul>
                                    <li style={{listStyleType: "circle"}}>{t("home.vbli1")}</li>
                                    <li style={{listStyleType: "circle"}}>{t("home.vbli2")}</li>
                                    <li style={{listStyleType: "circle"}}>{t("home.vbli3")}</li>
                                    <li style={{listStyleType: "circle"}}>{t("home.vbli4")}</li>
                                    <li style={{listStyleType: "circle"}}>{t("home.vbli5")}</li>
                                </ul>
                                <p>{t("home.vbp6")}</p>
                                <p>{t("home.vbp7")}</p>
                                <p>{t("home.vbp8")}</p>
                                <p>{t("home.vbp9")}</p>
                                <p>{t("home.vbp10")}</p>
                                <p>{t("home.vbp11")}</p>
                                <div className={"headHuntingFooter"}>
                                    <h5>{t("home.hhFooter")}</h5>
                                </div>
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
