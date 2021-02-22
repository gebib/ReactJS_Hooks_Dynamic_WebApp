import React, {Component, useEffect, useState} from "react";
import {EditorState, convertToRaw, ContentState} from "draft-js";
import {Editor} from "react-draft-wysiwyg";
import "./TextEditorWYSIWYG.scss";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {render} from "react-dom";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {showToast} from "../../../UI_Main_pages_wrapper";
import {Prompt} from "react-router-dom"
import {useTranslation} from "react-i18next";


let newJobTemplateE = `
    <h4><span style="color: rgb(47,47,53);background-color: rgb(255,255,255);font-size: 24px;font-family: Arial;">Job title job title</span></h4>
<p style="margin-left:0in;"><span style="color: rgb(33,37,41);font-size: 12pt;font-family: Arial;"><strong>Employer: </strong>Company name</span>&nbsp;</p>
<p style="margin-left:0in;"><span style="color: rgb(33,37,41);background-color: white;font-size: 12pt;font-family: Arial;"><strong>Deadline: </strong>27.02.2021 </span>&nbsp;</p>
<p style="margin-left:0in;"><span style="color: rgb(33,37,41);background-color: white;font-size: 12pt;font-family: Arial;"><strong>Work place: </strong>Bergen</span></p>
<p></p>
<p><span style="color: rgb(33,37,41);background-color: white;font-size: 12pt;font-family: Arial;"><strong>About company</strong></span>&nbsp;</p>
<p style="margin-left:0in;"><span style="font-family: Arial;">Company name is a large corporation, established in 1991, and has over x employees. Their main goal is to deliver high quality apllications solutions, that make their customers life easier to do their work....  etc</span></p>
<p></p>
<p><span style="font-family: Arial;"><strong>Job description</strong></span></p>
<p><span style="color: rgb(71,68,69);background-color: rgb(255,255,255);font-size: 16px;font-family: Arial;">As an established digital leader, youhave the skills to influence at every level, imparting your digital knowledge and skills in a constructive, empowering, and collaborative way. Working closely with our top employees.</span>&nbsp;</p>
<p><span style="font-family: Arial;">More descrioption description of the job, keep in mind candidates will read this and have a feeling of what they will be working with if they got his job etc, .. include, work place, environment, and exciting stuff here! etc</span></p>
<p></p>
<p><span style="font-family: Arial;"><strong>Responsibility</strong></span></p>
<ul>
<li><span style="font-family: Arial;">Responsibility 1 description</span></li>
<li><span style="color: rgb(33,37,41);background-color: rgb(255,255,255);font-size: 16px;font-family: Arial;">Responsibility 2 description</span>&nbsp;</li>
<li><span style="font-family: Arial;">etc</span></li>
</ul>
<p></p>
<p><span style="font-family: Arial;"><strong>Qualification</strong></span></p>
<ul>
<li><span style="color: rgb(71,68,69);background-color: rgb(255,255,255);font-size: 16px;font-family: Arial;">Abachelor'sdegree inanIT relatedfield. </span></li>
<li><span style="color: rgb(71,68,69);background-color: rgb(255,255,255);font-size: 16px;font-family: Arial;">Alternatively, experience with well documented results can compensate for formal education.</span></li>
<li><span style="color: rgb(71,68,69);background-color: rgb(255,255,255);font-size: 16px;font-family: Arial;">etc</span>&nbsp;</li>
</ul>
<p></p>
<p><span style="font-family: Arial;"><strong>Personality</strong></span></p>
<p><span style="font-family: Arial;">We are looking for candidates with a "<em>technical know how</em>"  attitude who is pasionate and have keen interest in working as an IT developer or in an IT company to solve complex problems everyday.... etc</span><br></p>
<p><span style="font-family: Arial;">The following are some of the qualities we look for among our candidates</span></p>
<ul>
<li><span style="font-family: Arial;">Passionate about safety and quality</span></li>
<li><span style="font-family: Arial;">Ability to discuss/communicate with other employees, to discuss on ideas and issues that needs to be solved.</span></li>
<li><span style="font-family: Arial;">etc</span></li>
</ul>
<p></p>
<p><span style="font-family: Arial;"><strong>This job offers</strong></span></p>
<ul>
<li><span style="font-family: Arial;">Opportunity to participate in one of the largest company, among other things.</span></li>
<li><span style="font-family: Arial;">Personal growth and development of advanced knowledge</span></li>
<li><span style="font-family: Arial;">6 weeks vacation / year</span></li>
</ul>
<p></p>
`;

