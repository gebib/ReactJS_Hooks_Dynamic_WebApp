import React from "react";
import "./ST_logo_with_image.scss";
import slLogoMain from "../../resources/images/slLogoMain.svg";
import sl_pt from "./sl_pt.PNG";
import {useLocation} from 'react-router-dom';

export const UI_logo_with_image = () => {
    return (
        <div  className={"logo_with_divider_wrapper"}>
            <div className={"large_sl_logo_container"}>
                <video id={"videoBG"} poster={sl_pt} autoPlay muted loop>
                    {/*<source type={"video/mp4"} src={"https://firebasestorage.googleapis.com/v0/b/silverlining-it-prod.appspot.com/o/sl_liked4k.mp4?alt=media&token=0b10809e-bfe8-4203-8238-62d293781df8"}/>*/}
                </video>
                <img id={"large_logo_image"} src={slLogoMain} alt={"SILVERLINING logo large"}/>
            </div>
        </div>
    );
};

/*
* TODO
*   Home, Services, about |||||| need to be content editable!
*
*   at mobile version jobs top black div too large!
*   at mobile text too bold why?
*   fix the black should be long at jobs.
*   fix the text clipping fkkshi!
*
* TODO:
*       create box: 1, 2, 4! wide: any place!
*       height is adjustable by user.
*       content should fit to adjusting height!
*
*       a box should contain only text or image
*       image is by default fit height
*       text can: aligned, justified, blabla link, etc all ok.
*
* */
