import React from "react";
import "./ST_logo_with_image.scss";
import largeSL_logo from "./sl_logo_big.svg";
import sl_pt from "./sl_pt.PNG";
import {useLocation} from 'react-router-dom';

export const UI_logo_with_image = () => {
    const urlLocation = useLocation();
    if(urlLocation.pathname === "/about"){
        console.log("////: useMP4 bg");
    }else{
        console.log("////: regular bg");
    }

    return (
        <div  className={"logo_with_divider_wrapper"}>
            <div className={"large_sl_logo_container"}>
                <video id={"videoBG"} poster={sl_pt} autoPlay muted loop>
                    <source type={"video/mp4"} src={"https://firebasestorage.googleapis.com/v0/b/silverlining-it-prod.appspot.com/o/sl_bg_video4k%2Fsl_liked4k.mp4?alt=media&token=12c81d1e-ae1d-4568-b7ea-0f699ee0927a"}/>
                </video>
                <img id={"large_logo_image"} src={largeSL_logo} alt={"SILVERLINING logo large"}/>
            </div>
        </div>
    );
};
