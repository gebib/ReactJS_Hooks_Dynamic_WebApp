import React from "react";
import "./ST_logo_with_image.scss";
import largeSL_logo from "./sl_logo_big.svg";



export const UI_logo_with_image = () => {

    return (
        <div className={"logo_with_divider_wrapper"}>
            <div className={"large_sl_logo_container"}>
                <img id={"large_logo_image"} src={largeSL_logo} alt={"SILVERLINING logo large"}/>
            </div>
        </div>
    );
}
