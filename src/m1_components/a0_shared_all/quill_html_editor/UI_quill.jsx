import React, {useEffect, useReducer, useRef, useState} from "react";
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
<!--<p></p>-->
<!--<p></p>-->
<!--<p></p>-->
<!--<p></p>-->
<!--<p></p>-->
`;

let blogDefaultTextN = `
<!--<p></p>-->
<!--<p></p>-->
<!--<p></p>-->
<!--<p></p>-->
<!--<p></p>-->
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
        props.handleTXTinput(htmlTxt, raw, props.aBox, props.rightOrLeft);
    }, [editorState]);

    return (
        <div style={{width: "100%", backgroundColor: "#EFF3FA"}}>
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
//common input element
export const ImageInput = (props) => {
    const anInputRef = useRef();
    useEffect(() => {
        props.updateElementRefInBoxObj(anInputRef, props.theBox, props.righOrLeft);
    }, [/*deps*/]);

    return (
        <div>
            <input
                ref={anInputRef}
                type={"file"}
                className={"d-none"}
                // multiple={true}
                accept={"image/*"}
                onChange={(e) => {
                    e.preventDefault();
                    const aFile = e.target.files[0];
                    if (e.target.files.length > 0) {
                        props.updateImageAndBoxContentType(e, props.theBox, props.righOrLeft);
                    }
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

                rImageFile: "", //image url
                lImageFile: "",

                rHtmlTxt: "<p>right html content</p>", //txt html
                lHtmlTxt: "<p>left html content</p>",

                rContentType: "none",//image | text
                lContentType: "none",

                rInputRef: null, //useRef objects input reference.
                lInputRef: null
            };
        };

        const getNewSingleDiv = (id) => {
            return {
                divId: id,
                boxType: "singleDiv", //dualDiv,singleDiv
                imgFile: "", //image url
                htmlTxt: "<p>single html content</p>", //txt html
                contentType: "none",//image | text
                inputRef: null
            };
        };

        let largeCat = "https://www.vets4pets.com/siteassets/species/cat/close-up-of-cat.jpg?w=585&scale=down";
        let smallCat = "https://cdn.pixabay.com/photo/2020/08/09/21/10/cat-5476461__340.jpg";

        // const [pContent, setPContent] = useState([getNewSingleDiv(1), getNewDualDiv(2)]);
        const [pContent, setPContent] = useState([]);
        //for update component on demand.
        const [, forceUpdate] = useReducer(x => x + 1, 0);


        const addNewBox = (currentBoxId, boxType) => {
            let updatedArray = [];
            if (boxType === "newSingle") {
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
            } else if (boxType === "newDual") {
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

        //just leave the box out.
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

        //insert changes into the specific obj of editing index.
        const handleTXTinput = (htmlData, rawData, aBox, rightOrLeft) => {
            //rawData.blocks[0].text.length
            if (aBox.boxType === "singleDiv") {
                aBox.htmlTxt = htmlData;
            } else if (aBox.boxType === "dualDiv") {
                if (rightOrLeft === "right") {
                    aBox.rHtmlTxt = htmlData;
                } else if (rightOrLeft === "left") {
                    aBox.lHtmlTxt = htmlData;
                }
            }
        };

        const setAboxContentTypeToText = (aBox, rightOrLeft) => {
            if (aBox.boxType === "singleDiv") {
                aBox.contentType = "text";
            } else if (aBox.boxType === "dualDiv") {
                if (rightOrLeft === "right") {
                    aBox.rContentType = "text";
                } else if (rightOrLeft === "left") {
                    aBox.lContentType = "text";
                }
            }
            forceUpdate();
        };

        const updateImageAndBoxContentType = (e, aBox, rightOrLeft) => {
            const imgFile = e.target.files[0];
            if (aBox.boxType === "singleDiv") {
                aBox.contentType = "image";
                aBox.imgFile = URL.createObjectURL(imgFile);
            } else if (aBox.boxType === "dualDiv") {
                if (rightOrLeft === "right") {
                    aBox.rContentType = "image";
                    aBox.rImageFile = URL.createObjectURL(imgFile);
                } else if (rightOrLeft === "left") {
                    aBox.lContentType = "image";
                    aBox.lImageFile = URL.createObjectURL(imgFile);
                }
            }
            forceUpdate();
        };

        const setDualLeftOrRightDivImage = (e, boxId) => {
            const imgFile = e.target.files;
        };

        const updateElementRefInBoxObj = (inputRef, aBox, rightOrLeft) => {
            if (aBox.boxType === "singleDiv") {
                aBox.inputRef = inputRef;
            } else if (aBox.boxType === "dualDiv") {
                if (rightOrLeft === "right") {
                    aBox.rInputRef = inputRef;
                } else if (rightOrLeft === "left") {
                    aBox.lInputRef = inputRef;
                }
            }
            forceUpdate();
        };


        useEffect(() => {
            console.log("////:pageContentArraySTATE: ", pContent); //TODO remove when done
        }, [pContent]);


        return (
            <div className={"q_main_div"}>
                {console.log("////:________RRRRR_______________")}
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
                                {/*/////////////////////////////CTRL single//////////////////////////////////////*/}
                                <div className={"ctrlPanel"}>
                                    <IconContext.Provider value={{size: "2em"}}>
                                        <RiAddLine onClick={() => {
                                            addNewBox(aBox.divId, "newSingle");
                                        }} className={"iconBtn"}/>
                                    </IconContext.Provider>
                                    <IconContext.Provider value={{size: "2em"}}>
                                        <MdExposurePlus2 onClick={() => {
                                            addNewBox(aBox.divId, "newDual");
                                        }} className={"iconBtn"}/>
                                    </IconContext.Provider>
                                    <IconContext.Provider value={{size: "2em"}}>
                                        <GrFormClose onClick={() => {
                                            xDeleteDiv(aBox.divId);
                                        }} className={"iconBtn clearBtn"}/>
                                    </IconContext.Provider>
                                </div>
                                {/*/////////////////////////////////////////////////////////////////////////////*/}


                                <div className={"wholeDiv"}>
                                    <div style={{minWidth: "100%"}} hidden={!(aBox.contentType === "text")}>
                                        <WysIwyg  rightOrLeft={"center"} aBox={aBox}
                                                 handleTXTinput={handleTXTinput}/>
                                    </div>
                                    <div className={"imageWrapper"}  hidden={!(aBox.contentType === "image")}>
                                        {/*<div className={"imgCtrl"}>*/}
                                        {/*   sadf*/}
                                        {/*</div>*/}
                                        <img hidden={!(aBox.contentType === "image")} className={"aPageImageSelf"}
                                             src={aBox.imgFile} alt={"image belonging to a page"}/>
                                        <ImageInput righOrLeft={"center"}
                                                    updateImageAndBoxContentType={updateImageAndBoxContentType}
                                                    theBox={aBox}
                                                    updateElementRefInBoxObj={updateElementRefInBoxObj}/>
                                    </div>
                                    <div hidden={!(aBox.contentType === "none")}
                                         className={"contentDiv"}>
                                        <IconContext.Provider value={{size: "2em"}}>
                                            <BsPencilSquare onClick={() => {
                                                setAboxContentTypeToText(aBox, "center");
                                            }} className={"contentChooseBtn"}/>
                                        </IconContext.Provider>
                                        <IconContext.Provider value={{size: "2em"}}>
                                            <BsImageFill onClick={(event) => {
                                                event.preventDefault();
                                                aBox.inputRef.current.click();
                                            }} className={"contentChooseBtn"}/>
                                        </IconContext.Provider>
                                    </div>
                                </div>
                            </div>
                        );
                    } else if (aBox.boxType === "dualDiv") {
                        return (
                            <div key={aBox.divId} className={"aDivCtrlPanel_dual"}>
                                {/*/////////////////////////////CTRL dual//////////////////////////////////////*/}
                                <div className={"ctrlPanel"}>
                                    <IconContext.Provider value={{size: "2em"}}>
                                        <RiAddLine onClick={() => {
                                            addNewBox(aBox.divId, "newSingle");
                                        }} className={"iconBtn"}/>
                                    </IconContext.Provider>
                                    <IconContext.Provider value={{size: "2em"}}>
                                        <MdExposurePlus2 onClick={() => {
                                            addNewBox(aBox.divId, "newDual");
                                        }} className={"iconBtn"}/>
                                    </IconContext.Provider>
                                    <IconContext.Provider value={{size: "2em"}}>
                                        <GrFormClose onClick={() => {
                                            xDeleteDiv(aBox.divId);
                                        }} className={"iconBtn clearBtn"}/>
                                    </IconContext.Provider>
                                </div>
                                {/*//////////////////////////////////////////////////////////////////////////////*/}

                                <div className={"dualDiv"}>
                                    <div className={"leftDiv"}>
                                        <div hidden={!(aBox.lContentType === "text")}>
                                            <WysIwyg rightOrLeft={"left"} aBox={aBox}
                                                     handleTXTinput={handleTXTinput}/>
                                        </div>
                                        <div className={"imageWrapper"} hidden={!(aBox.lContentType === "image")}>
                                            {/*<div className={"imgCtrl"}>*/}
                                            {/*   sadf*/}
                                            {/*</div>*/}
                                            <img hidden={!(aBox.lContentType === "image")} className={"aPageImageSelf"}
                                                 src={aBox.lImageFile} alt={"image belonging to a page"}/>
                                            <ImageInput righOrLeft={"left"}
                                                        updateImageAndBoxContentType={updateImageAndBoxContentType}
                                                        theBox={aBox}
                                                        updateElementRefInBoxObj={updateElementRefInBoxObj}/>
                                        </div>
                                        <div hidden={!(aBox.lContentType === "none")} className={"leftTextDiv"}>
                                            <div className={"contentDiv"}>
                                                <IconContext.Provider value={{size: "2em"}}>
                                                    <BsPencilSquare onClick={() => {
                                                        setAboxContentTypeToText(aBox, "left");
                                                    }} className={"contentChooseBtn"}/>
                                                </IconContext.Provider>
                                                <IconContext.Provider value={{size: "2em"}}>
                                                    <BsImageFill onClick={(event) => {
                                                        event.preventDefault();
                                                        aBox.lInputRef.current.click();
                                                    }} className={"contentChooseBtn"}/>
                                                </IconContext.Provider>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"rightDiv"}>
                                        <div hidden={!(aBox.rContentType === "text")}>
                                            <WysIwyg rightOrLeft={"right"} aBox={aBox}
                                                     handleTXTinput={handleTXTinput}/>
                                        </div>
                                        <div className={"imageWrapper"} hidden={!(aBox.rContentType === "image")}>
                                            {/*<div className={"imgCtrl"}>*/}
                                            {/*   sadf*/}
                                            {/*</div>*/}
                                            <img hidden={!(aBox.rContentType === "image")} className={"aPageImageSelf"}
                                                 src={aBox.rImageFile} alt={"image belonging to a page"}/>
                                            <ImageInput righOrLeft={"right"}
                                                        updateImageAndBoxContentType={updateImageAndBoxContentType}
                                                        theBox={aBox}
                                                        updateElementRefInBoxObj={updateElementRefInBoxObj}/>
                                        </div>
                                        <div hidden={!(aBox.rContentType === "none")} className={"rightTextDiv"}>
                                            <div className={"contentDiv"}>
                                                <IconContext.Provider value={{size: "2em"}}>
                                                    <BsPencilSquare onClick={() => {
                                                        setAboxContentTypeToText(aBox, "right");
                                                    }} className={"contentChooseBtn"}/>
                                                </IconContext.Provider>
                                                <IconContext.Provider value={{size: "2em"}}>
                                                    <BsImageFill onClick={(event) => {
                                                        event.preventDefault();
                                                        aBox.rInputRef.current.click();
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
    }
;
