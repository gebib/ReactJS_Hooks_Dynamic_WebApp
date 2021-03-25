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


export const AboutContent = () => {
    const {t, i18n} = useTranslation("SL_languages");
    const history = useHistory();
    const [listOfPartners, setListOfPartners] = useState();

    const [listOfLogos, setListOfLogos] = useState([]);

    const [cu, setCu] = useState(false);


    const imgInputRef = useRef();
    const imgRef = useRef();

    const {
        create_blog,
        blogPostLoading,
        setBlogPostLoading,
        read_blog,
        resetFormFromAuth,
        setResetFormFromAuth,
        currentUserInfo,
        delete_blog,
        approve_blog
    } = useAuth();

    const handleDeleteLogo = (clickedId) => {
        // let updatedArray = [];
        for (let i = 0; i < listOfLogos.length; i++) {
            if (!(listOfLogos[i].id === clickedId)) {
                // updatedArray.push(listOfLogos[i]);
                console.log("////: ", clickedId );
            }
        }
        // setListOfLogos(updatedArray);
    };

    useEffect(() => {
        if (currentUserInfo) {
            setCu(currentUserInfo[2]);
        }
    }, [currentUserInfo]);

    const uploadNewLogo = () =>{

    };

    return (
        <main className="mainContainerHome container-12 px-5 about_mc1">
            <div className={"about_innerContainer"}>
                <article>
                    <section className={"row-12"}>
                        <header className={"about_wecome_header py-3 mt-5"}>
                            <h3>{t("about.abh3h1")}</h3>
                        </header>
                        <div className="row-12 ">
                            <p>{t("about.abp1")}</p>
                            <p>{t("about.abp2")}</p>

                            <h5>{t("about.abh5h2")}</h5>
                            <p>{t("about.abp3")}</p>
                            <p>{t("about.abp4")}
                                <a style={{marginLeft: "7px"}}
                                   href={"https://www.facebook.com/SilverLiningIT/"}>facebook</a>
                                <a style={{marginLeft: "7px"}}
                                   href={"https://www.linkedin.com/company/silverlining-it/?viewAsMember=true"}>LinkedIn</a>
                                <a style={{marginLeft: "7px"}}
                                   href={"https://www.instagram.com/silver_lining_it/"}>Insta</a>
                            </p>
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

                        <button hidden={!blogPostLoading || !cu} style={{color: "#a9c0bf"}} onClick={(event) => {
                            event.preventDefault();
                            imgInputRef.current.click();
                        }} type="button" className="btn btn-dark">
                            <input type="file" hidden/>
                            <IconContext.Provider value={{size: "1.5em"}}>
                                <AiFillPicture style={{color: "#a9c0bf", marginRight: "10px"}}/>
                            </IconContext.Provider>
                            {t("about.addNp")}
                        </button>

                        <input
                            ref={imgInputRef}
                            type={"file"}
                            className={"d-none"}
                            multiple={true}
                            accept={"image/*"}
                            onChange={(e) => {
                                const aFile = e.target.files;
                                console.log("////:THE_FILE ", aFile);
                                // let convertedFiles = [];
                                // Object.keys(files).forEach(i => {
                                //     let newFileName = files[i].name;
                                //     let existsInState = false;
                                //     for (let j = 0; j < listOfLogos.length; j++) {
                                //         if (newFileName === listOfLogos[j].file.name) {
                                //             existsInState = true;
                                //             break;
                                //         }
                                //     }
                                //     if (!existsInState) {
                                //         convertedFiles = [...convertedFiles, {
                                //             id: URL.createObjectURL(files[i]),
                                //             file: files[i]
                                //         }];
                                //     }
                                //
                                // });
                                // let filesToBeStaged = [...listOfLogos, ...convertedFiles];
                                // if (filesToBeStaged.length > 0) {
                                //     setListOfLogos(filesToBeStaged);
                                // }
                            }}/>
                        <div className={"smPartLogosListDiv"}>
                            {listOfLogos && listOfLogos.map((file) => {
                                return (
                                    <div className={"ab_overlay-fade"} key={file.id}>
                                        <img
                                            ref={imgRef}
                                            style={{
                                                margin: "20px",
                                            }}
                                            alt={"what"}
                                            src={`${file.id}`}
                                            height={"100px"}/>
                                        <div id={`${file.id}`} className={"overlayIcon"}
                                             onClick={(e) => {
                                                 handleDeleteLogo(e.target.getAttribute('id'));
                                             }}>
                                            <h1 id={`${file.id}`} style={{color: "#ff4500"}}>X</h1>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <hr/>
                <UI_carousel/>
            </div>
        </main>
    );
};
