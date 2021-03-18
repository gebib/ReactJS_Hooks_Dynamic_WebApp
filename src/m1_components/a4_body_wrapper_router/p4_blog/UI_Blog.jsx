import React, {useEffect, useRef, useState} from "react";
import "./ST_Blog.scss";
import {VerticalTimeline, VerticalTimelineElement} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import {FaBriefcase} from "react-icons/fa";
import largeSL_logo from "../../a2_logo_with_image/sl_logo_big.svg";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import {RiCloseFill} from "react-icons/ri";
import {IconContext} from "react-icons";
import {FaShare} from "react-icons/fa";
import {MdClear} from "react-icons/md";
import {AiFillPicture} from "react-icons/ai";
import {ContentState, convertToRaw, EditorState} from "draft-js";
import draftToHtml from "draftjs-to-html";
import {useTranslation} from "react-i18next";
import {Editor} from "react-draft-wysiwyg";
import htmlToDraft from "html-to-draftjs";
import {Prompt, useHistory} from "react-router-dom";
import {showToast} from "../../../UI_Main_pages_wrapper";
import {useAuth} from "../../c1_auth/a0_auth_common/firebase/AuthContext";
import {getLocalDate} from "../p2_jobs/job_form/Jobs_form";
import ReactStars from "react-rating-stars-component";
import {AiFillStar, AiOutlineStar} from "react-icons/ai";
import {SiMicroDotBlog} from "react-icons/si";
import {MdCheck} from "react-icons/md";
import {FaInfo} from "react-icons/fa";


import {RiFeedbackFill} from "react-icons/ri";
import {BsBoxArrowUpRight} from "react-icons/bs";

import DOMPurify from "dompurify";


let blogDefaultTextE = `
<p>Share your inspirational article or blog with us!</p>
<p></p>
<p></p>
`;

let blogDefaultTextN = `
<p>Del din inspirerende artikkel eller blogg med oss!</p>
<p></p>
<p></p>
`;

