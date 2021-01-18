import React, {useState, useRef, useEffect} from "react";
import "./ST_nav_bar.scss";
import {InView, useInView} from 'react-intersection-observer';


export const UI_nav_bar = (props) => {
    const {ref, inView, entry} = useInView({
        threshold: 0.6,
    });

    return (
        <div ref={ref} className={"nav_bar_main_wrapper"}>
            <div className={(inView ? "top_bar_1" : "top_bar_0")}>
            </div>

            <div  className={(inView ? "bottom_bar" : "bottom_bar fixed-top")}>
                I stay here.
            </div>
        </div>
    );
}