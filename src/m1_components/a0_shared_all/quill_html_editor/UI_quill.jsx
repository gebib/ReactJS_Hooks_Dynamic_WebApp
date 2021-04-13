import React, {useEffect, useRef, useState} from "react";
import "./ST_quill.scss";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../c1_auth/a0_auth_common/firebase/AuthContext";
import {IconContext} from "react-icons";
import {GrFormClose} from "react-icons/gr";
import {RiAddLine} from "react-icons/ri";
import {MdExposurePlus2} from "react-icons/md";
import {MdCheck} from "react-icons/md";
import {BsImageFill} from "react-icons/bs";
import {BsPencilSquare} from "react-icons/bs";

import {useQuill} from "react-quilljs";
// or const { useQuill } = require('react-quilljs');

import "quill/dist/quill.snow.css";
import {v4 as uuid} from "uuid";
// or import 'quill/dist/quill.bubble.css'; // Add css for bubble theme


export const UI_quill = () => {
    const {
        create_blog,
        blogPostLoading,
        setBlogPostLoading,
        read_blog,
        resetFormFromAuth,
        setResetFormFromAuth,
        currentUserInfo,
        delete_blog,
        approve_blog,
        isLogDbActivity
    } = useAuth();
    const {t, i18n} = useTranslation("SL_languages");
    const getNewDualDiv = (id) => {
        return {
            divId: id,
            contentType: "image", //image
            divClass: "dualDiv", //dualDiv,singleDiv
            alignY: "flex-start", //center, flex-end
            boxBgColor: "EFF3FA", //#248C9D, #151515,
            divHeight: "auto",

            imgUrl: largeCat,
            htmlContent: `
            <p>Del din inspirerende artikkel, blogg eller tilbakemelding med oss!</p>\n"
            <p>parag2</p>\n
            <p>parag3</p>\n
            `
        };
    };

    const getNewSingleDiv = (id) => {
        return {
            divId: id,
            contentType: "image", //image
            divClass: "singleDiv", //dualDiv,singleDiv
            alignY: "flex-start", //center, flex-end
            boxBgColor: "EFF3FA", //#248C9D, #151515,
            divHeight: "auto",

            imgUrl: largeCat,
            htmlContent: `
            <p>Del din inspirerende artikkel, blogg eller tilbakemelding med oss!</p>\n"
            <p>parag2</p>\n
            <p>parag3</p>\n
            `
        };
    };

    let largeCat = "https://www.vets4pets.com/siteassets/species/cat/close-up-of-cat.jpg?w=585&scale=down";
    let smallCat = "https://cdn.pixabay.com/photo/2020/08/09/21/10/cat-5476461__340.jpg";

    // const [pContent, setPContent] = useState([getNewSingleDiv(1), getNewDualDiv(2)]);
    const [pContent, setPContent] = useState([]);

    const {quill, quillRef} = useQuill();
    const imgInputRef = useRef();

    const [isImage, setIsImage] = useState(false);
    const [img, setImg] = useState(false);

    const addNewDiv = (currentBoxId, divType) => {
        console.log("////:divType: ", divType);
        let updatedArray = [];
        if (divType === "newSingleDivBtn") {
            if (pContent.length > 0) {
                for (let i = 0; i < pContent.length; i++) {
                    updatedArray.push(pContent[i]);
                    if (Object.values(pContent)[i].divId === currentBoxId) {
                        updatedArray.push(getNewSingleDiv(uuid()));
                        console.log("////:PUSH:");
                    }
                }
            } else {
                setPContent([getNewSingleDiv(uuid())]);
            }
        } else if (divType === "newDualDivBtn") {
            if (pContent.length > 0) {
                for (let i = 0; i < pContent.length; i++) {
                    updatedArray.push(pContent[i]);
                    if (Object.values(pContent)[i].divId === currentBoxId) {
                        updatedArray.push(getNewDualDiv(uuid()));
                    }
                }
            } else {
                setPContent([getNewDualDiv(uuid())]);
            }
        }
        setPContent(updatedArray);
    };

    const checkSaveChange = (divId) => {
        console.log("////: SAVE id: ", divId);
    };

    const xDeleteDiv = (divId) => {
        console.log("////: delete");
    };

    useEffect(() => {
        console.log("////:PC: ", pContent); //TODO remove when done
    }, [pContent]);

    return (
        <div className={"q_main_div"}>
            {(pContent.length < 1) &&
            <div className={"noContentDiv"}>
                <div className={"innerNoConWrapper"}>
                    <IconContext.Provider value={{size: "2em"}}>
                        <RiAddLine onClick={() => {
                            // addNewDiv(getNewSingleDiv(uuid()), "newSingleDivBtn");
                            setPContent([getNewSingleDiv(uuid())]);
                        }} className={"iconBtn"}/>
                    </IconContext.Provider>
                    <IconContext.Provider value={{size: "2em"}}>
                        <MdExposurePlus2 onClick={() => {
                            // addNewDiv(getNewDualDiv(uuid()), "newDualDivBtn");
                            setPContent([getNewDualDiv(uuid())]);
                        }} className={"iconBtn"}/>
                    </IconContext.Provider>
                </div>
            </div>
            }
            {(pContent.length > 0) && pContent.map((aBox) => {
                if (aBox.divClass === "singleDiv") {
                    return (
                        <div key={aBox.divId} className={"aDivCtrlPanel_single"}>
                            <div className={"ctrlPanel"}>
                                <IconContext.Provider value={{size: "2em"}}>
                                    <RiAddLine onClick={() => {
                                        addNewDiv(aBox.divId, "newSingleDivBtn");
                                    }} className={"iconBtn"}/>
                                </IconContext.Provider>
                                <IconContext.Provider value={{size: "2em"}}>
                                    <MdExposurePlus2 onClick={() => {
                                        addNewDiv(aBox.divId, "newDualDivBtn");
                                    }} className={"iconBtn"}/>
                                </IconContext.Provider>
                                <IconContext.Provider value={{size: "2em"}}>
                                    <MdCheck onClick={() => {
                                        checkSaveChange(aBox.divId);
                                    }} className={"okBtn iconBtn"}/>
                                </IconContext.Provider>
                                <IconContext.Provider value={{size: "2em"}}>
                                    <GrFormClose onClick={() => {
                                        xDeleteDiv(aBox.divId);
                                    }} className={"iconBtn clearBtn"}/>
                                </IconContext.Provider>
                            </div>

                            <div style={{justifyContent: "center", alignItems: "center", minHeight: aBox.divHeight}}
                                 className={"wholeDiv"} key={aBox.divId}>


                                {/*<div style={{ width: "100%", height: "100%" }}>*/}
                                {/*    <div ref={quillRef} />*/}
                                {/*</div>*/}


                                <div className={"chooseContentDiv"}>
                                    <IconContext.Provider value={{size: "2em"}}>
                                        <BsPencilSquare onClick={() => {
                                            //TODO is a text div
                                            console.log("////: add text");
                                        }} className={"contentChooseBtn"}/>
                                    </IconContext.Provider>
                                    <IconContext.Provider value={{size: "2em"}}>
                                        <BsImageFill onClick={(event) => {
                                            event.preventDefault();
                                            imgInputRef.current.click();
                                            console.log("////: add image");
                                        }} className={"contentChooseBtn"}/>
                                    </IconContext.Provider>
                                    <input
                                        ref={imgInputRef}
                                        type={"file"}
                                        className={"d-none"}
                                        // multiple={true}
                                        accept={"image/*"}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            const aFile = e.target.files[0];
                                            // uploadNewLogo(aFile);
                                            //    TODO upload?
                                            console.log("////:IMG: ", aFile);
                                            if (aFile.length > 0) {
                                                setIsImage(true);
                                            }
                                        }}/>
                                </div>

                                {/*<img hidden={(!setIsImage)} alt={"what"} src={img && img} height={"500px"}/>*/}
                                {/*<div style={{textAlign: "right"}} className={"wholeDiv_textDiv"}>*/}
                                {/*    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci amet explicabo id suscipit. Amet autem beatae corporis dolores doloribus eaque explicabo facilis fuga laudantium pariatur perspiciatis, placeat porro quam qui quia quisquam voluptates? Commodi fuga id maxime, molestiae mollitia nam quos reprehenderit voluptatibus! Adipisci alias asperiores beatae consequatur culpa deserunt doloremque doloribus ea esse id illo inventore ipsam iure laudantium magni maxime nemo non optio praesentium quia quibusdam rem repellat, saepe sed sit soluta tempore unde vel velit vero? Ab accusamus aspernatur at beatae dicta dignissimos distinctio doloremque doloribus enim error est id ipsam laudantium nam non, quas quibusdam ratione sed similique sint soluta, sunt unde vel? Fugit, numquam, voluptatem! Ab adipisci aliquid debitis delectus deserunt dolores dolorum ea earum eius, est, et eveniet expedita facere harum hic inventore iure laboriosam magnam natus nemo neque nisi, numquam officiis porro quasi quia quidem quis rem reprehenderit rerum similique suscipit tempore temporibus? Adipisci cumque, ea facere qui tenetur unde. A animi facere fuga id laudantium non rerum ut voluptatibus. Accusamus ea eum hic inventore ipsum optio quasi reprehenderit voluptatum! Autem beatae dolorem doloremque ea eaque, et facere incidunt inventore maiores, nostrum perferendis quae quidem ratione reprehenderit saepe similique suscipit tempore unde veritatis!*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    );
                } else if (aBox.divClass === "dualDiv") {
                    return (
                        <div key={aBox.divId} className={"aDivCtrlPanel_dual"}>
                            <div className={"ctrlPanel"}>
                                <IconContext.Provider value={{size: "2em"}}>
                                    <RiAddLine onClick={() => {
                                        addNewDiv(aBox.divId, "newSingleDivBtn");
                                    }} className={"iconBtn"}/>
                                </IconContext.Provider>
                                <IconContext.Provider value={{size: "2em"}}>
                                    <MdExposurePlus2 onClick={() => {
                                        addNewDiv(aBox.divId, "newDualDivBtn");
                                    }} className={"iconBtn"}/>
                                </IconContext.Provider>
                                <IconContext.Provider value={{size: "2em"}}>
                                    <MdCheck onClick={() => {
                                        checkSaveChange(aBox.divId);
                                    }} className={"okBtn iconBtn"}/>
                                </IconContext.Provider>
                                <IconContext.Provider value={{size: "2em"}}>
                                    <GrFormClose onClick={() => {
                                        xDeleteDiv(aBox.divId);
                                    }} className={"iconBtn clearBtn"}/>
                                </IconContext.Provider>
                            </div>

                            <div style={{height: aBox.divHeight}} className={"dualDiv"}>

                                <div className={"leftDiv"}>


                                    <div className={"leftTextDiv"}>
                                        <div className={"chooseContentDiv"}>
                                            <IconContext.Provider value={{size: "2em"}}>
                                                <BsPencilSquare onClick={() => {
                                                    //TODO is a text div
                                                    console.log("////: add text");
                                                }} className={"contentChooseBtn"}/>
                                            </IconContext.Provider>
                                            <IconContext.Provider value={{size: "2em"}}>
                                                <BsImageFill onClick={() => {
                                                    //TODO is an image div
                                                    console.log("////: add image");
                                                }} className={"contentChooseBtn"}/>
                                            </IconContext.Provider>
                                        </div>
                                    </div>
                                </div>

                                <div className={"rightDiv"}>
                                    <div className={"rightTextDiv"}>
                                        <div className={"chooseContentDiv"}>
                                            <IconContext.Provider value={{size: "2em"}}>
                                                <BsPencilSquare onClick={() => {
                                                    //TODO is a text div
                                                    console.log("////: add text");
                                                }} className={"contentChooseBtn"}/>
                                            </IconContext.Provider>
                                            <IconContext.Provider value={{size: "2em"}}>
                                                <BsImageFill onClick={() => {
                                                    //TODO is an image div
                                                    console.log("////: add image");
                                                }} className={"contentChooseBtn"}/>
                                            </IconContext.Provider>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    );
                }
            })}
        </div>
    );
};
