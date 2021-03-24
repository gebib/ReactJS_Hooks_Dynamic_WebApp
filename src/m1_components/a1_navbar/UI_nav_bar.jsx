import React, {useEffect, useState} from "react";
import "./ST_nav_bar.scss";
import {InView, useInView} from 'react-intersection-observer';
import silverlining_logo from "../../resources/images/SL_logo.svg";
import {Link, useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import englishFlag from "../../resources/images/ukf.png";
import norskFlag from "../../resources/images/nof.png";
import {BsArrowUpDown} from "react-icons/bs";
import {GiHamburgerMenu} from "react-icons/gi";
import {IconContext} from "react-icons";
import useOnclickOutside from "react-cool-onclickoutside";
import {MdPhone} from "react-icons/md";
import {FaFacebookF} from "react-icons/fa";
import {ImLinkedin2} from "react-icons/im";
import {FaInstagramSquare} from "react-icons/fa";
import {ImArrowUp} from "react-icons/im";
import {useAuth} from "../c1_auth/a0_auth_common/firebase/AuthContext";
import {showToast} from "../../UI_Main_pages_wrapper";


export const UI_nav_bar = (props) => {
    const {t, i18n} = useTranslation("SL_languages");


    const [onHome, setOnHome] = useState(true);
    const [onJobs, setOnJobs] = useState(false);
    const [onService, setOnService] = useState(false);
    const [onBlog, setOnBlog] = useState(false);
    const [onAbout, setOnAbout] = useState(false);

    const location = useLocation();
    const [prevCurrentLocation, setPrevCurrenLocation] = useState(["/", "/"]);


    const {ref, inView, entry} = useInView({
        threshold: 0,
    });
    const history = useHistory();
    const {currentUserInfo, logout} = useAuth();
    // const {error, setError} = useState();

    const handleLanguageChange = () => {
        if (i18n.language === "en") {
            i18n.changeLanguage("no").then(r => {
                try {
                    localStorage.setItem("lang", "no");
                } catch (e) {
                    console.log("////: ", e);
                }
            });
        } else if (i18n.language === "no") {
            i18n.changeLanguage("en").then(r => {
                try {
                    localStorage.setItem("lang", "en");
                } catch (e) {
                    console.log("////: ", e);
                }
            });
        }
    };

    //load preferred language if exist on ls
    useEffect(() => {
        let preferredLang = null;
        try {
            preferredLang = localStorage.getItem("lang");
        } catch (e) {
            console.log("////: ", e);
        }
        if ((preferredLang !== null) && ((preferredLang === "en") || (preferredLang === "no"))) {
            i18n.changeLanguage(preferredLang).then((r) => {
            }).catch((e) => {
                console.log("////:e ", e);
            });
        }
    }, [/*deps*/]);

    //should fire only when routing path changes:
    useEffect(() => {
        let pageUrl = location.pathname;
        //for manual decoration of active li for nav.!
        if (pageUrl === "/") {
            setOnHome(true);
            setOnJobs(false);
            setOnService(false);
            setOnBlog(false);
            setOnAbout(false);
        } else if (pageUrl.includes("job")) {
            setOnHome(false);
            setOnJobs(true);
            setOnService(false);
            setOnBlog(false);
            setOnAbout(false);
        } else if (pageUrl.includes("services")) {
            setOnHome(false);
            setOnJobs(false);
            setOnService(true);
            setOnBlog(false);
            setOnAbout(false);
        } else if (pageUrl.includes("blog")) {
            setOnHome(false);
            setOnJobs(false);
            setOnService(false);
            setOnBlog(true);
            setOnAbout(false);
        } else if (pageUrl.includes("about")) {
            setOnHome(false);
            setOnJobs(false);
            setOnService(false);
            setOnBlog(false);
            setOnAbout(true);
        }
    }, [location.pathname]);

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

    const handleLoginLogout = async () => {
        try {
            if (currentUserInfo !== null) {
                await logout().then((r) => {
                }).catch((e) => {
                    console.log("////:e ", e);
                });
                showToast(t("sign_in.log_out_ok"), "info");
            } else {
                history.push("/login");
            }
        } catch {
            showToast(t("sign_in.log_out_fail"), "error");
        }
    };


    return (
        <div className={"nav_bar_main_wrapper"}>
            <div ref={ref}>
                <div className={(inView ? "top_bar_1" : "top_bar_0")}>
                    <div className={"top_bar_elems"}>
                        <div className={"tlf_ico top_elems"}><MdPhone/></div>
                        <div className={"tlf_nr top_elems"}>
                            <div style={{color: "#24818D"}}>+47 98 255 131</div>
                        </div>
                        <div className={"fb_ico top_elems"}><FaFacebookF/></div>
                        <div className={"in_ico top_elems"}><ImLinkedin2/></div>
                        <div className={"insta_ico top_elems"}><FaInstagramSquare/></div>
                        <div className={"sign_in"}>
                            <IconContext.Provider value={{size: "1em"}}>
                                <div className={"sign_in_lbl"} onClick={() => handleLoginLogout()}
                                     style={currentUserInfo !== null ? {
                                         color: "#24818D",
                                         minWidth: "85px"
                                     } : {color: "#24818D", minWidth: "85px"}
                                     }>{currentUserInfo !== null ? t("sign_in.logout") : t("sign_in.login")}<ImArrowUp/>
                                </div>
                            </IconContext.Provider>
                        </div>
                    </div>
                </div>
            </div>

            <nav className={(inView ? "bottom_bar" : "bottom_bar fixed-top")}>
                <div className={"bottom_bar_elems"}>

                    <div className={"small_logo_wrapper"}>
                        <img className={"img_self"} style={{cursor: "pointer"}} onClick={() => history.push("/")}
                             id={"logo"} src={silverlining_logo} alt={"SILVERLINING logo"}/>
                    </div>

                    <ul className={"nav_links"}>
                        <IconContext.Provider value={{size: "1.5em"}}>
                            <li className={"burger_menu_li"} onClick={handleBtnClick}><GiHamburgerMenu/></li>
                        </IconContext.Provider>

                        <li className={onHome ? "activeStyle" : "li_s"}>
                            <Link className={"lnk"} to={"/"}>{t("nav.home")}</Link></li>
                        <li className={onJobs ? "activeStyle" : "li_s"}>
                            <Link className={"lnk"} to={"/jobs"}>{t("nav.jobs")}</Link></li>
                        <li className={onService ? "activeStyle" : "li_s"}>
                            <Link onMouseEnter={() => {
                                console.log("//////////////////////////////////////////: Enter");
                            }}
                                  onMouseLeave={() => {
                                      console.log("//////////////////////////////////////////: Leave");
                                  }}
                                  className={"lnk"} to={"/services"}>{t("nav.services")}</Link>
                        </li>
                        <li className={onBlog ? "activeStyle" : "li_s"}>
                            <Link className={"lnk"} to={"/blog"}>{t("nav.blog")}</Link></li>
                        <li className={onAbout ? "activeStyle" : "li_s"}>
                            <Link className={"lnk"} to={"/about"}>{t("nav.about")}</Link>
                        </li>
                    </ul>

                    <div className={"language"}>
                        <div className={"flag_div"}>
                            <img className={"flag_img_self"} src={(i18n.language === "en") ? englishFlag : norskFlag}
                                 alt={"language flag"}/>
                        </div>
                        <div style={{backgroundColor: "black"}} className={"text_div"} onClick={handleLanguageChange}>
                            <p style={{color: "#24818D"}}
                               className={"text_self d-flex justify-content-center"}>{t("nav.lang")}</p>
                        </div>
                    </div>

                </div>
            </nav>
            {/*///////////////drop down*/}
            <div className={(inView ? "dropdown" : "dropdown fixed-top")} style={{marginTop: inView ? "0px" : "35px"}}
                 ref={refb}>
                {openMenu && (
                    <div className="drop_down_wrapper" onClick={closeMenu}>
                        <ul style={{padding: 0}}>
                            <li onClick={()=>{
                                history.push("/");
                            }} className={onHome ? "activeStyleSm" : "li_d"}>
                                <Link className={"lnk_b"} to={"/"}>{t("nav.home")}</Link>
                            </li>
                            <li onClick={()=>{
                                history.push("/jobs");
                            }} className={onJobs ? "activeStyleSm" : "li_d"}>
                                <Link className={"lnk_b"} to={"/jobs"}>{t("nav.av_positions")}</Link>
                            </li>
                            <li onClick={()=>{
                                history.push("/services");
                            }} className={onService ? "activeStyleSm" : "li_d"}>
                                <Link className={"lnk_b"} to={"/services"}>{t("nav.services")}</Link>
                            </li>
                            <li onClick={()=>{
                                history.push("/blog");
                            }} className={onBlog ? "activeStyleSm" : "li_d"}>
                                <Link className={"lnk_b"} to={"/blog"}>{t("nav.blog")}</Link>
                            </li>
                            <li onClick={()=>{
                                history.push("/about");
                            }} className={onAbout ? "activeStyleSm" : "li_d"}>
                                <Link className={"lnk_b"} to={"/about"}>{t("nav.about")}</Link>
                            </li>

                            <div className={"language2"}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    border: "1px solid #24818D",
                                    borderRadius: "6px",
                                    minWidth: "100%",
                                    marginBottom: "5px"
                                }}>
                                    <div className={"flag_div2"}>
                                        <img className={"flag_img_self2"}
                                             src={(i18n.language === "en") ? englishFlag : norskFlag}
                                             alt={"language flag"}/>
                                    </div>
                                    <div className={"text_div2"} onClick={handleLanguageChange}>
                                        <p style={{color: "#24818D"}} className={"text_self2"}>{t("nav.lang")}</p>
                                    </div>
                                </div>
                                <div style={{
                                    minWidth: "100%",
                                }} className={"sign_in"}>
                                    <IconContext.Provider value={{size: "1em"}}>
                                        <div className={"sign_in_lbl"} onClick={() => handleLoginLogout()}
                                             style={currentUserInfo !== null ? {
                                                 color: "#24818D",
                                                 minHeight: "33px",
                                                 display: "flex",
                                                 justifyContent: "center",
                                                 alignItems: "center",
                                                 border: "1px solid #24818D",
                                                 borderRadius: "6px",
                                                 marginTop: "5px",
                                                 fontSize: "17px"
                                             } : {color: "#24818D",
                                                 minHeight: "33px",
                                                 display: "flex",
                                                 justifyContent: "center",
                                                 alignItems: "center",
                                                 border: "1px solid #24818D",
                                                 borderRadius: "6px",
                                                 marginTop: "5px",
                                                 fontSize: "17px"}
                                             }>{currentUserInfo !== null ? t("sign_in.logout") : t("sign_in.login")}<ImArrowUp/>
                                        </div>
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
};
