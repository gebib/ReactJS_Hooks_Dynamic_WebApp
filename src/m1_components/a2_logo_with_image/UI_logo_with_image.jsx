import React from "react";
import "./ST_logo_with_image.scss";
import largeSL_logo from "./sl_logo_big.svg";
import sl_pt from "./sl_pt.PNG";
import {useLocation} from 'react-router-dom';

export const UI_logo_with_image = () => {
    return (
        <div  className={"logo_with_divider_wrapper"}>
            <div className={"large_sl_logo_container"}>
                <video id={"videoBG"} poster={sl_pt} autoPlay muted loop>
                    {/*TODO enable video once done.*/}
                    {/*<source type={"video/mp4"} src={"https://firebasestorage.googleapis.com/v0/b/silverlining-it-prod.appspot.com/o/sl_liked4k.mp4?alt=media&token=0b10809e-bfe8-4203-8238-62d293781df8"}/>*/}
                </video>
                <img id={"large_logo_image"} src={largeSL_logo} alt={"SILVERLINING logo large"}/>
            </div>
        </div>
    );
};
