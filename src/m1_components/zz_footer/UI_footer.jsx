import React, {useEffect, useState} from "react";
import "./ST_footer.scss";
import silverlining_logo from "../../resources/images/SL_logo.svg";
import {Link, useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {MdKeyboardArrowRight} from "react-icons/md";
import {IconContext} from "react-icons";
import {FaFacebookF, FaLinkedinIn, FaInstagramSquare} from "react-icons/fa";
import {useAuth} from "../c1_auth/a0_auth_common/firebase/AuthContext";


export const UI_footer = () => {
    const {t, i18n} = useTranslation("SL_languages");
    const [latest3Blogs, setLatest3Blogs] = useState();
    const [isFooter, setIsFooter] = useState(false);
    const [change, setChange] = useState();

    const history = useHistory();

    const {
        read_blog,
    } = useAuth();

    //fetch articles only selectively..
    const fetchListOfBlogs = async () => {
        await read_blog().then((snapshot) => {
            // console.log("////:SSSSSNNNNNNN ", snapshot.val());
            let approvedBlogs = [];
            if (snapshot.val() !== null) {
                let i = 0;
                snapshot.forEach((snData) => {
                    let raw = JSON.parse(snData.val().stringifiedRaw);
                    let blogId = Object.keys(snapshot.val())[i];
                    let title = "";
                    let secondLineText = "";
                    //get first line text as tittle.
                    let txtStartLineNumber = 0;
                    for (let j = 0; j < raw.blocks.length; j++) {
                        let textAtLinex = raw.blocks[j].text;
                        if (textAtLinex.length > 0) {
                            title = textAtLinex;
                            txtStartLineNumber = j;
                            break;
                        }
                    }
                    //trim title if it is too long! max 20 cha, just to limit.
                    if (title.length > 100) {
                        title = title.substring(0, 100) + ". . .";
                    }

                    //also trim second line text
                    if (secondLineText.length > 120) {
                        secondLineText = title.substring(0, 120) + ". . .";
                    }

                    // console.log("////:URLLL??? ", imagesUrlList);
                    let aBlogDataes = {
                        authorNameAndId: snData.val().authorNameAndId,
                        authorProfileImgUrl: snData.val().authorProfileImgUrl,
                        blogType: snData.val().blogType,
                        postDate: snData.val().postDate,
                        ratingStars: snData.val().ratingStars,
                        deStringifiedRaw: JSON.parse(snData.val().stringifiedRaw),
                        title: title,
                        secondLineText: secondLineText,
                        isBlogApproved: JSON.parse(snData.val().isBlogApproved),
                        blogKey: blogId
                    };

                    let blogIsApproved = aBlogDataes.isBlogApproved;
                    if (blogIsApproved) { // no more than 3 latest post are needed.
                        approvedBlogs.push(aBlogDataes);
                    }
                    i++;
                });

                setLatest3Blogs(approvedBlogs.reverse());
            }
        });
    };
    useEffect(() => {
        fetchListOfBlogs().then((r) => {
            console.log("////:Fetched! for footer! ");
        }).catch((e) => {
            console.log("////:e ", e);
        });
    }, [/*deps*/]);

    useEffect(() => {
        if (isFooter) {
            history.push("blog/blogview/" + change);
            setIsFooter(false);
        }
    }, [change]);

    return (
        <footer className={"UI_footer_wrapper"}>
            {/*{latest3Blogs && console.log("////:RENDER?", change)}*/}
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
                            <p style={{color: "#4e6665"}}>Orgnr: 919 908 963</p>
                        </div>
                        <p style={{color: "#4e6665"}}>
                            <strong>Bergen:</strong> <br/>
                            Greenhouse Edvard Griegs vei 3A, 5059<br/>
                            {t("footer.tlf1")}: +47 982 55 131<br/>
                            {t("footer.tlf2")}: +47 473 48 151<br/>
                            Fax: +572 – 331 9911</p>
                    </div>
                    <div className={"middle_div footer_common"}>
                        <strong>{t("footer.learn_more")}</strong>
                        <ul>
                            <li><Link className={"lnk"} to={"/service/rent"}><strong>{t("le.lh3h2")}</strong></Link>
                            </li>
                            <li><Link className={"lnk"} to={"/home/wecare"}><strong>{t("home.vbh2")}</strong></Link>
                            </li>
                            <li><Link className={"lnk"}
                                      to={"/home/own"}><strong>{t("le.eie")} {t("recruitment.h3h2")}</strong></Link>
                            </li>
                            <li><Link className={"lnk"} to={"/service/advice"}><strong>{t("srv.sp8")}</strong></Link>
                            </li>
                        </ul>
                    </div>
                    <div className={"right_div footer_common"}>
                        <p style={{color: "#687f7e"}}>{t("footer.recent_posts")}</p>
                        {latest3Blogs && latest3Blogs.slice(0, 5).map(aBlog =>
                            <ul key={aBlog.blogKey}>
                                <li onClick={() => {
                                    setIsFooter(true);
                                    setChange(aBlog.blogKey)
                                }}
                                    className={"cm_txt"}><MdKeyboardArrowRight/>
                                    <Link className={"lnk_posts"}
                                          to={""}>
                                        <strong>{aBlog.title}</strong>
                                    </Link>
                                </li>
                                {/*<div className={"first_line cm_txt"}>{aBlog.secondLineText}</div>*/}
                            </ul>
                        )}
                        <div className={"bottom_sm"}>
                            <IconContext.Provider value={{size: "1.5em"}}>
                                <a className={"lnk_footer_sm"}
                                   href={"https://www.facebook.com/SilverLiningIT/"}><FaFacebookF
                                    style={{margin: "5px", padding: "2px"}}/></a>
                                <a className={"lnk_footer_sm"}
                                   href={"https://www.linkedin.com/company/silverlining-it/?viewAsMember=true"}><FaLinkedinIn
                                    style={{margin: "5px", padding: "2px"}}/></a>
                                <a className={"lnk_footer_sm"}
                                   href={"https://www.instagram.com/silver_lining_it/"}><FaInstagramSquare
                                    style={{margin: "5px", padding: "2px"}}/></a>
                            </IconContext.Provider>
                        </div>
                    </div>
                </div>
                <div className={"footer_bottom"}>
                    <div className={"last_footer_div"}>©2021 Silver Lining IT AS | web-app powered by react | designed
                        and developed by Gebi
                        Beshir gebi9@hotmail.com |
                        <span className={"last_footer_div_spans"}>
                            <Link className={"lnk_footer_ll"}
                                  to={"/privacypolicy"}><strong>{t("footer.terms_and_conditions")}</strong></Link>
                            {/*<span> | </span><Link className={"lnk_footer_ll"} to={`/router/path`}><strong>{t("footer.site_map")}</strong></Link>*/}
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
