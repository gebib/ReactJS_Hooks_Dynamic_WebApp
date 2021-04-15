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

import {v4 as uuid} from "uuid";
import {Editor} from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import {ContentState, convertToRaw, EditorState} from "draft-js";
import htmlToDraft from "html-to-draftjs";

//WYSIWYG component
let blogDefaultTextE = `
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
`;

let blogDefaultTextN = `
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
`;
const WysIwyg = (props) => {
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
    const [spellCheck, setSpellCheck] = useState(true);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    // const [editorInited, setShouldInitEditor] = useState(true);

    let editorInited = false;


    const setResetEditorState = () => {
        let contentBlockBlog;
        if (i18n.language === "en") {
            contentBlockBlog = htmlToDraft(blogDefaultTextE);
            setSpellCheck(true);//spell check available for English.
        } else {
            contentBlockBlog = htmlToDraft(blogDefaultTextN);
            setSpellCheck(false);
        }
        if (contentBlockBlog) {
            const contentState = ContentState.createFromBlockArray(
                contentBlockBlog.contentBlocks
            );
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
        }
        // setStagedFiles([]);
    };

    useEffect(() => {
        if (!editorInited) { //init once!
            setResetEditorState();
            editorInited = true;
        }
    }, []);

    useEffect(() => {
        let raw = convertToRaw(editorState.getCurrentContent());
        let htmlTxt = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        // console.log("////:|||||||||", htmlTxt);
        props.handleTXTinput(htmlTxt, raw, props.editedBoxId, props.rightOrLeft);
    }, [editorState]);

    return (
        <div style={{width: "100%", backgroundColor: "#EFF3FA", minHeight: "250px"}}>
            <Editor
                style={{zIndex: "100"}}
                readOnly={blogPostLoading}
                editorStyle={{backgroundColor: "#fdfdfd", zIndex: "100"}}
                toolbarClassName={"mainToolBarWrapper"}
                wrapperClassName={"toolWrapper"}
                editorClassName={"editor"}
                size={"normal"}
                stripPastedStyles={true}
                spellCheck={spellCheck}
                toolbar={{
                    options: ["inline", "textAlign", "fontSize", "fontFamily", "list", "link", "history", "colorPicker", "emoji"],
                    inline: {
                        inDropdown: false,
                        options: ['bold', 'italic', 'underline', 'strikethrough']
                    },
                }}

                editorState={editorState}
                onEditorStateChange={(es) => {
                    // saveTempEditorState("tmpBlogState", draftToHtml(convertToRaw(es.getCurrentContent())));
                    setEditorState(es);
                    // checkShouldPrompt();
                    // isEditorChanged();
                }}/>

        </div>
    );
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////                   /////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
            boxType: "dualDiv", //dualDiv,singleDiv

            rImageUrl: "", //image url
            lImageUrl: "",

            rHtmlTxt: "<p>right html content</p>", //txt html
            lHtmlTxt: "<p>left html content</p>",

            rContentType: "none",//image | text
            lContentType: "none"
        };
    };

    const getNewSingleDiv = (id) => {
        return {
            divId: id,
            boxType: "singleDiv", //dualDiv,singleDiv
            imageUrl: "", //image url
            htmlTxt: "<p>single html content</p>", //txt html
            contentType: "none",//image | text
        };
    };

    let largeCat = "https://www.vets4pets.com/siteassets/species/cat/close-up-of-cat.jpg?w=585&scale=down";
    let smallCat = "https://cdn.pixabay.com/photo/2020/08/09/21/10/cat-5476461__340.jpg";

    // const [pContent, setPContent] = useState([getNewSingleDiv(1), getNewDualDiv(2)]);
    const [pContent, setPContent] = useState([]);

    const imgInputRef = useRef();
    const [isImage, setIsImage] = useState(false);
    const [img, setImg] = useState(false);

    const addNewDiv = (currentBoxId, divType) => {
        let updatedArray = [];
        if (divType === "newSingleDivBtn") {
            if (pContent.length > 0) {
                for (let i = 0; i < pContent.length; i++) {
                    updatedArray.push(pContent[i]);
                    if (Object.values(pContent)[i].divId === currentBoxId) {
                        updatedArray.push(getNewSingleDiv(uuid()));
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

    const saveChangesToDb = () => {
        console.log("////:SAVEtoDb id: ");
    };

    const toggleEditModOnOff = () => {
        console.log("////:toggleEdit id: ");
    };

    const xDeleteDiv = (aBoxId) => {
        let updatedArray = [];
        if (pContent.length > 0) {
            for (let i = 0; i < pContent.length; i++) {
                if (Object.values(pContent)[i].divId !== aBoxId) {
                    updatedArray.push(pContent[i]);
                }
            }
        } else {
            setPContent([getNewDualDiv(uuid())]);
        }
        setPContent(updatedArray);
    };

    useEffect(() => {
        console.log("////:pageContentArraySTATE: ", pContent); //TODO remove when done
    }, [pContent]);

    //insert changes into the specific obj of editing index.
    const handleTXTinput = (htmlData, rawData, editedBoxId, rightOrLeft) => {
        // console.log("////:QLL||||||||||||||||||||||||||:: ", htmlData, " ,,, ", rawData, ",,,", boxId, ",,,,", boxType);
        let updatedArray = [];
        if (pContent.length > 0) {
            for (let i = 0; i < pContent.length; i++) {

                if (Object.values(pContent)[i].divId === editedBoxId) {
                    let cuBox = Object.values(pContent)[i];
                    let cuBoxType = Object.values(pContent)[i].boxType;
                    if (cuBoxType === "singleDiv") {
                        let updatedSingleDiv = {
                            divId: cuBox.divId,
                            boxType: cuBox.boxType,
                            imageUrl: cuBox.imageUrl,
                            htmlTxt: htmlData,
                            contentType: cuBox.contentType
                        };
                        updatedArray.push(updatedSingleDiv);
                    } else if (cuBoxType === "dualDiv") {
                        let updatedDualDiv = {
                            divId: cuBox.divId,
                            boxType: cuBox.boxType,
                            rImageUrl: cuBox.rImageUrl,
                            lImageUrl: cuBox.lImageUrl,
                            rHtmlTxt: (rightOrLeft === "right") ? htmlData : cuBox.rHtmlTxt,
                            lHtmlTxt: (rightOrLeft === "left") ? htmlData : cuBox.lHtmlTxt,
                            rContentType: cuBox.rContentType,
                            lContentType: cuBox.lContentType,
                        };
                        updatedArray.push(updatedDualDiv);
                    }
                } else {
                    updatedArray.push(pContent[i]);
                }
            }
        }
        setPContent(updatedArray);
    };

    const iniSingleWholeDivtToTextBox = (aBoxId) => {
        console.log("////:iniSingleWholeDivtToTextBox");
        let updatedArray = [];
        if (pContent.length > 0) {
            for (let i = 0; i < pContent.length; i++) {
                let cuBox = Object.values(pContent)[i];
                let boxType = Object.values(pContent)[i].boxType;
                if (Object.values(pContent)[i].divId === aBoxId) {
                    if (boxType === "singleDiv") {
                        let updatedSingleDiv = {
                            divId: cuBox.divId,
                            boxType: cuBox.boxType,
                            imageUrl: cuBox.imageUrl,
                            htmlTxt: cuBox.htmlTxt,
                            contentType: "text"
                        };
                        updatedArray.push(updatedSingleDiv);
                    }
                } else {
                    updatedArray.push(pContent[i]);
                }
            }
        }
        setPContent(updatedArray);
    };
    const initLeftOrRightOfDualDivtToTextBox = (aBoxId, rightOrLeft) => {
        let updatedArray = [];
        if (pContent.length > 0) {
            for (let i = 0; i < pContent.length; i++) {
                let cuBox = Object.values(pContent)[i];
                let boxType = Object.values(pContent)[i].boxType;
                if (Object.values(pContent)[i].divId === aBoxId) {

                    let updatedDualDiv = {
                        divId: cuBox.divId,
                        boxType: cuBox.boxType,
                        rImageUrl: cuBox.rImageUrl,
                        lImageUrl: cuBox.lImageUrl,
                        rHtmlTxt: cuBox.rHtmlTxt,
                        lHtmlTxt: cuBox.lHtmlTxt,
                        rContentType: ((rightOrLeft === "right") && (cuBox.rContentType === "none")) ? "text" : cuBox.rContentType,
                        lContentType: ((rightOrLeft === "left") && (cuBox.lContentType === "none")) ? "text" : cuBox.lContentType,
                    };
                    updatedArray.push(updatedDualDiv);
                } else {
                    updatedArray.push(pContent[i]);
                }
            }
        }
        setPContent(updatedArray);
    };


    return (
        <div className={"q_main_div"}>
            <div className={"noContentDiv"}>
                <div className={"innerNoConWrapper"}>
                    <div hidden={(pContent.length > 0)}>
                        <IconContext.Provider value={{size: "2em"}}>
                            <RiAddLine onClick={() => {
                                setPContent([getNewSingleDiv(uuid())]);
                            }} className={"iconBtn"}/>
                        </IconContext.Provider>
                        <IconContext.Provider value={{size: "2em"}}>
                            <MdExposurePlus2 onClick={() => {
                                setPContent([getNewDualDiv(uuid())]);
                            }} className={"iconBtn"}/>
                        </IconContext.Provider>
                    </div>

                    <button onClick={() => {
                        saveChangesToDb();
                    }} type="button" className="btn btn-success mx-1">{t("msl.save")}</button>
                    <button onClick={() => {
                        toggleEditModOnOff();
                    }} type="button" className="btn btn-dark mx-1">{t("msl.edit")}</button>
                </div>
            </div>

            {/*<div style={{ width: "100%", height: "100%" }}>*/}
            {/*    <div ref={quillRef} />*/}
            {/*</div>*/}

            {(pContent.length > 0) && pContent.map((aBox) => {
                if (aBox.boxType === "singleDiv") {
                    return (
                        <div key={aBox.divId} className={"aDivCtrlPanel_single"}>

                            {/*///////////////////////////////////////////////////////////////////*/}
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
                                    <GrFormClose onClick={() => {
                                        xDeleteDiv(aBox.divId);
                                    }} className={"iconBtn clearBtn"}/>
                                </IconContext.Provider>
                            </div>
                            {/*//////////////////////////////////////////////////////////////////*/}


                            <div style={{justifyContent: "center", alignItems: "center"}}
                                 className={"wholeDiv"}>

                                <div hidden={!(aBox.contentType === "text")}>
                                    <WysIwyg rightOrLeft={"center"} editedBoxId={aBox.divId}
                                             handleTXTinput={handleTXTinput}/>
                                </div>

                                <div hidden={!(aBox.contentType === "none")} style={{minHeight: "230px"}}
                                     className={"contentDiv"}>
                                    <IconContext.Provider value={{size: "2em"}}>
                                        <BsPencilSquare onClick={() => {
                                            iniSingleWholeDivtToTextBox(aBox.divId);
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
                            </div>


                        </div>
                    );
                } else if (aBox.boxType === "dualDiv") {
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
                                    <GrFormClose onClick={() => {
                                        xDeleteDiv(aBox.divId);
                                    }} className={"iconBtn clearBtn"}/>
                                </IconContext.Provider>
                            </div>

                            <div className={"dualDiv"}>
                                <div className={"leftDiv"}>
                                    <div hidden={!(aBox.lContentType === "text")}>
                                        <WysIwyg rightOrLeft={"left"} editedBoxId={aBox.divId}
                                                 handleTXTinput={handleTXTinput}/>
                                    </div>
                                    <div hidden={!(aBox.lContentType === "none")} className={"leftTextDiv"}>
                                        <div style={{minHeight: "230px"}} className={"contentDiv"}>
                                            <IconContext.Provider value={{size: "2em"}}>
                                                <BsPencilSquare onClick={() => {
                                                    initLeftOrRightOfDualDivtToTextBox(aBox.divId, "left");
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
                                    <div hidden={!(aBox.rContentType === "text")}>
                                        <WysIwyg rightOrLeft={"right"} editedBoxId={aBox.divId}
                                                 handleTXTinput={handleTXTinput}/>
                                    </div>
                                    <div hidden={!(aBox.rContentType === "none")} className={"rightTextDiv"}>
                                        <div style={{minHeight: "230px"}} className={"contentDiv"}>
                                            <IconContext.Provider value={{size: "2em"}}>
                                                <BsPencilSquare onClick={() => {
                                                    initLeftOrRightOfDualDivtToTextBox(aBox.divId, "right");
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
