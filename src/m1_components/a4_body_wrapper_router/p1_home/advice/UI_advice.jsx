import React, {useState} from "react";
import "./ST_advice.scss";
import {useTranslation} from "react-i18next";
import adv from "../../../../resources/images/adv.webp";
import {Link} from "react-router-dom";
import {UI_carousel} from "../reviewCarousel/UI_carousel";

export const UI_advice = () => {
    const {t, i18n} = useTranslation("SL_languages");

    return (
        <main className="adv_mainContainerHome container-12 adv_mc1">
            <div className={"adv_innerContainer"}>
                <figure className={"karianneImgWrap"}>
                    <img style={{borderRight: "1px solid #151515", borderTop: "2px solid #151515"}}
                         src={adv}
                         alt={"article image"}/>
                </figure>
                <article>
                    <section className={"row adv_section_with_images "}>
                    </section>
                    <section className={"row-12"}>
                        <header className={"adv_wecome_header py-3"}>
                            <h3>{t("adv.advh1h1")}</h3>
                            <h3>{t("adv.advh1h2")}</h3>
                        </header>
                        <div className={"textDivMainWraper"}>
                            <div className={"vbTextDiv px-5"}>
                                <p>{t("adv.adp1")}</p>
                                <p>{t("adv.adp2")}</p>

                                <h5>{t("adv.advh5h2")}</h5>
                                <p>{t("adv.adp3")}</p>
                                <p>{t("adv.adp4")}</p>
                                <p>{t("adv.adp5")}</p>
                                <p>{t("adv.adp6")}</p>
                                <p>{t("adv.adp7")}</p>
                                <p>{t("adv.adp8")}</p>
                                <p>{t("adv.adp9")}</p>
                                <p>{t("adv.adp10")}</p>
                            </div>
                        </div>
                        {/*<UI_carousel/>*/}
                    </section>
                </article>
            </div>
        </main>
    );
};
