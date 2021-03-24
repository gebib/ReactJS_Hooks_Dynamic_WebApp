import React, {useEffect, useState} from "react";
import "./ST_PullCards.scss";
import dw from "../../../../resources/images/dont_worry.jpg";
import {IconContext} from "react-icons";
import {FaArrowRight} from "react-icons/fa";

import sl5 from "../../../../resources/images/sl5.webp";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../../c1_auth/a0_auth_common/firebase/AuthContext";
import DOMPurify from "dompurify";
import {useHistory, useParams} from "react-router-dom";

export const UI_PullCards = (props) => {
    const {t, i18n} = useTranslation("SL_languages");
    const [randomArticle, setRandomArticle] = useState();
    const [hasPhoto, setHasPhoto] = useState();

    const history = useHistory();
    const urlParameter = useParams();

    const {
        read_blog,
    } = useAuth();

    //fetch articles only selectively..
    const fetchListOfBlogs = async () => {
        await read_blog().then((snapshot) => {
            // console.log("////:SSSSSNNNNNNN ", snapshot.val());
            let chosen3as = [];
            if (snapshot.val() !== null) {
                let i = 0;
                snapshot.forEach((snData) => {
                    let raw = JSON.parse(snData.val().stringifiedRaw);
                    let blogId = Object.keys(snapshot.val())[i];
                    let title = "";
                    //get first line text as tittle.
                    for (let i = 0; i < raw.blocks.length; i++) {
                        let textAtLinex = raw.blocks[i].text;
                        if (textAtLinex.length > 0) {
                            title = textAtLinex;
                            break;
                        }
                    }
                    //trim title if it is too long! max 20 cha, just to limit.
                    if (title.length > 20) {
                        title = title.substring(0, 19) + ". . .";
                    }
                    let imagesUrlList = [];
                    if (snData.val().listOfBlogImgUrls) {
                        imagesUrlList = snData.val().listOfBlogImgUrls;
                    }
                    // console.log("////:URLLL??? ", imagesUrlList);
                    let aBlogDataes = {
                        authorNameAndId: snData.val().authorNameAndId,
                        authorProfileImgUrl: snData.val().authorProfileImgUrl,
                        blogType: snData.val().blogType,
                        htmlTxt: snData.val().htmlTxt,
                        urlsOfBlogImages: imagesUrlList,
                        postDate: snData.val().postDate,
                        ratingStars: snData.val().ratingStars,
                        deStringifiedRaw: JSON.parse(snData.val().stringifiedRaw),
                        title: title,
                        isBlogApproved: JSON.parse(snData.val().isBlogApproved),
                        blogKey: blogId
                    };

                    let blogIsApproved = aBlogDataes.isBlogApproved;
                    let blogIsArticle = (aBlogDataes.blogType === "article");
                    if (blogIsApproved && blogIsArticle) {
                        chosen3as.push(aBlogDataes);
                    }
                    i++;
                });
            }
            let a = 0;
            let b = 0;
            let c = 0;
            if (chosen3as.length > 2) { //find 3 random distinct number.
                while ((a === b) || (a === c) || (b === c)) {
                    a = Math.floor(Math.random() * chosen3as.length);
                    b = Math.floor(Math.random() * chosen3as.length);
                    c = Math.floor(Math.random() * chosen3as.length);
                }
                setRandomArticle([chosen3as[a], chosen3as[b], chosen3as[c]]);
                setHasPhoto([(chosen3as[a].urlsOfBlogImages.length > 0), (chosen3as[b].urlsOfBlogImages.length > 0), (chosen3as[c].urlsOfBlogImages.length > 0)]);
            }
        });
    };
    useEffect(() => {
        fetchListOfBlogs().then((r) => {
            console.log("////:Fetched! ");
        }).catch((e) => {
            console.log("////:e ", e);
        });
    }, [/*deps*/]);


    return (
        <section>

           { randomArticle && <div className="row row-cols-1 row-cols-md-2 row-cols-sm-1 row-cols-lg-3 g-4 mb-5">
                <div className="col">
                    <div className="card h-100">
                        <img hidden={hasPhoto && !hasPhoto[0]}
                             src={randomArticle && Object.values(randomArticle[0])[4][0]}
                             className="card-img-top"
                             alt="article image"/>
                        <div className="card-body">
                            <h5 className="card-title d-flex justify-content-center">{randomArticle && randomArticle[0].title}</h5>
                            <div className={"dangerDiv px-2"}
                                 dangerouslySetInnerHTML={randomArticle && {__html: DOMPurify.sanitize(randomArticle[0].htmlTxt)}}/>
                        </div>
                        <div className="card-footer d-flex justify-content-center">
                            <button onClick={() => {
                                if (props.getNewblog !== null) {
                                    props.getNewblog(randomArticle[0].blogKey);
                                } else {
                                    history.push(history.push("blog/blogview/" + randomArticle[0].blogKey));
                                }
                            }} className={" btn btn-dark readMoreCardBtn"}>
                                <IconContext.Provider value={{size: "1em"}}>
                                    <div className={"cards_btn"} onClick={() => {
                                    }}>{t("home.read_btn")}< FaArrowRight
                                        style={{color: "#ffffff"}}/>
                                    </div>
                                </IconContext.Provider>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card h-100">
                        <img hidden={hasPhoto && !hasPhoto[1]}
                             src={randomArticle && Object.values(randomArticle[1])[4][0]}
                             className="card-img-top"
                             alt="article image"/>
                        <div className="card-body">
                            <h5 className="card-title d-flex justify-content-center">{randomArticle && randomArticle[1].title}</h5>
                            <div className={"dangerDiv px-2"}
                                 dangerouslySetInnerHTML={randomArticle && {__html: DOMPurify.sanitize(randomArticle[1].htmlTxt)}}/>
                        </div>
                        <div className="card-footer d-flex justify-content-center">
                            <button onClick={() => {
                                if (props.getNewblog !== null) {
                                    props.getNewblog(randomArticle[1].blogKey);
                                } else {
                                    history.push(history.push("blog/blogview/" + randomArticle[1].blogKey));
                                }
                            }} className={" btn btn-dark readMoreCardBtn"}>
                                <IconContext.Provider value={{size: "1em"}}>
                                    <div className={"cards_btn"} onClick={() => {
                                    }}>{t("home.read_btn")}< FaArrowRight
                                        style={{color: "#ffffff"}}/>
                                    </div>
                                </IconContext.Provider>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card h-100">
                        <img hidden={hasPhoto && !hasPhoto[2]}
                             src={randomArticle && Object.values(randomArticle[2])[4][0]}
                             className="card-img-top"
                             alt="article image"/>
                        <div className="card-body">
                            <h5 className="card-title d-flex justify-content-center">{randomArticle && randomArticle[2].title}</h5>
                            <div className={"dangerDiv px-2"}
                                 dangerouslySetInnerHTML={randomArticle && {__html: DOMPurify.sanitize(randomArticle[2].htmlTxt)}}/>
                        </div>
                        <div className="card-footer d-flex justify-content-center">
                            <button onClick={() => {
                                if (props.getNewblog !== null) {
                                    props.getNewblog(randomArticle[2].blogKey);
                                } else {
                                    history.push(history.push("blog/blogview/" + randomArticle[2].blogKey));
                                }
                            }} className={" btn btn-dark readMoreCardBtn"}>
                                <IconContext.Provider value={{size: "1em"}}>
                                    <div className={"cards_btn"} onClick={() => {
                                    }}>{t("home.read_btn")}< FaArrowRight
                                        style={{color: "#ffffff"}}/>
                                    </div>
                                </IconContext.Provider>
                            </button>
                        </div>
                    </div>
                </div>
            </div>}
        </section>
    );
};