let newJobTemplateN = `
    <h4><span style="color: rgb(47,47,53);background-color: rgb(255,255,255);font-size: 24px;font-family: Arial;">Jobb tittel</span></h4>
<p style="margin-left:0in;"><span style="color: rgb(33,37,41);font-size: 12pt;font-family: Arial;"><strong>Ansatter: </strong>Selskapsnavn</span>&nbsp;</p>
<p style="margin-left:0in;"><span style="color: rgb(33,37,41);background-color: white;font-size: 12pt;font-family: Arial;"><strong>Frist: </strong>27.02.2021 </span>&nbsp;</p>
<p style="margin-left:0in;"><span style="color: rgb(33,37,41);background-color: white;font-size: 12pt;font-family: Arial;"><strong>Arbeidssted: </strong>Bergen</span></p>
<p></p>
<p><span style="color: rgb(33,37,41);background-color: white;font-size: 12pt;font-family: Arial;"><strong>Om selskapet</strong></span>&nbsp;</p>
<p style="margin-left:0in;"><span style="font-family: Arial;">Eksempel firma er en stor selskap, etablert i 1991, og har over x ansatte. Hovedmålet deres er å levere høykvalitets applikasjonsløsninger, som gjør kundenes liv lettere å gjøre jobben sin ... osv</span></p>
<p></p>
<p><span style="font-family: Arial;"><strong>Stillingsbeskrivelse</strong></span></p>
<p><span style="color: rgb(71,68,69);background-color: rgb(255,255,255);font-size: 16px;font-family: Arial;">Som en etablert digital leder har du ferdighetene til å påvirke på alle nivåer, og formidler din digitale kunnskap og ferdigheter på en konstruktiv, styrkende og samarbeidsvillig måte. Jobber tett med våre topp ansatte.</span>&nbsp;</p>
<p><span style="font-family: Arial;">Mer beskrivelse av jobben, husk at kandidater vil lese dette og ha en følelse av hva de vil jobbe med hvis de fikk jobben osv., Inkluderer, arbeidsplass, miljø og spennende ting her! etc</span></p>
<p></p>
<p><span style="font-family: Arial;"><strong>Ansvar</strong></span></p>
<ul>
<li><span style="font-family: Arial;">Ansvars 1 beskrivelse</span></li>
<li><span style="color: rgb(33,37,41);background-color: rgb(255,255,255);font-size: 16px;font-family: Arial;">Ansvars 2 beskrivelse</span>&nbsp;</li>
<li><span style="font-family: Arial;">etc</span></li>
</ul>
<p></p>
<p><span style="font-family: Arial;"><strong>Kvalifikasjonskrav</strong></span></p>
<ul>
<li><span style="color: rgb(71,68,69);background-color: rgb(255,255,255);font-size: 16px;font-family: Arial;">Bachelor grad i gjeldende område. </span></li>
<li><span style="color: rgb(71,68,69);background-color: rgb(255,255,255);font-size: 16px;font-family: Arial;">Alternativt kan erfaring med veldokumenterte resultater kompensere for formell utdanning</span></li>
<li><span style="color: rgb(71,68,69);background-color: rgb(255,255,255);font-size: 16px;font-family: Arial;">etc</span>&nbsp;</li>
</ul>
<p></p>
<p><span style="font-family: Arial;"><strong>Personalitet</strong></span></p>
<p><span style="font-family: Arial;">Wea leter etter kandidater med en "<em> teknisk kunnskap </em>" -holdning som er pasjonate og har stor interesse for å jobbe som IT-utvikler eller i et IT-selskap for å løse komplekse problemer hver dag .... osv.</span><br></p>
<p><span style="font-family: Arial;">Følgende er noen av egenskapene vi ser etter blant kandidatene våre</span></p>
<ul>
<li><span style="font-family: Arial;">Lidenskapelig om sikkerhet og kvalitet</span></li>
<li><span style="font-family: Arial;">Evner til å kune samarbeide og diskutere / kommunisere med andre ansatte, diskutere ideer og problemstillinger som må løses.</span></li>
<li><span style="font-family: Arial;">etc</span></li>
</ul>
<p></p>
<p><span style="font-family: Arial;"><strong>Arbeidsplassen tilbyr</strong></span></p>
<ul>
<li><span style="font-family: Arial;">Mulighet til å delta i et av de største selskapene, blant annet.</span></li>
<li><span style="font-family: Arial;">Personlig vekst og utvikling av forskjellige avanserte kunnskaper</span></li>
<li><span style="font-family: Arial;">6 ukers ferie / år</span></li>
</ul>
<p></p>
`;


export const TextEditorWYSIWYG = (props) => {
    const {t, i18n} = useTranslation("SL_languages");
    let shouldPrompt = false;
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    useEffect(() => {
        try {
            let savedEditHtml = JSON.parse(localStorage.getItem("tempFormData"));
            if (savedEditHtml) {
                newJobTemplateE = savedEditHtml;
            }
        } catch (e) {
            console.log("////: Error reading from ls! ", e);
        }
        let contentBlock;
        console.log("////:WYSIWYG ", i18n.language);
        if (i18n.language === "en") {
            contentBlock = htmlToDraft(newJobTemplateE);
        } else {
            contentBlock = htmlToDraft(newJobTemplateN);
        }
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(
                contentBlock.contentBlocks
            );
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
            props.setFormData(editorState);
        }
        return () => {
            //cleanup
        }
    }, [t]);

    return (
        <div>
            <Prompt when={shouldPrompt} message={props.promptMsg}/>
            <Editor
                // editorStyle={{lineHeight: 'nop!'}}
                toolbarClassName="mainToolBarWrapper"
                wrapperClassName="toolWrapper"
                editorClassName="editor"
                toolbar={{
                    options: ["inline", "textAlign", "blockType", "fontSize", "fontFamily", "list", "link", "colorPicker", "history", "emoji"],
                    // image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } },
                    link: {inDropdown: false},
                    list: {inDropdown: false}
                }}
                editorState={editorState}
                onEditorStateChange={(es) => {
                    setEditorState(es);
                    try {
                        let editedToHtml = JSON.stringify(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                        localStorage.setItem("tempFormData", editedToHtml);
                    } catch (e) {
                        console.log("////: Error saving to ls! ", e);
                        shouldPrompt = true;
                    }
                    props.setFormData(es);
                }}/>
        </div>
    );
}


