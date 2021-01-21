import React, {useState, useRef, useEffect} from "react";
import "./ST_nav_bar.scss";
import {InView, useInView} from 'react-intersection-observer';
import silverlining_logo from "../../../resources/images/SL_logo.svg";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import englishFlag from "../../../resources/images/ukf.png";
import norskFlag from "../../../resources/images/nof.png";
import {BsArrowUpDown} from "react-icons/bs";
import {GiHamburgerMenu} from "react-icons/gi";
import {IconContext} from "react-icons";
import useOnclickOutside from "react-cool-onclickoutside";
import {MdPhone} from "react-icons/md";
import {FaFacebookF} from "react-icons/fa";
import {ImLinkedin2} from "react-icons/im";
import {FaInstagramSquare} from "react-icons/fa";


export const UI_nav_bar = (props) => {
    const {t, i18n} = useTranslation("SL_languages");
    const {ref, inView, entry} = useInView({
        threshold: 0,
    });
    const history = useHistory();

    const handleLanguageChange = () => {
        if (i18n.language === "en") {
            i18n.changeLanguage("no").then(r => {
            });
        } else if (i18n.language === "no") {
            i18n.changeLanguage("en").then(r => {
            });
        }
    }

    //drop down
    const [openMenu, setOpenMenu] = React.useState(false);
    const handleBtnClick = () => {
        setOpenMenu(!openMenu);
    };
    const closeMenu = () => {
        setOpenMenu(false);
    };
    const refb = useOnclickOutside(() => {
        closeMenu();
    });
    /////////


    return (
        <div className={"nav_bar_main_wrapper"}>

            <div ref={ref}>
                <div className={(inView ? "top_bar_1" : "top_bar_0")}>
                    <div className={"top_bar_elems"}>
                        <div className={"tlf_ico top_elems"}><MdPhone/></div>
                        <div className={"tlf_nr top_elems"}><div>+47 98 255 131</div></div>
                        <div className={"fb_ico top_elems"}><FaFacebookF/></div>
                        <div className={"in_ico top_elems"}><ImLinkedin2/></div>
                        <div className={"insta_ico top_elems"}><FaInstagramSquare/></div>
                    </div>
                </div>
            </div>

            <div className={(inView ? "bottom_bar" : "bottom_bar fixed-top")}>
                <div className={"bottom_bar_elems"}>

                    <div className={"small_logo_wrapper"}>
                        <img className={"img_self"} style={{cursor: "pointer"}} onClick={() => history.push("/home")}
                             id={"logo"} src={silverlining_logo} alt={"SILVERLINING logo"}/>
                    </div>

                    <ul className={"nav_links"}>
                        <IconContext.Provider value={{size: "1.5em"}}>
                            <li className={"burger_menu_li"} onClick={handleBtnClick}><GiHamburgerMenu/></li>
                        </IconContext.Provider>
                        <li className={"li_s"}><Link className={"lnk"} to={`/router/path`}>{t("nav.home")}</Link></li>
                        <li className={"li_s"}><Link className={"lnk"} to={`/router/path`}>{t("nav.av_positions")}</Link></li>
                        <li className={"li_s"}><Link className={"lnk"} to={`/router/path`}>{t("nav.services")}</Link></li>
                        <li className={"li_s"}><Link className={"lnk"} to={`/router/path`}>{t("nav.blog")}</Link></li>
                        <li className={"li_s"}><Link className={"lnk"} to={`/router/path`}>{t("nav.about")}</Link></li>
                    </ul>

                    <div className={"language"}>
                        <div className={"flag_div"}>
                            <img className={"flag_img_self"} src={(i18n.language === "en") ? englishFlag : norskFlag} alt={"language flag"}/>
                        </div>
                        <div className={"text_div"} onClick={handleLanguageChange}>
                            <IconContext.Provider value={{size: "1.5em"}}>
                                <p className={"text_self"}>{t("nav.lang")}<BsArrowUpDown/></p>
                            </IconContext.Provider>
                        </div>
                    </div>

                </div>
            </div>
            {/*///////////////drop down*/}
            <div className={(inView ? "dropdown" : "dropdown fixed-top")} style={{marginTop: inView ? "0px" : "35px"}}
                 ref={refb}>
                {openMenu && (
                    <div className="drop_down_wrapper" onClick={closeMenu}>
                        <ul style={{padding: 0}}>
                            <li className={"li_d"}><Link className={"lnk_b"} to={`/router/path`}>{t("nav.home")}</Link>
                            </li>
                            <li className={"li_d"}><Link className={"lnk_b"}
                                                         to={`/router/path`}>{t("nav.av_positions")}</Link></li>
                            <li className={"li_d"}><Link className={"lnk_b"}
                                                         to={`/router/path`}>{t("nav.services")}</Link></li>
                            <li className={"li_d"}><Link className={"lnk_b"} to={`/router/path`}>{t("nav.blog")}</Link>
                            </li>
                            <li className={"li_d"}><Link className={"lnk_b"} to={`/router/path`}>{t("nav.about")}</Link>
                            </li>
                            <div className={"language2"}>
                                <div className={"flag_div2"}>
                                    <img className={"flag_img_self2"}
                                         src={(i18n.language === "en") ? englishFlag : norskFlag}
                                         alt={"language flag"}/>
                                </div>
                                <div className={"text_div2"} onClick={handleLanguageChange}>
                                    <IconContext.Provider value={{size: "1.5em"}}>
                                        <p className={"text_self2"}>{t("nav.lang")}<BsArrowUpDown/></p>
                                    </IconContext.Provider>
                                </div>
                            </div>
                        </ul>

                    </div>


                )}

            </div>
            {/*////////////////////////*/}
            {/*{console.log("/////:: ", inView)}*/}
        </div>
    );
}