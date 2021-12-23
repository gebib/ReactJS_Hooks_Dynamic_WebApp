import React, {useState} from "react";
import {useTranslation} from "react-i18next";

export const ErrorPage = () => {
    const {t, i18n} = useTranslation("SL_languages");
    return (
        <div style={{
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "5vw",
            backgroundColor: "#248C9D",
            fontWeight: "300",
            color:"white"
        }}>
            <div>{t("fof.ff")}</div>
            <div>{t("fof.pnf")}</div>
        </div>
    );
};
