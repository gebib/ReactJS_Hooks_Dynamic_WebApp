import React, { useState } from "react";
import "./ST_footer.scss";
export const UI_footer = (props) => {
    return (
        <div className={"UI_footer_wrapper"} style={{background: props.isInViewPort ? "#59e534" : "#ce3a23"}}>
            footer..
        </div>
    );
}