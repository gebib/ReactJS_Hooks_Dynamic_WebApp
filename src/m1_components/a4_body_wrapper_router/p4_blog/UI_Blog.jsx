import React, {useEffect, useRef, useState} from "react";
import "./ST_Blog.scss";
import {VerticalTimeline, VerticalTimelineElement} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import events from "./timeline/events.json";
import {FaBriefcase} from "react-icons/fa";
import largeSL_logo from "../../a2_logo_with_image/sl_logo_big.svg";
import {TextEditorWYSIWYG} from "../../a0_shared_all/wysiwyg/TextEditorWYSIWYG";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import {RiEditFill} from "react-icons/ri";
import {IconContext} from "react-icons";
import {FaShare} from "react-icons/fa";
import {MdClear} from "react-icons/md";
import {AiFillPicture} from "react-icons/ai";
import {ContentState, convertToRaw, EditorState} from "draft-js";
import draftToHtml from "draftjs-to-html";
import {useTranslation} from "react-i18next";
import {Editor} from "react-draft-wysiwyg";
import htmlToDraft from "html-to-draftjs";
import {Prompt} from "react-router-dom";
import {showToast} from "../../../UI_Main_pages_wrapper";
import {useAuth} from "../../c1_auth/a0_auth_common/firebase/AuthContext";
import {getLocalDate} from "../p2_jobs/job_form/Jobs_form";
import ReactStars from "react-rating-stars-component";
import {AiFillStar, AiOutlineStar} from "react-icons/ai";


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
    const [rawAndHtmlForm, setRawAndHtmlForm] = useState([]);

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

    const {
        create_blog,
        blogPostLoading,
        setBlogPostLoading,
        read_blog,
        resetFormFromAuth,
        setResetFormFromAuth,
        currentUserInfo
    } = useAuth();

    useEffect(() => {
        setResetEditorState();
    }, [t]);


    const setResetEditorState = () => {
        let contentBlockBlog;
        if (i18n.language === "en") {
            contentBlockBlog = htmlToDraft(blogDefaultTextE);
        } else {
            contentBlockBlog = htmlToDraft(blogDefaultTextN);
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

    ///////////////temp/////////////
    const images = [
        // {
        //     original: 'https://picsum.photos/id/1018/1000/600/',
        //     thumbnail: 'https://picsum.photos/id/1018/250/150/',
        // },
        // {
        //     original: 'https://picsum.photos/id/1015/1000/600/',
        //     thumbnail: 'https://picsum.photos/id/1015/250/150/',
        // },
        // {
        //     original: 'https://picsum.photos/id/1019/1000/600/',
        //     thumbnail: 'https://picsum.photos/id/1019/250/150/',
        // },
    ];
    ///////////////temp/////////////


    const handleTimeelementClick = (e) => {
        console.log("////:handleTimeelementClick ");
    };


    const postBlog = () => {
        if (currentUserInfo !== null) {
            let raw = convertToRaw(editorState.getCurrentContent());
            let htmlTxt = draftToHtml(convertToRaw(editorState.getCurrentContent()));
            if (raw.blocks.length > 0) {
                let blogType = whatIsTheBlogType();
                let localDate = getLocalDate();
                create_blog(JSON.stringify(raw), htmlTxt, stagedFiles, blogType, localDate, rating);
            }
        } else {
            checkShouldPrompt();
        }
    };

    //fetch and decompose blog/article data for view.
    const fetchListOfBlogs = async () => {
        await read_blog().then((snapshot) => {
            let listOfBlogs = [];
            if (snapshot.val() !== null) {
                snapshot.forEach((snData) => {
                    let aBlogDataes = {
                        authorName: Object.values(snData.val())[0].authorName,
                        authorProfileImgUrl: Object.values(snData.val())[0].authorProfileImgUrl,
                        blogType: Object.values(snData.val())[0].blogType,
                        htmlTxt: Object.values(snData.val())[0].htmlTxt,
                        listOfBlogImgUrls: Object.values(snData.val())[0].listOfBlogImgUrls,
                        postDate: Object.values(snData.val())[0].postDate,
                        stringifiedRaw: Object.values(snData.val())[0].stringifiedRaw,
                    };
                    listOfBlogs.push(aBlogDataes);
                });
            }
            //refine farther view data
            listOfBlogs.forEach((blogData) => {
                let viewData = {};
            });
            setListOfBlogs(listOfBlogs);
            setBlogPostLoading(false);
        });
    };

    //todo: find and use first line text from RAW as title and truncate, depending on the width:
    //todo: check if article has image or not to display
    //todo: set authour date
    //todo: set authour name on footer of article
    //todo: on click article should show, without fetching again.. use ls?
    //todo: user can delete their blog: with r u sure?
    //todo: blog godkjennelse of adm... blog is visible to the user.. so lenge
    //todo: fix page bg if no blog etc.
    //todo: !ok?


    //fetch list of blogs,
    useEffect(() => {
        fetchListOfBlogs().then(() => {
            console.log("////:Fetch once: SET state:!");
        }).catch((e) => {
            console.log("////:e ", e);
        });
    }, [/*deps*/]);

    //And make viewable, once fetched!.
    useEffect(() => {
        if (listOfBlogs.length > 0) {
            console.log("////:listOfBlogs STATE:: ", listOfBlogs);
        }
    }, [listOfBlogs]);

    //monitor current user change in auth! if signed out etc..
    useEffect(() => {
        if (currentUserInfo !== null) {
            console.log("////:CURRENTuser UI_Blog: ", currentUserInfo);
        } else {
            //TODO thigs that needs to be done if user sings out etc.
            console.log("////: No use!");
        }

    }, [currentUserInfo]);


    useEffect(() => {
        if (!blogPostLoading && resetFormFromAuth) {
            setResetEditorState();
            setResetFormFromAuth(false);
            fetchListOfBlogs().then(() => {
                console.log("////:Fetch DONE posting: SET state:!");
            }).catch((e) => {
                console.log("////:e ", e);
            });
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
        if (isTextEditorDirty() && (currentUserInfo === null)) {
            showToast(t("blog.toPostYour") + " " + whatIsTheBlogType() + " " + t("blog.signInPlease"));
        }
    };

    //prompt also if img added, but not signed in!
    useEffect(() => {
        if (stagedFiles.length > 0) {
            checkShouldPrompt();
        }
    }, [stagedFiles]);


    const isTextEditorDirty = () => {
        let raw = convertToRaw(editorState.getCurrentContent());
        let rawLengthChanged = raw.blocks.length !== 3;
        let defaultTextEdited = (raw.blocks[0].text !== "Share your inspirational article or blog with us!") &&
            (raw.blocks[0].text !== "Del din inspirerende artikkel eller blogg med oss!");
        return (rawLengthChanged || defaultTextEdited);
    };

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
        }
    }, []);

    const clearBlogForm = () => {
        if (isTextEditorDirty()) {
            if (window.confirm(t("blog.youSure"))) {
                localStorage.removeItem("tmpBlogState");
                setResetEditorState();
                setStagedFiles([]);
            }
        }
    };

    const saveStuffToLocalStorage = (lsName, dataToSave) => {
        try {
            localStorage.setItem(lsName, JSON.stringify(dataToSave));
            setShouldPrompt(false);
        } catch (e) {
            console.log("////:Could not save temp data to localstorage! ", e);
            setShouldPrompt(true);
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
                        toolbar={{
                            // options: ["inline", "textAlign", "blockType", "fontSize", "fontFamily", "list", "link", "colorPicker", "history", "emoji"],
                            options: ["textAlign", "fontSize", "link", "history", "emoji"],
                            link: {inDropdown: false},
                            list: {inDropdown: false},
                        }}

                        editorState={editorState}
                        onEditorStateChange={(es) => {
                            setEditorState(es);
                            saveStuffToLocalStorage("tmpBlogState", draftToHtml(convertToRaw(es.getCurrentContent())));
                            checkShouldPrompt();
                        }}/>
                    <div className={"blogEditorFooter"}>
                        <div className={"blogPhotos"}>
                            {stagedFiles && stagedFiles.map(file => {
                                return (
                                    <div className={"overlay-fade"} key={file.file.id}>
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
                                    style={{border: "2px solid white", transition: "2s", minWidth: "150px"}}
                                    onClick={() => {
                                        postBlog();
                                    }} type="button"
                                    className={isTextEditorDirty() ? "btn btn-success  my-4" : "btn btn-dark  my-4"}>
                                {blogPostLoading ?
                                    <span className="spinner-border mx-1 text-info spinner-border-sm" role="status"
                                          aria-hidden="true"/> : <IconContext.Provider value={{size: "1.5em"}}>
                                        <FaShare style={{color: "#ffffff", marginRight: "10px"}}/>
                                    </IconContext.Provider>}
                                {isBlogChecked && t("blog.postBlog")}
                                {isReviewChecked && t("blog.postReview")}
                                {isArticleChecked && t("blog.postArticle")}
                            </button>

                            <button disabled={blogPostLoading} style={{border: "2px solid white"}} onClick={(event) => {
                                event.preventDefault();
                                imgInputRef.current.click();
                            }} type="button" className="btn btn-dark my-4">
                                <input type="file" hidden/>
                                <IconContext.Provider value={{size: "1.5em"}}>
                                    <AiFillPicture style={{color: "#ffffff", marginRight: "10px"}}/>
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


                            <button disabled={blogPostLoading} style={{border: "2px solid white"}} onClick={(event) => {
                                clearBlogForm();

                            }} type="button" className="btn btn-dark my-4">
                                <input type="file" hidden/>
                                <IconContext.Provider value={{size: "1.5em"}}>
                                    <MdClear style={{color: "#ffffff"}}/>
                                </IconContext.Provider>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/*//////////blog editor//////////*/}

            <VerticalTimeline className={"verticalTl"}>
                {listOfBlogs.map((blogData, i) => (

                    <VerticalTimelineElement
                        onTimelineElementClick={(e) => {
                            handleTimeelementClick(e);
                        }}
                        className="vertical-timeline-element--work"
                        iconStyle={{
                            background: "rgb(33, 150, 143)",
                            color: "#ffffff",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                            // boxShadow: "0 0 0 4px #248C9D",
                        }}

                        contentArrowStyle={{borderRight: "7px solid  #d3412a"}}
                        date="2011 - present"
                        icon={<img
                            className={"blogProfileImg"}
                            alt={"profile image"}
                            src={blogData.authorProfileImgUrl}/>}>
                        <div className={"blogReadMoreText"}>
                            <h3 className="vertical-timeline-element-title">Creative Director</h3>
                            {/*<h4 className="vertical-timeline-element-subtitle">Miami, FL</h4>*/}
                            <p style={{fontWeight: "400", fontSize: "16px"}}>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores corporis impedit
                                nobis
                                omnis quam quasi vitae, voluptatem? Ad architecto doloremque earum est excepturi facere
                                fugiat fugit in ipsa ipsum nobis obcaecati quia quod rem repellendus tempore, tenetur
                                ullam
                                ut veniam voluptatem. Ab ducimus quaerat rem. Harum incidunt numquam possimus. Debitis.
                            </p>
                        </div>
                        <div className={"blogListFooterEmbedWrapper"}>
                            <ImageGallery
                                items={images}
                                showPlayButton={false}
                                showNav={false}
                            />
                        </div>
                    </VerticalTimelineElement>
                ))}
            </VerticalTimeline>


            {/*<VerticalTimeline className={"verticalTl"}>*/}
            {/*    {events.map(event => (*/}
            {/*        <VerticalTimelineElement*/}
            {/*            onTimelineElementClick={(e) => {*/}
            {/*                handleTimeelementClick(e);*/}
            {/*            }}*/}
            {/*            className="vertical-timeline-element--work"*/}
            {/*            iconStyle={{*/}
            {/*                background: "rgb(33, 150, 143)",*/}
            {/*                color: "#ffffff",*/}
            {/*                overflow: "hidden",*/}
            {/*                display: "flex",*/}
            {/*                alignItems: "center",*/}
            {/*                justifyContent: "center"*/}
            {/*                // boxShadow: "0 0 0 4px #248C9D",*/}
            {/*            }}*/}

            {/*            contentArrowStyle={{borderRight: "7px solid  #d3412a"}}*/}
            {/*            date="2011 - present"*/}
            {/*            icon={<img*/}
            {/*                alt=""*/}
            {/*                className="blogImg"*/}
            {/*                src="https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"/>}>*/}
            {/*            <div className={"blogReadMoreText"}>*/}
            {/*                <h3 className="vertical-timeline-element-title">Creative Director</h3>*/}
            {/*                /!*<h4 className="vertical-timeline-element-subtitle">Miami, FL</h4>*!/*/}
            {/*                <p style={{fontWeight: "400", fontSize: "16px"}}>*/}
            {/*                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores corporis impedit*/}
            {/*                    nobis*/}
            {/*                    omnis quam quasi vitae, voluptatem? Ad architecto doloremque earum est excepturi facere*/}
            {/*                    fugiat fugit in ipsa ipsum nobis obcaecati quia quod rem repellendus tempore, tenetur*/}
            {/*                    ullam*/}
            {/*                    ut veniam voluptatem. Ab ducimus quaerat rem. Harum incidunt numquam possimus. Debitis.*/}
            {/*                </p>*/}
            {/*            </div>*/}
            {/*            <div className={"blogListFooterEmbedWrapper"}>*/}
            {/*                <ImageGallery*/}
            {/*                    items={images}*/}
            {/*                    showPlayButton={false}*/}
            {/*                    showNav={false}*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*        </VerticalTimelineElement>*/}
            {/*    ))}*/}
            {/*</VerticalTimeline>*/}


        </div>

    );
};
