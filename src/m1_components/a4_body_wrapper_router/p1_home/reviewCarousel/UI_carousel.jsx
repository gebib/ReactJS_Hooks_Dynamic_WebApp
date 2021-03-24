import React, {useEffect, useState} from "react";
import "./ST_carousel.scss";
import {useTranslation} from "react-i18next";
import {useHistory, useParams} from "react-router-dom";
import {useAuth} from "../../../c1_auth/a0_auth_common/firebase/AuthContext";
import Carousel from 'nuka-carousel';
import DOMPurify from "dompurify";
import ReactStars from "react-rating-stars-component";
import {AiFillStar, AiOutlineStar} from "react-icons/ai";
import {IconContext} from "react-icons";

export const UI_carousel = () => {
    // const [reviews, setReviews] = useState([
    //     {id: 1, title: 'item #1'},
    //     {id: 2, title: 'item #2'},
    //     {id: 3, title: 'item #3'},
    //     {id: 4, title: 'item #4'},
    //     {id: 5, title: 'item #5'}
    // ]);
    const [reviews, setReviews] = useState();

    const {t, i18n} = useTranslation("SL_languages");
    const history = useHistory();

    const {
        read_blog,
    } = useAuth();

    //fetch articles only selectively..
    const fetchListOfBlogs = async () => {
        await read_blog().then((snapshot) => {
            // console.log("////:SSSSSNNNNNNN ", snapshot.val());
            let chosenReviews = [];
            if (snapshot.val() !== null) {
                let i = 0;
                snapshot.forEach((snData) => {
                    let blogId = Object.keys(snapshot.val())[i];


                    // console.log("////:URLLL??? ", imagesUrlList);
                    let aBlogDataes = {
                        blogKey: blogId,
                        authorNameAndId: snData.val().authorNameAndId,
                        htmlTxt: snData.val().htmlTxt,
                        ratingStars: snData.val().ratingStars,

                        isBlogApproved: JSON.parse(snData.val().isBlogApproved),
                        blogType: snData.val().blogType
                    };

                    let blogIsApproved = aBlogDataes.isBlogApproved;
                    let blogIsReview = (aBlogDataes.blogType === "review");
                    if (blogIsApproved && blogIsReview) {
                        chosenReviews.push(aBlogDataes);
                    }
                    i++;
                });
            }
            setReviews(chosenReviews);
        });
    };

    useEffect(() => {
        console.log("////:afterSET ", reviews);
    }, [reviews]);

    useEffect(() => {
        fetchListOfBlogs().then((r) => {
            console.log("////:Fetched! REVIEWS: ");
        }).catch((e) => {
            console.log("////:e ", e);
        });
    }, [/*deps*/]);

    return (
        <div className={"carouselWraper"}>
            <h4>{t("home.carHeader")}</h4>
            {/*<Carousel*/}
            {/*    enableAutoPlay={true}*/}
            {/*    autoPlaySpeed={2000}*/}
            {/*    isRTL={false}*/}
            {/*    easing="cubic-bezier(1,.15,.55,1.54)"*/}
            {/*    tiltEasing="cubic-bezier(0.110, 1, 1.000, 0.210)"*/}
            {/*    transitionMs={700}*/}
            {/*    enableSwipe={true}*/}
            {/*    enableMouseSwipe={true}*/}
            {/*>*/}
            {/*</Carousel>*/}

            <Carousel
                className={"carouselSelf"}
                autoplay={true}
                autoplayInterval={10000}
                enableKeyboardControls={true}
                dragging={true}
                pauseOnHover={true}
                vertical={false}
                wrapAround={true}
            >
                {reviews && reviews.map(item =>
                    <div key={item.id}>
                        <div className={"nameAndStars"}><h5>{item.authorNameAndId[0]}</h5>
                            <ReactStars
                                edit={false}
                                size={23}
                                count={5}
                                color={"#c6c6c6"}
                                activeColor={"#248C9D"}
                                value={item.ratingStars}
                                a11y={true}
                                emptyIcon={<IconContext.Provider
                                    value={{size: "1.2em"}}><AiOutlineStar/></IconContext.Provider>}
                                filledIcon={<IconContext.Provider
                                    value={{size: "1.2em"}}><AiFillStar/></IconContext.Provider>}
                            /></div>
                        < div style={{fontStyle:"italic", textAlign:"center"}} onClick={() => {
                            history.replace("/blog/blogview/" + item.blogKey);
                        }} className={"dangerDiv px-2"}
                              dangerouslySetInnerHTML={reviews && {__html: DOMPurify.sanitize(item.htmlTxt)}}/>
                    </div>
                )}
            </Carousel>
        </div>
    );
};
