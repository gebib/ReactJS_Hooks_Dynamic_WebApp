import React, {useState} from "react";
import SelectSearch from "react-select-search";
import "./ST_drop_down.scss";
import {useTranslation} from "react-i18next";

export const UI_drop_down = () => {
    const {t, i18n} = useTranslation("SL_languages");
    const options = [
        {name: 'Published', value: 'sv'},
        {name: 'Deadline', value: 'en'}
    ];

    return (
        <div>
            <SelectSearch
                options={options}
                defaultValue="sv"
                name="language"
                placeholder={t("jobs.sort")}/>
        </div>
    );
}
