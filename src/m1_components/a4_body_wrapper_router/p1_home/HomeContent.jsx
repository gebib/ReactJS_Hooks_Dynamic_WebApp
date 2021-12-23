import React, {useState} from "react";
import "./HomeContent.scss";
import {useTranslation} from "react-i18next";
import apply from "../../../resources/images/apply.png";
import sl3 from "../../../resources/images/sl3.png";
import sl4 from "../../../resources/images/sl4.webp";
import sl5 from "../../../resources/images/sl5.webp";
import {Link} from "react-router-dom";
import {UI_PullCards} from "./pullcards/UI_PullCards";
import {UI_quill} from "../../a0_shared_all/quill_html_editor/UI_quill";


export const HomeContent = () => {
    const {t, i18n} = useTranslation("SL_languages");


    return (
        <main style={{backgroundColor: "#EFF3FA"}} className="mainContainerHome container-12 px-5 mc1">
            <div className={"innerContainer"}>
                <UI_quill editablePageName={"homePage"}/>

                <UI_PullCards getNewblog={null}/>

                {/*TODO delete?*/}
                {/*<footer className={"google_map"}>*/}
                {/*    <iframe*/}
                {/*        src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d2577.175644981354!2d5.340208183754848!3d60.37308703534332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sGREENHOUSE%20EDVARD%20GRIEGS%20VEI%203A%2C%205059!5e1!3m2!1sen!2sno!4v1612804445278!5m2!1sen!2sno"*/}
                {/*        width="100%" height="450" frameBorder="0" style={{border: "0"}} allowFullScreen=""*/}
                {/*        aria-hidden="false"*/}
                {/*        tabIndex="0"/>*/}
                {/*</footer>*/}
                {/*<section className={"can_w_h_you"}>*/}
                {/*    <>{t("home.p12")}</>*/}
                {/*    <br/> <>{t("home.p13")}</>*/}
                {/*</section>*/}
            </div>
        </main>
    );
};
