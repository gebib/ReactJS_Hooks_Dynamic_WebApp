import React from "react";
import {IconContext} from "react-icons";
import {FcGoogle} from "react-icons/fc";
import {ImFacebook} from "react-icons/im";
import instaIconLogo from "../../../resources/images/insta_icon.webp";
import instaTextLogo from "../../../resources/images/insta_txt_logo.svg";
import {GrLinkedinOption} from "react-icons/gr";
import "./ST_sm_buttons.scss";

export const UI_sm_buttons = () => {
    return (
        <div className={"social_media_buttons"}>
            <button className='sm_b sm_button_google'>
                <IconContext.Provider value={{size: "20px"}}>
                    <div className={"ico_div"}>
                        <FcGoogle/>
                    </div>
                    <span className={"icon_text"}>Google</span>
                </IconContext.Provider>
            </button>

            <button className='sm_b sm_button_facebook'>
                <IconContext.Provider value={{size: "20px", color: "#3B5998"}}>
                    <div className={"ico_div"}>
                        <ImFacebook/>
                    </div>
                    <span className={"icon_text"}>facebook</span>
                </IconContext.Provider>
            </button>

            <button className='sm_b sm_button_instagram'>
                <IconContext.Provider value={{size: "20px", color: "#9c1c65"}}>
                    <div className={"ico_div"}>
                        <img height={"24px"} src={instaIconLogo} alt={"insta text logo"}/>
                    </div>
                    <span className={"icon_text"}><img height={"24px"} src={instaTextLogo}
                                                       alt={"insta text logo"}/></span>
                </IconContext.Provider>
            </button>

            <button className='sm_b sm_button_in'>
                <IconContext.Provider value={{size: "20px", color: "#1DA0F1"}}>
                    <div className={"ico_div"}>
                        <GrLinkedinOption/>
                    </div>
                    <span className={"icon_text"}>Linkedin</span>
                </IconContext.Provider>
            </button>
        </div>
    );
}