export const UI_Blog = () => {
    const {t, i18n} = useTranslation("SL_languages");
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [editorTouched, setEditorTouched] = useState(false);
    const [spellCheck, setSpellCheck] = useState(true);

    const [isAdmin, setIsAdmin] = useState(false);


    const [cuInfo, setCuInfo] = useState([]);

    const [isBlogChecked, setIsBlogChecked] = useState(true);
    const [isArticleChecked, setIsArticleChecked] = useState(false);
    const [isReviewChecked, setIsReviewChecked] = useState(false);

    const [shouldPrompt, setShouldPrompt] = useState(false);
    const [stagedFiles, setStagedFiles] = useState([]);
    const [listOfBlogs, setListOfBlogs] = useState([]);

    //rating stars
    const [rating, setRating] = useState(5);

    const blogRef = useRef();
    const articleRef = useRef();
    const reviewRef = useRef();
    const imgInputRef = useRef();
    const imgRef = useRef();
    const starsRef = useRef();

    const history = useHistory();

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

    useEffect(() => {
        if (!editorTouched) {
            setResetEditorState();
        }
    }, [t]);


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
        setStagedFiles([]);
    };

    const handleTimeelementClick = (aBlogKey) => {
        console.log("////:handleTimeelementClick ", aBlogKey);
        // console.log("////: ",e.target);
        // history.push("blog/blogview/" + aBlogKey);
    };


    const postBlog = () => {
        if (currentUserInfo !== null) {
            let raw = convertToRaw(editorState.getCurrentContent());
            let htmlTxt = draftToHtml(convertToRaw(editorState.getCurrentContent()));

            let editorIsEmpty = true;
            for (let i = 0; i < raw.blocks.length; i++) {
                if (raw.blocks[i].text.length > 0) {
                    editorIsEmpty = false;
                    break;
                }
            }

            //blog is preapproved case the user is admin!:
            let isBlogApproved = currentUserInfo[2];

            if (!editorIsEmpty && editorTouched) {
                let blogType = whatIsTheBlogType();
                let localDate = getLocalDate();
                create_blog(JSON.stringify(raw), htmlTxt, stagedFiles, blogType, localDate, rating, isBlogApproved);
                setEditorTouched(false);
            } else {
                showToast(t("blog.empty"), "error")
            }
        } else {
            checkShouldPrompt();
        }
    };

    //fetch and decompose blog/article data for view.
    const fetchListOfBlogs = async () => {
        await read_blog().then((snapshot) => {
            // console.log("////:SSSSSNNNNNNN ", snapshot.val());
            let listOfBlogs = [];
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
                    if (title.length > 25) {
                        title = title.substring(0, 15) + ". . .";
                    }
                    // build blog images array for gallery, if any.
                    let blogImages = [];
                    let imagesUrlList = snData.val().listOfBlogImgUrls;
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

                    // let cuIsAdmin = isAdmin;
                    let cuIsAdmin = "";
                    let cuOwnsTheBlog = "";
                    let blogIsApproved = aBlogDataes.isBlogApproved;

                    if (currentUserInfo !== null) {
                        cuIsAdmin = currentUserInfo[2];
                        cuOwnsTheBlog = currentUserInfo[0] === aBlogDataes.authorNameAndId[1];
                    }
                    // console.log("////:cuIsAdmin: ", cuIsAdmin, " cuOwnsTheBlog: ", cuOwnsTheBlog, "blogIsApproved: ", blogIsApproved);

                    if (cuIsAdmin) { //current user is admin! : show all.
                        listOfBlogs.push(aBlogDataes);
                    } else if (!blogIsApproved && cuOwnsTheBlog) { //add unapproved blog to view list, only if cu owns it.
                        listOfBlogs.push(aBlogDataes);
                    } else if (blogIsApproved) {
                        listOfBlogs.push(aBlogDataes);
                    }
                    i++;
                });
            }
            setListOfBlogs(listOfBlogs.reverse());/////
            setBlogPostLoading(false);
        });
    };


    //todo: on click article should show, without fetching again.. use ls?
    //todo: fix page bg if no blog etc.
    //todo:



    //monitor current user change in auth! if signed out etc..
    useEffect(() => {
        if (currentUserInfo !== null) {
            setIsAdmin(currentUserInfo[2]);
            setCuInfo(currentUserInfo);
            console.log("////: Yes user");
        } else {
            setIsAdmin(false);
            setCuInfo(null);
            console.log("////: No user!");
        }
        fetchBlog();
    }, [currentUserInfo]);


    const fetchBlog = () => {
        fetchListOfBlogs().then(() => {
            console.log("////:Fetch once: SET state:!");
        }).catch((e) => {
            console.log("////:e ", e);
        });
    };

    useEffect(() => {
        if (!blogPostLoading && resetFormFromAuth) {
            setResetEditorState();
            setResetFormFromAuth(false);
            fetchBlog();
        }
    }, [blogPostLoading, resetFormFromAuth]);

    const handleStagedImgRemove = (clickedId) => {
        let updatedArray = [];
        for (let i = 0; i < stagedFiles.length; i++) {
            if (!(stagedFiles[i].id === clickedId)) {
                updatedArray.push(stagedFiles[i]);
            }
        }
        setStagedFiles(updatedArray);
    };

    //return type of blog
    const whatIsTheBlogType = () => {
        let whatIsIt = "";
        if (isBlogChecked) {
            whatIsIt = t("blog.isBlog");
        } else if (isArticleChecked) {
            whatIsIt = t("blog.isArticle");
        } else if (isReviewChecked) {
            whatIsIt = t("blog.isReview");
        }
        return whatIsIt;
    };

    // window.confirm(t("jform.resetok"))////////////////////
    const checkShouldPrompt = () => {
        if (editorTouched && (currentUserInfo === null)) {
            showToast(t("blog.toPostYour") + " " + whatIsTheBlogType() + " " + t("blog.signInPlease"));
        }
    };

    //prompt also if img added, but not signed in!
    useEffect(() => {
        if (stagedFiles.length > 0) {
            checkShouldPrompt();
        }
    }, [stagedFiles]);


    //check previous saved blog form data on ls
    useEffect(() => {
        let localDataBlogTxt = null;

        try {
            localDataBlogTxt = localStorage.getItem("tmpBlogState");
        } catch (e) {
            console.log("////:No local storage temp found!. ", e);
        }

        if (localDataBlogTxt) {
            let contentBlockBlog = htmlToDraft(JSON.parse(localDataBlogTxt));

            if (contentBlockBlog.contentBlocks.length > 3) {
                const contentState = ContentState.createFromBlockArray(
                    contentBlockBlog.contentBlocks
                );
                const editorState = EditorState.createWithContent(contentState);
                setEditorState(editorState);
            }
            isEditorChanged();
        }
    }, []);

    const clearBlogForm = () => {
        if (editorTouched) {
            if (window.confirm(t("blog.youSure"))) {
                localStorage.removeItem("tmpBlogState");
                setResetEditorState();
                setStagedFiles([]);
                setEditorTouched(false);
            }
        }
    };

    const isEditorChanged = () => {
        let raw = convertToRaw(editorState.getCurrentContent());

        let isDefaultText = ((raw.blocks[0].text === "Share your inspirational article or blog with us!") ||
            (raw.blocks[0].text === "Del din inspirerende artikkel eller blogg med oss!"));
        let areThereTexts = false;

        for (let i = 1; i < raw.blocks.length; i++) {
            if (raw.blocks[i].text.length > 0) {
                areThereTexts = true;
                break;
            }
        }
        let isEditorChanged = (!isDefaultText || areThereTexts);
        // console.log("////:isDefaultText ", isDefaultText);
        // console.log("////:areThereTexts ", areThereTexts);
        // console.log("////:changed__ ", isEditorChanged);

        setEditorTouched(isEditorChanged);
        return isEditorChanged;
    };


    const saveTempEditorState = (lsName, dataToSave) => {
        if (isEditorChanged()) {
            try {
                localStorage.setItem(lsName, JSON.stringify(dataToSave));
                setShouldPrompt(false);
            } catch (e) {
                console.log("////:Could not save temp data to localstorage! ", e);
                setShouldPrompt(true);
            }
            setEditorTouched(true);
        }
    };

    //construct list of blog images array to display.
    const getAblogsImages = (aBlogsImages) => {
        // console.log("////:BLOG emages:??  ", aBlogsImages);
        let arrayOfImages = [];
        if (aBlogsImages) {
            aBlogsImages.forEach((url) => {
                arrayOfImages.push({original: url, thumbnail: url});
            });
        }
        return arrayOfImages;
    };

    const approveBlog = (e, blogId) => {
        e.stopPropagation();
        approve_blog(blogId);
        fetchBlog();
    };

    const deleteBlog = (e, blogId) => {
        e.stopPropagation();
        if (window.confirm(t("blog.deleteSure"))) {
            delete_blog(blogId);
            fetchBlog();
        }
    };


    return (
        <div className={"timeLineMainWrapper"}>
            <Prompt when={shouldPrompt} message={t("blog.youSureWantToLeave")}/>
            <div className={"large_sl_logo_container_blog"}>
                <img className={"large_logo_image_blog"} src={largeSL_logo} alt={"SILVERLINING logo large"}/>
            </div>
            {/*/////////blog editor///////////*/}
            <div className={"editorWrapper"}>
                <div className={"editorInnerWrapper"}>
                    <Editor
                        readOnly={blogPostLoading}
                        editorStyle={{backgroundColor: "#fdfdfd"}}
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
                            saveTempEditorState("tmpBlogState", draftToHtml(convertToRaw(es.getCurrentContent())));
                            setEditorState(es);
                            checkShouldPrompt();
                            isEditorChanged();

                        }}/>
                    <div className={"blogEditorFooter"}>
                        <div className={"blogPhotos"}>
                            {stagedFiles && stagedFiles.map((file) => {
                                return (
                                    <div className={"overlay-fade"} key={file.id}>
                                        <img
                                            ref={imgRef}
                                            style={{
                                                margin: "5px"
                                            }}
                                            alt={"what"}
                                            src={`${file.id}`}
                                            height={"70px"}/>
                                        <div id={`${file.id}`} className={"overlayIcon"}
                                             onClick={(e) => {
                                                 handleStagedImgRemove(e.target.getAttribute('id'));
                                             }}>
                                            <h1 id={`${file.id}`} style={{color: "#ff4500"}}>x</h1>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className={"blogTypeCb mx-2"}>
                            <div className={"form-check"}>
                                <input disabled={blogPostLoading} className={"form-check-input"}
                                       ref={reviewRef}
                                       checked={isReviewChecked}
                                       onChange={(e) => {
                                           // handleCb(!e.target.checked);
                                           setIsReviewChecked(true);
                                           setIsArticleChecked(false);
                                           setIsBlogChecked(false);
                                       }}
                                       type={"checkbox"}
                                       id={"ar"}/>
                                <label className="form-check-label" htmlFor="ar">
                                    {t("blog.review")}
                                </label>
                            </div>
                            <div className={"stars"}>
                                {isReviewChecked && <ReactStars
                                    edit={true}
                                    size={23}
                                    count={5}
                                    color={"#c6c6c6"}
                                    activeColor={"#248C9D"}
                                    value={rating}
                                    a11y={true}
                                    emptyIcon={<AiOutlineStar/>}
                                    filledIcon={<AiFillStar/>}
                                    onChange={(newValue) => {
                                        setRating(newValue);
                                    }}
                                />}
                                {!isReviewChecked && <ReactStars
                                    edit={false}
                                    size={23}
                                    count={5}
                                    color={"#c6c6c6"}
                                    activeColor={"#248C9D"}
                                    value={0}
                                    a11y={true}
                                    emptyIcon={<AiOutlineStar/>}
                                    filledIcon={<AiFillStar/>}
                                    onChange={(newValue) => {
                                        setRating(newValue);
                                    }}
                                />}
                            </div>
                        </div>


                        <div className={"blogTypeCb mx-2"}>
                            <div className="form-check">
                                <input disabled={blogPostLoading} className="form-check-input"
                                       ref={blogRef}
                                       checked={isBlogChecked}
                                       onChange={(e) => {
                                           // handleCb(!e.target.checked);
                                           setIsReviewChecked(false);
                                           setIsArticleChecked(false);
                                           setIsBlogChecked(true);

                                       }}
                                       type={"checkbox"}
                                       id={"bl"}/>
                                <label className="form-check-label" htmlFor="bl">
                                    {t("blog.blog")}
                                </label>
                            </div>
                            <div className={"form-check"}>
                                <input disabled={blogPostLoading} className={"form-check-input"}
                                       ref={articleRef}
                                       checked={isArticleChecked}
                                       onChange={(e) => {
                                           // handleCb(!e.target.checked);
                                           setIsReviewChecked(false);
                                           setIsArticleChecked(true);
                                           setIsBlogChecked(false);

                                       }}
                                       type={"checkbox"}
                                       id={"ar"}/>
                                <label className="form-check-label" htmlFor="ar">
                                    {t("blog.article")}
                                </label>
                            </div>
                        </div>


                        <div className="btn-group mx-3" role="group" aria-label="Basic outlined example">
                            <button disabled={blogPostLoading}
                                    style={{minWidth: "150px", color: "#a9c0bf"}}
                                    onClick={() => {
                                        postBlog();
                                    }} type="button"
                                    className={editorTouched ? "btn btn-success  my-4 mx-1" : "btn btn-dark  my-4 mx-1"}>
                                {blogPostLoading ?
                                    <span className="spinner-border mx-1 text-info spinner-border-sm" role="status"
                                          aria-hidden="true"/> : <IconContext.Provider value={{size: "1.5em"}}>
                                        <FaShare style={{color: "#a9c0bf", marginRight: "10px"}}/>
                                    </IconContext.Provider>}
                                {isBlogChecked && t("blog.postBlog")}
                                {isReviewChecked && t("blog.postReview")}
                                {isArticleChecked && t("blog.postArticle")}
                            </button>

                            <button disabled={blogPostLoading} style={{color: "#a9c0bf"}} onClick={(event) => {
                                event.preventDefault();
                                imgInputRef.current.click();
                            }} type="button" className="btn btn-dark my-4 mx-1">
                                <input type="file" hidden/>
                                <IconContext.Provider value={{size: "1.5em"}}>
                                    <AiFillPicture style={{color: "#a9c0bf", marginRight: "10px"}}/>
                                </IconContext.Provider>
                                {t("blog.addImage")}
                            </button>
                            <input
                                ref={imgInputRef}
                                type={"file"}
                                className={"d-none"}
                                multiple={true}
                                accept={"image/*"}
                                onChange={(e) => {
                                    const files = e.target.files;
                                    let convertedFiles = [];
                                    Object.keys(files).forEach(i => {
                                        let newFileName = files[i].name;
                                        let existsInState = false;
                                        for (let j = 0; j < stagedFiles.length; j++) {
                                            if (newFileName === stagedFiles[j].file.name) {
                                                existsInState = true;
                                                break;
                                            }
                                        }
                                        if (!existsInState) {
                                            convertedFiles = [...convertedFiles, {
                                                id: URL.createObjectURL(files[i]),
                                                file: files[i]
                                            }];
                                        }

                                    });
                                    let filesToBeStaged = [...stagedFiles, ...convertedFiles];
                                    if (filesToBeStaged.length > 0) {
                                        setStagedFiles(filesToBeStaged);
                                    }
                                }}/>


                            <button disabled={blogPostLoading} style={{color: "#a9c0bf"}} onClick={(event) => {
                                clearBlogForm();
                            }} type="button" className="btn btn-dark my-4 mx-1">
                                <input type="file" hidden/>
                                <IconContext.Provider value={{size: "1.5em"}}>
                                    <MdClear style={{color: "#a9c0bf"}}/>
                                </IconContext.Provider>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/*//////////blog editor//////////*/}
            <VerticalTimeline className={"verticalTl"}>
                {listOfBlogs.map((aBlogData, index) => (
                    <VerticalTimelineElement
                        key={aBlogData.blogKey}
                        // onTimelineElementClick={(e) => {
                        //     handleTimeelementClick(e, aBlogData.blogKey);
                        // }}
                        className="vertical-timeline-element--work"
                        iconStyle={{
                            background: "rgb(33, 150, 143)",
                            color: "#a9c0bf",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                            // boxShadow: "0 0 0 4px #248C9D",
                        }}

                        contentArrowStyle={{borderRight: "7px solid  #d3412a"}}
                        date={aBlogData.authorNameAndId[0].toUpperCase() + " " + JSON.parse(aBlogData.postDate)[0] + "." + JSON.parse(aBlogData.postDate)[1] + "." + JSON.parse(aBlogData.postDate)[2]}
                        icon={<img
                            className={"blogProfileImg"}
                            alt={"profile image"}
                            src={aBlogData.authorProfileImgUrl}/>}>
                        <div onClick={()=>{handleTimeelementClick(aBlogData.blogKey)}} className={"blogReadMoreText"}>
                            <div className={"badgeTitleWraper"}>
                                <div className={"typeOfBlog"}>
                                    <div style={{color: "#a9c0bf"}} hidden={!(aBlogData.blogType === "blog")}>
                                        <IconContext.Provider value={{size: "1.5em"}}>
                                            <SiMicroDotBlog style={{color: "#248c9d", marginRight: "10px"}}/>
                                            {t("blog.iAmBlog")}
                                        </IconContext.Provider>
                                    </div>

                                    <div style={{color: "#a9c0bf"}} hidden={!(aBlogData.blogType === "article")}>
                                        <IconContext.Provider value={{size: "1.5em"}}>
                                            <FaInfo style={{color: "#248c9d", marginRight: "10px"}}/>
                                            {t("blog.iAmArticle")}
                                        </IconContext.Provider>
                                    </div>

                                    <div style={{color: "#a9c0bf"}} hidden={!(aBlogData.blogType === "review")}>
                                        <IconContext.Provider value={{size: "1.5em"}}>
                                            <RiFeedbackFill style={{color: "#248c9d", marginRight: "10px"}}/>
                                            {t("blog.iAmReview")}
                                        </IconContext.Provider>
                                    </div>
                                </div>

                                <h3 style={{color: "#e2fffe"}}
                                    className="vertical-timeline-element-title mx-5">{aBlogData.title}
                                    <IconContext.Provider value={{size: "1em"}}>
                                        <BsBoxArrowUpRight style={{color: "#994029", marginLeft: "10px",marginRight: "10px"}}/>
                                    </IconContext.Provider>
                                    <span className={"spanRead"}>{t("blog.readMoreTitle")}</span>
                                </h3>

                            </div>
                            {/*<h4 className="vertical-timeline-element-subtitle">Miami, FL</h4>*/}

                            <div className={"articleArraysWrapper"}>
                                <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(aBlogData.htmlTxt)}}/>
                            </div>
                            {/*<div className={"readMoreDiv"}>*/}
                            {/*    <IconContext.Provider value={{size: "2em"}}>*/}
                            {/*        <BsBoxArrowUpRight style={{color: "#a9c0bf"}}/>*/}
                            {/*    </IconContext.Provider>*/}
                            {/*</div>*/}
                        </div>

                        <div hidden={!(aBlogData.urlsOfBlogImages)} className={"blogListFooterEmbedWrapper"}>
                            <ImageGallery
                                items={getAblogsImages(aBlogData.urlsOfBlogImages)}
                                showPlayButton={false}
                                showFullscreenButton={true}
                                showNav={false}/>
                        </div>

                        {/*hidden if user signed in is not admin!*/}
                        <div hidden={(aBlogData.blogType !== "review")} className={"blogFooter"}>
                            <div className={"starsIfisReview"}>
                                <ReactStars
                                    edit={false}
                                    size={23}
                                    count={5}
                                    color={"#c6c6c6"}
                                    activeColor={"#248C9D"}
                                    value={aBlogData.ratingStars}
                                    a11y={true}
                                    emptyIcon={<IconContext.Provider value={{size: "1.2em"}}><AiOutlineStar/></IconContext.Provider>}
                                    filledIcon={<IconContext.Provider value={{size: "1.2em"}}><AiFillStar/></IconContext.Provider>}
                                    onChange={(newValue) => {
                                        setRating(newValue);
                                    }}
                                />
                            </div>
                            <div hidden={!isAdmin}>
                                <IconContext.Provider value={{size: "2em"}}>
                                    <MdCheck onClick={(e) => {
                                        approveBlog(e, aBlogData.blogKey);
                                    }} hidden={aBlogData.isBlogApproved} className={"blogFooterButtonsApprove"}/>
                                </IconContext.Provider>

                                <IconContext.Provider value={{size: "2em"}}>
                                    <RiCloseFill onClick={(e,) => {
                                        deleteBlog(e, aBlogData.blogKey);
                                    }} className={"blogFooterButtonsDelete"}/>
                                </IconContext.Provider>
                            </div>
                        </div>
                    </VerticalTimelineElement>
                ))}
            </VerticalTimeline>
        </div>

    );
};
