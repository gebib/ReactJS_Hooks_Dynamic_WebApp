import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import UI_Main_pages_wrapper from './UI_Main_pages_wrapper';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, useParam} from "react-router-dom";
import i18next from "i18next";

import language_en from "./resources/locals/en/translation.json";
import language_no from "./resources/locals/no/translation.json";
import {I18nextProvider} from "react-i18next";
import {AuthProvider} from "./m1_components/c1_auth/a0_auth_common/firebase/AuthContext";



//i18next init
i18next.init({
    interpolation: {escapeValue: false}, // React already does escaping
    lng: 'en',                             // language to use
    resources: {
        en: {
            SL_languages: language_en
        },
        no: {
            SL_languages: language_no
        },
    },
}).then(r => console.log(r));


ReactDOM.render(
    <React.StrictMode>
        <I18nextProvider i18n={i18next}>
            <BrowserRouter>
                <AuthProvider>
                    <UI_Main_pages_wrapper/>
                </AuthProvider>
            </BrowserRouter>
        </I18nextProvider>
    </React.StrictMode>,
    document.getElementById('UI_Main_pages_wrapper')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
