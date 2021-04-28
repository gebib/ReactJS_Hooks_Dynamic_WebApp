import React, {useEffect, useReducer, useRef, useState} from "react";
import "./ST_quill.scss";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../c1_auth/a0_auth_common/firebase/AuthContext";
import {IconContext} from "react-icons";
import {AiTwotoneEdit} from "react-icons/ai";

import {GrFormClose} from "react-icons/gr";
import {RiAddLine} from "react-icons/ri";
import {MdExposurePlus2} from "react-icons/md";
import {MdCheck} from "react-icons/md";
import {BsImageFill} from "react-icons/bs";
import {BsPencilSquare} from "react-icons/bs";
import {ImEye} from "react-icons/im";
import {FaCloudUploadAlt} from "react-icons/fa";


import {v4 as uuid} from "uuid";
import {Editor} from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import {ContentState, convertToRaw, EditorState} from "draft-js";
import htmlToDraft from "html-to-draftjs";
import {AiOutlineArrowLeft} from "react-icons/ai";
import DOMPurify from "dompurify";
import {showToast} from "../../../UI_Main_pages_wrapper";


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
        currentUserInfo,
        updateOrSetApageData,
        isPageUpdateLoading
    } = useAuth();

    const {t, i18n} = useTranslation("SL_languages");
    const [spellCheck, setSpellCheck] = useState(true);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    // const [editorInited, setShouldInitEditor] = useState(true);

    let editorInited = false;


    const setResetEditorState = () => {
        let contentBlockBlog;
        if (props.editorTextHtmlData.length > 0) {
            blogDefaultTextE = props.editorTextHtmlData;
            blogDefaultTextN = props.editorTextHtmlData;
        }
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
                readOnly={isPageUpdateLoading}
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const UI_quill = (props) => {
    const {
        currentUserInfo,
        updateOrSetApageData,
        isPageUpdateLoading,
        updateApageEditInDB,
        getApageData
    } = useAuth();

    const {t, i18n} = useTranslation("SL_languages");

    const getNewDualDiv = (id) => {
        return {
            divId: id,
            boxType: "dualDiv", //dualDiv,singleDiv

            rImageFilePrev: "", //image url
            lImageFilePrev: "",

            rImageFile: "", //image url
            lImageFile: "",

            rImageDbUrl: "",
            lImageDbUrl: "",

            rHtmlTxt: "<p/>", //txt html
            lHtmlTxt: "<p/>",

            rContentType: "none",//image | text
            lContentType: "none",

            rInputRef: null, //useRef objects input reference.
            lInputRef: null,

            lDynamicSliderValue: "auto",
            lMaxImageDivHeight: "auto",

            rDynamicSliderValue: "auto",
            rMaxImageDivHeight: "auto"
        };
    };

    const getNewSingleDiv = (id) => {
        return {
            divId: id,
            boxType: "singleDiv", //dualDiv,singleDiv
            imgFilePrev: "", //image url
            imgFile: "", //to be uploaded when editing
            imageDbUrl: "", //filled inn at updating/posting.
            htmlTxt: "<p/>", //txt html
            contentType: "none",//image | text
            inputRef: null,
            dynamicSliderValue: "auto",
            maxImageDivHeight: "auto"
        };
    };

    const [pContent, setPContent] = useState([]);
    const [pContentFromDb, setPContentFromDb] = useState([]);
    //for update component on demand.
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [viewMode, setViewMode] = useState("RENDER"); //RENDER, EDIT, PREVIEW

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
        if (pContent.length > 0) {
            updateApageEditInDB(props.editablePageName, pContent);
        } else {
            showToast(t("msl.noCt"));
        }
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

    //initiate/update
    const updateImageAndBoxContentType = (e, aBox, rightOrLeft) => {
        const singleDivFullWidth = 1344; //pixel
        const dualDivLeftOrRightWidth = 672; //pixel right or left container
        const imgFile = e.target.files[0];
        let imgUrl = URL.createObjectURL(imgFile);

        let img = new Image();
        img.src = imgUrl;
        img.onload = () => {
            let imageWidth = img.width;
            let imageHeight = img.height;


            // setMaxImageDivHeigh(newWholeHeightInPixel);
            // setDynamicSliderValue(newWholeHeightInPixel);
            if (aBox.boxType === "singleDiv") {
                //single div
                let newWholeHeightInPixel = 0;
                if (imageWidth > singleDivFullWidth) {
                    let singleDivWidthOverflowInPercent = (imageWidth - singleDivFullWidth) / (imageWidth / 100);
                    newWholeHeightInPixel = (imageHeight - ((imageHeight / 100) * singleDivWidthOverflowInPercent));
                } else {
                    newWholeHeightInPixel = imageHeight;
                }
                aBox.contentType = "image";
                aBox.imgFilePrev = URL.createObjectURL(imgFile);
                aBox.imgFile = imgFile;
                aBox.dynamicSliderValue = newWholeHeightInPixel;
                aBox.maxImageDivHeight = newWholeHeightInPixel;
            } else if (aBox.boxType === "dualDiv") {
                let newDualDivHeightInPixel = 0;
                if (imageWidth > dualDivLeftOrRightWidth) {
                    let singleDivWidthOverflowInPercent = (imageWidth - dualDivLeftOrRightWidth) / (imageWidth / 100);
                    newDualDivHeightInPixel = (imageHeight - ((imageHeight / 100) * singleDivWidthOverflowInPercent));
                } else {
                    newDualDivHeightInPixel = imageHeight;
                }
                if (rightOrLeft === "right") {
                    aBox.rContentType = "image";
                    aBox.rImageFilePrev = URL.createObjectURL(imgFile);
                    aBox.rImageFile = imgFile;
                    aBox.rDynamicSliderValue = newDualDivHeightInPixel;
                    aBox.rMaxImageDivHeight = newDualDivHeightInPixel;
                } else if (rightOrLeft === "left") {
                    aBox.lContentType = "image";
                    aBox.lImageFilePrev = URL.createObjectURL(imgFile);
                    aBox.lImageFile = imgFile;
                    aBox.lDynamicSliderValue = newDualDivHeightInPixel;
                    aBox.lMaxImageDivHeight = newDualDivHeightInPixel;
                }
            }
            forceUpdate();
        };
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

//fetch a page data from db
    useEffect(() => {
        getApageData(props.editablePageName).then((sn) => {
            if (sn.val()) {
                console.log("////:Fetch HOME: ", sn.val());
                setPContentFromDb(sn.val());
            }
        }).catch((e) => {
            console.log("////:e ", e);
        });
    }, []);

    useEffect(() => {
        console.log("////:pContentFromDb state: ", pContentFromDb);
    }, [pContentFromDb]); //TODO remove when done!

    const buildEditableMode = () => {
        pContentFromDb.forEach((aBoxFromDb) => {
            if (aBoxFromDb.boxType === "singleDiv") {
                if (aBoxFromDb.contentType === "image") {
                    aBoxFromDb.imgFilePrev = aBoxFromDb.imageDbUrl;
                }
            } else if (aBoxFromDb.boxType === "dualDiv") {
                if (aBoxFromDb.lContentType === "image") {
                    aBoxFromDb.lImageFilePrev = aBoxFromDb.lImageDbUrl;
                }
                if (aBoxFromDb.rContentType === "image") {
                    aBoxFromDb.rImageFilePrev = aBoxFromDb.rImageDbUrl;
                }
            }
        });
        setPContent(pContentFromDb);
        setViewMode("EDIT");
    };

    return (
        <div className={"q_main_div"}>
            {/*//////////////////////EDIT VIEW///////////////////////////*/}
            {console.log("////:_______________________RENDER")}
            <div hidden={!(viewMode === "EDIT")} className={"editWrapper"}>
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
                        }} type="button" id={"saveChangeBtn"} className="btn btn-success mx-1">
                            <IconContext.Provider value={{size: "2em"}}>
                                <FaCloudUploadAlt/>
                            </IconContext.Provider>
                            <span
                                hidden={!isPageUpdateLoading}
                                className="spinner-border mx-1 text-info spinner-border-sm" role="status"
                                aria-hidden="true"/>
                        </button>
                        <button onClick={() => {
                            setViewMode("PREVIEW");
                        }} type="button" className="btn btn-info mx-1">
                            <IconContext.Provider value={{size: "2em"}}>
                                <ImEye/>
                            </IconContext.Provider>
                        </button>
                    </div>
                </div>

                {(pContent.length > 0) && pContent.map((aBox) => {
                    if (aBox.boxType === "singleDiv") {
                        return (
                            <div key={aBox.divId} className={"aDivCtrlPanel_single"}>
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
                                {/*___________________________________________________________________*/}

                                <div style={{height: aBox.dynamicSliderValue + "px"}} className={"wholeDiv"}>
                                    <div style={{minWidth: "100%"}} hidden={!(aBox.contentType === "text")}>
                                        <WysIwyg
                                            editorTextHtmlData={aBox.htmlTxt}//_____________________________________________________________
                                            rightOrLeft={"center"} aBox={aBox}
                                            handleTXTinput={handleTXTinput}/>
                                    </div>

                                    <div className={"imageWrapper"} hidden={!(aBox.contentType === "image")}>
                                        <div className={"imgCtrl"}>
                                            <label htmlFor="customRange1" className="form-label"/>
                                            <input onChange={(e) => {
                                                // setDynamicSliderValue(e.target.value);
                                                aBox.dynamicSliderValue = e.target.value;
                                                forceUpdate();
                                            }} type="range" className="form-range" id="customRange1"
                                                   min={50}
                                                   value={aBox.dynamicSliderValue}
                                                   max={aBox.maxImageDivHeight}/>
                                        </div>
                                        <img style={{maxWidth: "100%", maxHeight: "100%"}}
                                             hidden={!(aBox.contentType === "image")} className={"aPageImageSelf"}
                                             src={aBox.imgFilePrev} alt={"image belonging to a page"}/>
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
                                    <div style={{height: aBox.lDynamicSliderValue + "px"}} className={"leftDiv"}>
                                        <div hidden={!(aBox.lContentType === "text")}>
                                            <WysIwyg
                                                editorTextHtmlData={aBox.lHtmlTxt}//_____________________________________________________________
                                                rightOrLeft={"left"} aBox={aBox}
                                                handleTXTinput={handleTXTinput}/>
                                        </div>
                                        <div className={"imageWrapper"}
                                             style={{height: aBox.lDynamicSliderValue + "px"}}
                                             hidden={!(aBox.lContentType === "image")}>
                                            <div className={"imgCtrl"}>
                                                <label htmlFor="customRange1" className="form-label"/>
                                                <input onChange={(e) => {
                                                    aBox.lDynamicSliderValue = e.target.value;
                                                    forceUpdate();
                                                }} type="range" className="form-range" id="customRange1"
                                                       min={50}
                                                       value={aBox.lDynamicSliderValue}
                                                       max={aBox.lMaxImageDivHeight}/>
                                            </div>
                                            <img style={{maxWidth: "100%"}}
                                                 hidden={!(aBox.lContentType === "image")}
                                                 className={"aPageImageSelf"}
                                                 src={aBox.lImageFilePrev} alt={"image belonging to a page"}/>
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
                                    <div style={{height: aBox.rDynamicSliderValue + "px"}} className={"rightDiv"}>
                                        <div hidden={!(aBox.rContentType === "text")}>
                                            <WysIwyg
                                                editorTextHtmlData={aBox.rHtmlTxt}//_____________________________________________________________
                                                rightOrLeft={"right"} aBox={aBox}
                                                handleTXTinput={handleTXTinput}/>
                                        </div>
                                        <div className={"imageWrapper"}
                                             style={{height: aBox.rDynamicSliderValue + "px"}}
                                             hidden={!(aBox.rContentType === "image")}>
                                            <div className={"imgCtrl"}>
                                                <label htmlFor="customRange1" className="form-label"/>
                                                <input onChange={(e) => {
                                                    aBox.rDynamicSliderValue = e.target.value;
                                                    forceUpdate();
                                                }} type="range" className="form-range" id="customRange1"
                                                       min={50}
                                                       value={aBox.rDynamicSliderValue}
                                                       max={aBox.rMaxImageDivHeight}/>
                                            </div>
                                            <img style={{maxWidth: "100%"}}
                                                 hidden={!(aBox.rContentType === "image")}
                                                 className={"aPageImageSelf"}
                                                 src={aBox.rImageFilePrev} alt={"image belonging to a page"}/>
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
            {/*//////////////////////PREVIEW///////////////////////////*/}
            <div hidden={!(viewMode === "PREVIEW")} className={"previewWrapper"}>
                <div className={"noContentDiv"}>
                    <div className={"innerNoConWrapper"}>
                        <button onClick={() => {
                            setViewMode("EDIT");
                        }} type="button" className="btn btn-warning mx-1">
                            <IconContext.Provider value={{size: "2em"}}>
                                <AiOutlineArrowLeft/>
                            </IconContext.Provider>
                        </button>
                    </div>
                </div>
                {/*___________________________________*/}
                {(pContent.length > 0) && pContent.map((aBoxPrev) => {
                    if (aBoxPrev.boxType === "singleDiv") {
                        return (
                            <div key={aBoxPrev.divId} className={"aDivCtrlPanel_singlePrev"}>
                                {(aBoxPrev.imgFilePrev === "") ?
                                    <div className={"textViewerDivPrev p-4"} dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(aBoxPrev.htmlTxt),
                                    }}>
                                    </div> :
                                    <div className={"imageViewerDiv"}>
                                        <div>
                                            <img
                                                style={{
                                                    maxHeight: aBoxPrev.dynamicSliderValue + "px",
                                                    maxWidth: "100%"
                                                }} src={aBoxPrev.imgFilePrev}
                                                alt={"article page image"}/>
                                        </div>
                                    </div>}
                            </div>
                        );
                    } else if (aBoxPrev.boxType === "dualDiv") {
                        return (
                            <div key={aBoxPrev.divId} className={"aDivCtrlPanel_dualPrev"}>
                                <div className={"leftPrev"}>
                                    {(aBoxPrev.lImageFilePrev === "") ?
                                        <div className={"textViewerDivPrev p-4"} dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(aBoxPrev.lHtmlTxt),
                                        }}>
                                        </div> :
                                        <div className={"imageViewerDiv"}>
                                            <div>
                                                <img
                                                    style={{
                                                        maxHeight: aBoxPrev.lDynamicSliderValue + "px",
                                                        maxWidth: "100%"
                                                    }} src={aBoxPrev.lImageFilePrev}
                                                    alt={"article page image"}/>
                                            </div>
                                        </div>}
                                </div>
                                <div className={"rightPrev"}>
                                    {(aBoxPrev.rImageFilePrev === "") ?
                                        <div className={"textViewerDivPrev p-4"} dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(aBoxPrev.rHtmlTxt),
                                        }}>
                                        </div> :
                                        <div
                                            className={"imageViewerDiv"}>
                                            <img
                                                style={{
                                                    maxHeight: aBoxPrev.rDynamicSliderValue + "px",
                                                    maxWidth: "100%"
                                                }} src={aBoxPrev.rImageFilePrev}
                                                alt={"article page image"}/>
                                        </div>}
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
            {/*//////////////////////RENDER///////////////////////////*/}
            <div hidden={!(viewMode === "RENDER")} className={"renderWrapper"}>
                <div className={"noContentDiv"}>
                    <div className={"innerNoConWrapper"}>
                        <button onClick={() => {
                            if (pContentFromDb.length < 1) {
                                setViewMode("EDIT");
                            } else {
                                buildEditableMode();
                            }
                        }} type="button" className="btn btn-primary mx-1">
                            <IconContext.Provider value={{size: "2em"}}>
                                <AiTwotoneEdit/>
                            </IconContext.Provider>
                        </button>
                    </div>
                </div>
                {/*___________________________________*/}
                {(pContentFromDb.length > 0) && pContentFromDb.map((aBoxRender) => {
                    if (aBoxRender.boxType === "singleDiv") {
                        return (
                            <div key={aBoxRender.divId} className={"aDivCtrlPanel_singlePrev"}>
                                {(aBoxRender.imageDbUrl === "") ?
                                    <div className={"textViewerDivPrev p-4"} dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(aBoxRender.htmlTxt),
                                    }}>
                                    </div> :
                                    <div className={"imageViewerDiv"}>
                                        <div>
                                            <img
                                                style={{
                                                    maxHeight: aBoxRender.dynamicSliderValue + "px",
                                                    maxWidth: "100%"
                                                }} src={aBoxRender.imageDbUrl}
                                                alt={"article page image"}/>
                                        </div>
                                    </div>}
                            </div>
                        );
                    } else if (aBoxRender.boxType === "dualDiv") {
                        return (
                            <div key={aBoxRender.divId} className={"aDivCtrlPanel_dualPrev"}>
                                <div className={"leftPrev"}>
                                    {(aBoxRender.lImageDbUrl === "") ?
                                        <div className={"textViewerDivPrev p-4"} dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(aBoxRender.lHtmlTxt),
                                        }}>
                                        </div> :
                                        <div className={"imageViewerDiv"}>
                                            <div>
                                                <img
                                                    style={{
                                                        maxHeight: aBoxRender.lDynamicSliderValue + "px",
                                                        maxWidth: "100%"
                                                    }} src={aBoxRender.lImageDbUrl}
                                                    alt={"article page image"}/>
                                            </div>
                                        </div>}
                                </div>
                                <div className={"rightPrev"}>
                                    {(aBoxRender.rImageDbUrl === "") ?
                                        <div className={"textViewerDivPrev p-4"} dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(aBoxRender.rHtmlTxt),
                                        }}>
                                        </div> :
                                        <div
                                            className={"imageViewerDiv"}>
                                            <img
                                                style={{
                                                    maxHeight: aBoxRender.rDynamicSliderValue + "px",
                                                    maxWidth: "100%"
                                                }} src={aBoxRender.rImageDbUrl}
                                                alt={"article page image"}/>
                                        </div>}
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
};
