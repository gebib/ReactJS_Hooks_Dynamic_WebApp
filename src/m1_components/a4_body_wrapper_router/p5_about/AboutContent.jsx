import React, {useEffect, useRef, useState} from "react";
import "./AboutContent.scss";
import apply from "../../../resources/images/apply.png";
import {Link, useHistory} from "react-router-dom";
import kari from "../../../resources/images/kari.webp";
import marianne from "../../../resources/images/marianne.webp";
import sl5 from "../../../resources/images/sl5.webp";
import lg from "../../../resources/images/adv.webp";
import {UI_PullCards} from "../p1_home/pullcards/UI_PullCards";
import {useTranslation} from "react-i18next";
import {IconContext} from "react-icons";
import {MdRemoveCircle} from "react-icons/md";
import {AiFillPicture} from "react-icons/ai";

import {FaArrowRight} from "react-icons/fa";
import {UI_carousel} from "../p1_home/reviewCarousel/UI_carousel";
import {useAuth} from "../../c1_auth/a0_auth_common/firebase/AuthContext";
import {v4 as uuid} from "uuid";


export const AboutContent = () => {
    const {t, i18n} = useTranslation("SL_languages");
    const history = useHistory();
    const [listOfLogos, setListOfLogos] = useState();
    const [cu, setCu] = useState(false);


    const imgInputRef = useRef();
    const imgRef = useRef();

    const {
        blogPostLoading,
        currentUserInfo,
        addNewPartnerLogo,
        getAllPartnersLogo,
        removeApartnersLogo,
        isLogDbActivity
    } = useAuth();

    useEffect(() => {
        if (currentUserInfo) {
            setCu(currentUserInfo[2]);
        }
    }, [currentUserInfo]);

    useEffect(() => {
        if (!isLogDbActivity) {
            fetchListOfLogos().then((r) => {
            }).catch((e) => {
                console.log("////:e ", e);
            });
        }
    }, [isLogDbActivity]);

    const fetchListOfLogos = async () => {
        let listOfFetchedImgInfoes = [];
        await getAllPartnersLogo().then((snapShopt) => {
            if (snapShopt.val() !== null) {
                snapShopt.forEach((aLogoInfo) => {
                    let imgMetDat = {
                        imgUrl: aLogoInfo.val().dUrl,
                        imgNameId: aLogoInfo.val().imgNameId
                    };
                    listOfFetchedImgInfoes.push(imgMetDat);
                });
                setListOfLogos(listOfFetchedImgInfoes);
            } else {
                setListOfLogos(null);
            }
        }).catch((e) => {
        });
    };

    const uploadNewLogo = (aFile) => {
        console.log("////:aFile: ", aFile);
        if (aFile) {
            addNewPartnerLogo(aFile);
        }
    };

    const handleDeleteLogo = (clickedId) => {
        removeApartnersLogo(clickedId);
    };


    return (
        <main className="mainContainerHome container-12 about_mc1">
            <div className={"about_innerContainer"}>
                <article>
                    <section className={"row-12 mx-5"}>
                        <header className={"about_wecome_header py-3 mt-5"}>
                            <h3>{t("about.abh3h1")}</h3>
                        </header>
                        <div className="row-12 ">
                            <p>{t("about.abp1")}</p>
                            <p>{t("about.abp2")}</p>

                            <h5>{t("about.abh5h2")}</h5>
                            <p>{t("about.abp3")}</p>
                            <div style={{textJustify: "none", fontSize: "17px", marginBottom: "20px"}}>{t("about.abp4")}
                                <a style={{marginLeft: "7px"}}
                                   href={"https://www.facebook.com/SilverLiningIT/"}>facebook</a>
                                <a style={{marginLeft: "7px"}}
                                   href={"https://www.linkedin.com/company/silverlining-it/?viewAsMember=true"}>LinkedIn</a>
                                <a style={{marginLeft: "7px"}}
                                   href={"https://www.instagram.com/silver_lining_it/"}>Insta</a>
                            </div>
                        </div>
                    </section>

                    <section className={"row about_section_with_images "}>
                        <div className={"col-lg-6 about_img_with_text px-0"}>

                            <div className={"blackBottomLeft about_img_txt_header px-3"}>
                                <img className={"ma_ka_img karImg"} src={kari} alt={"article image"}/>
                                <div><h4 style={{color: "white", marginTop: "20px"}}>Karin Ingvaldsen</h4></div>
                                <div><h6 style={{color: "white"}}>{t("about.krInfo")}</h6></div>
                                <p style={{color: "white"}}>Tel +47 473 48 151</p>
                                <a style={{color: "#248C9D"}}
                                   href="mailto:ki@silverliningit.no">ki@silverliningit.no</a>
                            </div>

                        </div>
                        <div className={"col-lg-6 about_img_with_text px-0"}>
                            <div className={"blackBottomLeft about_img_txt_header px-3"}>
                                <img className={"ma_ka_img marImg"} src={marianne} alt={"article image"}/>
                                <div><h4 style={{color: "white", marginTop: "20px"}}>Marianne Håvardstun</h4></div>
                                <div><h6 style={{color: "white"}}>{t("about.mrInfo")}</h6></div>
                                <p style={{color: "white"}}>Tel +47 982 55 131</p>
                                <a style={{color: "#248C9D"}}
                                   href="mailto:marianne.haavardstun@silverliningit.no">marianne.haavardstun@silverliningit.no</a>
                            </div>
                        </div>
                    </section>
                </article>
                <div className={"smPartnersMainWraper"}>
                    <div className={"smL2Wrapper"}><h3
                        style={{marginTop: "50px", marginBottom: "20px"}}>{t("about.abh3h5")}</h3>
                        <input
                            ref={imgInputRef}
                            type={"file"}
                            className={"d-none"}
                            // multiple={true}
                            accept={"image/*"}
                            onChange={(e) => {
                                e.preventDefault();
                                const aFile = e.target.files[0];
                                uploadNewLogo(aFile);
                            }}/>

                        <div style={{paddingLeft:"50px", paddingRight:"50px", marginTop:"50px"}}>
                            <p>{t("about.abp5")} {t("about.abp6")}</p>
                            <div style={{display:"flex", justifyContent:"center"}}><h5>{t("about.abp7")}</h5></div>
                        </div>

                        <div className={"smPartLogosListDiv"}>
                            {listOfLogos && listOfLogos.map((anImageInfo) => {
                                return (
                                    <div key={uuid()} className={"ab_overlay-fade"}>
                                        <img
                                            ref={imgRef}
                                            style={{
                                                margin: "20px",
                                            }}
                                            alt={"what"}
                                            src={anImageInfo.imgUrl}
                                            height={"100px"}/>
                                        <div id={anImageInfo.imgNameId} className={"overlayIcon"}
                                             onClick={(e) => {
                                                 e.stopPropagation();
                                                 handleDeleteLogo(anImageInfo.imgNameId);
                                             }}>
                                            <h1 id={anImageInfo.imgNameId} style={{color: "#ff4500"}}>X</h1>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <button hidden={!blogPostLoading || !cu} style={{color: "#a9c0bf", margin:"20px"}} onClick={(event) => {
                            event.preventDefault();
                            imgInputRef.current.click();
                        }} type="button" className="btn btn-dark">
                            <input type="file" hidden/>
                            <IconContext.Provider value={{size: "1.5em"}}>
                                <AiFillPicture style={{color: "#a9c0bf", marginRight: "10px"}}/>
                            </IconContext.Provider>
                            {t("about.addNp")}
                        </button>
                    </div>
                </div>
                {/*<hr/>*/}
                <UI_carousel/>
            </div>
        </main>
    );


};
