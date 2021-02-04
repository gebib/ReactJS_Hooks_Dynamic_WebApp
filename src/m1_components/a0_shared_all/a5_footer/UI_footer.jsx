import React from "react";
import "./ST_footer.scss";
import silverlining_logo from "../../../resources/images/SL_logo.svg";
import {Link, useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {MdKeyboardArrowRight} from "react-icons/md";
import {IconContext} from "react-icons";
import {FaFacebookF, FaLinkedinIn, FaInstagramSquare} from "react-icons/fa";




export const UI_footer = () => {
    const {t, i18n} = useTranslation("SL_languages");
    const history = useHistory();
    return (
        <footer className={"UI_footer_wrapper"}>
            <div className={"footer_outer"}>
                <div className={"footer_inner"}>
                    <div className={"left_div footer_common"}>

                        <div>
                            <div className={"footer_sl_logo"}>
                                <img className={"img_self"} style={{cursor: "pointer"}}
                                     onClick={() => history.push("/home")}
                                     id={"logo"} src={silverlining_logo} alt={"SILVERLINING logo"}/>
                            </div>
                            <div>Silver Lining IT AS</div>
                            <p>Orgnr: 919 908 963</p>
                        </div>
                        <p>
                            <strong>Bergen:</strong> <br/>
                            Greenhouse Edvard Griegs vei 3A, 5059<br/>
                            {t("footer.tlf1")}: +47 982 55 131<br/>
                            {t("footer.tlf2")}: +47 98 255 131<br/>
                            Fax: +572 – 331 9911</p>
                    </div>
                    <div className={"middle_div footer_common"}>
                        <strong>{t("footer.learn_more")}</strong>
                        <ul>
                            <li><Link className={"lnk"} to={`/router/path`}><strong>Our services</strong></Link></li>
                            <li><Link className={"lnk"} to={`/router/path`}><strong>Available job positions</strong></Link></li>
                            <li><Link className={"lnk"} to={`/router/path`}><strong>Blog</strong></Link></li>
                        </ul>
                    </div>
                    <div className={"right_div footer_common"}>
                        <p>{t("footer.recent_posts")}</p>
                        <ul>
                            <li className={"cm_txt"}><MdKeyboardArrowRight/><Link className={"lnk_posts"} to={`/router/path`}><strong>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab at debitis enim expedita illum labore natus nisi quam quo sapiente.</strong></Link></li>
                            <div className={"first_line cm_txt"}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis, harum.</div>
                            <li className={"cm_txt"}><MdKeyboardArrowRight/><Link className={"lnk_posts"} to={`/router/path`}><strong>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores cupiditate dolor facere ipsum itaque non repellendus rerum temporibus, voluptatem voluptatibus!</strong></Link></li>
                            <div className={"first_line cm_txt"}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut, modi!</div>
                            <li className={"cm_txt"}><MdKeyboardArrowRight/><Link className={"lnk_posts"} to={`/router/path`}><strong>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda atque consequatur dolor doloremque harum impedit ipsam itaque officia quia quisquam?</strong></Link></li>
                            <div className={"first_line cm_txt"}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, iusto.</div>
                        </ul>
                        <div className={"bottom_sm"}>
                            <IconContext.Provider value={{size: "1.5em"}}>
                                <Link className={"lnk_footer_sm"} to={`/router/path`}><FaFacebookF style={{margin: "5px", padding: "2px"}}/></Link>
                                <Link className={"lnk_footer_sm"} to={`/router/path`}><FaLinkedinIn style={{margin: "5px", padding: "2px"}}/></Link>
                                <Link className={"lnk_footer_sm"} to={`/router/path`}><FaInstagramSquare style={{margin: "5px", padding: "2px"}}/></Link>
                            </IconContext.Provider>
                        </div>
                    </div>
                </div>
                <div className={"footer_bottom"}>
                    <div className={"last_footer_div"}>©2021 Silver Lining IT AS. webapp designed and developed by: Gebi Beshir gebi9@hotmail.com
                        <span className={"last_footer_div_spans"}>
                            <Link className={"lnk_footer_ll"} to={`/router/path`}>
                                <strong>{t("footer.terms_and_conditions")}</strong>
                            </Link><span> | </span>
                            <Link className={"lnk_footer_ll"} to={`/router/path`}>
                                <strong>{t("footer.legal")}</strong>
                            </Link><span> | </span>
                            <Link className={"lnk_footer_ll"} to={`/router/path`}>
                                <strong>{t("footer.site_map")}</strong>
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}