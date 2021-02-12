import React, {useState} from "react";
import SelectSearch from "react-select-search";
import "./ST_drop_down.scss";

export const UI_drop_down = () => {

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
                placeholder="Sort By:"/>
        </div>
    );
}
