import React, {useEffect, useState} from "react";
import "./ST_blog_view.scss";
import {useHistory, useParams} from "react-router-dom";
import {useAuth} from "../../../c1_auth/a0_auth_common/firebase/AuthContext";
import ImageGallery from "react-image-gallery";
import {array} from "prop-types";
import DOMPurify from "dompurify";
import {IconContext} from "react-icons";
import ReactStars from "react-rating-stars-component";
import {AiFillStar, AiOutlineStar} from "react-icons/ai";
import {UI_PullCards} from "../../p1_home/pullcards/UI_PullCards";


export const UI_blog_view = () => {
    const blogId = useParams();
    const history = useHistory();
    const [aBlogData, setAblogData] = useState();

    const {
        read_blog_single
    } = useAuth();

    const fetchSingleBlog = async (bId) => {
        return await read_blog_single(bId);
    };

    const fetchAblog = (bId) =>{
        let id = (bId) ? bId : blogId.id;
        fetchSingleBlog(id).then((aBlogFetched) => {
            // console.log("////:aBlogDATA?", aBlogFetched.val());
            constructAblog(aBlogFetched);
            // console.log("////: ");
        }).catch((e) => {
            console.log("////:e ", e);
            history.push("/badurl404");
        });
    };

    useEffect(() => {
        fetchAblog();
    }, [/*deps*/]);

    const constructAblog = (snData) => {
        let raw = JSON.parse(snData.val().stringifiedRaw);
        let blogId = Object.keys(snData.val());
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
        if (title.length > 100) {
            title = title.substring(0, 100) + ". . .";
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
        setAblogData(aBlogDataes);
    };

    //construct list of blog images array to display.
    const getAblogsImages = () => {
        // console.log("////:BLOG emages:??  ", aBlogData.urlsOfBlogImages);
        let arrayOfImages = [];
        if (aBlogData.urlsOfBlogImages) {
            aBlogData.urlsOfBlogImages.forEach((url) => {
                arrayOfImages.push({original: url, thumbnail: url});
            });
        }
        return arrayOfImages;
    };


    return (
        <main className={"mainWrapper"}>
            {/*{aBlogData && console.log("////:RENDER", getAblogsImages())}*/}
            <div className={"topPosterInfoDiv mx-2"}>
                <div className={"userImage"}>
                    <img
                        className={"posterProfileImg"}
                        alt={"profile image"}
                        src={aBlogData && aBlogData.authorProfileImgUrl}/>
                </div>
                <div className={"nameDiv mx-2"}>
                    {aBlogData && aBlogData.authorNameAndId[0] + " | " +
                    JSON.parse(aBlogData.postDate)[0] + "." +
                    JSON.parse(aBlogData.postDate)[1] + "." +
                    JSON.parse(aBlogData.postDate)[2]}
                </div>
                {(aBlogData && aBlogData.blogType === "review") && <div className={"ratingStrs"}>
                    <ReactStars
                        edit={false}
                        size={23}
                        count={5}
                        color={"#c6c6c6"}
                        activeColor={"#248C9D"}
                        value={aBlogData.ratingStars}
                        a11y={true}
                        emptyIcon={<IconContext.Provider
                            value={{size: "1em"}}><AiOutlineStar/></IconContext.Provider>}
                        filledIcon={<IconContext.Provider
                            value={{size: "1em"}}><AiFillStar/></IconContext.Provider>}
                    />
                </div>}

            </div>

            <div className={"titleDiv middleDivsCommon"}>
                <h3>{aBlogData && aBlogData.title}</h3>
            </div>

            <div className={"imageDiv middleDivsCommon"}>
                {aBlogData && <ImageGallery
                    items={getAblogsImages()}
                    showPlayButton={false}
                    showFullscreenButton={getAblogsImages().length > 0}
                    showThumbnails={getAblogsImages().length > 1}
                    showNav={getAblogsImages().length > 1}/>}
            </div>
            <div dangerouslySetInnerHTML={aBlogData && {__html: DOMPurify.sanitize(aBlogData.htmlTxt)}}
                 className={"textContentDiv2 middleDivsCommon"}/>
            <div className={"oldBlogCardsDivsBlogView"}>
                <hr/>
                <UI_PullCards getNewblog={fetchAblog}/>
            </div>
        </main>
    );
};
