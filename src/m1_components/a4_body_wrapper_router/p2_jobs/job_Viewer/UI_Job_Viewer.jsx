
//             {/*{isAdminSignedIn ? <div  className={jlcStyle.list_header_textDiv}>*/}
//             {/*    <IconContext.Provider onClick={() => {*/}
//             {/*        handleAdminTaskEdit(props.aJobData.snKey);*/}
//             {/*    }} value={{size: "2em", color: "#123456", "&:hover":{color: "green"} }}>*/}
//             {/*        <RiEdit2Fill className={jlcStyle.admBtn}/>*/}
//             {/*    </IconContext.Provider>*/}
//             {/*    <IconContext.Provider onClick={() => {*/}
//             {/*        handleAdminTaskDelete(props.aJobData.snKey);*/}
//             {/*    }} value={{size: "2em", color: "#8d4016"}}>*/}
//             {/*        <MdDeleteForever className={jlcStyle.admBtn}/>*/}
//             {/*    </IconContext.Provider>*/}
//             {/*</div> : <div className={"list_header_textDiv"}>*/}
//             {/*    <IconContext.Provider value={{size: "2em"}}>*/}
//             {/*        <BsBoxArrowUpRight style={{color: "#248C9D"}}/>*/}
//             {/*    </IconContext.Provider>*/}
//             {/*</div>}*/}

import "./ST_Job_Viewer.scss";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import "./ST_Job_Viewer.scss";
import {useParams} from "react-router-dom";
import {useAuth} from "../../../c1_auth/a0_auth_common/firebase/AuthContext";


export const UI_Job_Viewer = () => {
    const {t, i18n} = useTranslation("SL_languages");

    const jobId = useParams();
    const [jobToView, setJobToView] = useState();
    const {read_job_single} = useAuth();

    const fetchSingleJobById = async () => {
        return await read_job_single(jobId.id);
    }

    useEffect(() => {
        console.log("fe JVok");
        fetchSingleJobById().then(child => {
            if (child.val() !== null) {
                let snData = {
                    snKey: child.key,
                    jobTypeAndContAr: JSON.parse(child.val()[0]),
                    jobTxtRawTableData: JSON.parse(child.val()[1][0]).blocks,
                    txtInHTMLform: JSON.parse(child.val()[1][1]),
                    postedDate: JSON.parse(child.val()[2])
                }
                setJobToView(snData);
                console.log("////:child!!!!! ", snData);
            }
        });
        return () => {
            //cleanup
        }
    }, [/*for update on change*/]);

    useEffect(() => {
        // console.log("////:aJob! ", jobToView);
        return () => {
            //cleanup
        }
    }, [/*for update on change*/]);


    return (
        <main className={"jobs_view_main"}>
            {/*<Prompt when={shouldPrompt} message={t("jform.touchedInfo")}/>*/}
            <div className={"container jobs_view_bgi"}/>
            <div className={"view_wrapper row"}>
                <div className={"editor_view_left col-sm-12 col-xl-8"}>
                    {/*<TextEditorWYSIWYG promptMsg={t("jform.touchedInfo")} setFormData={handleWYSIWYG}/>*/}
                    <p>anonse</p>
                </div>
                {/*////////////////////////////Right side control panel/////////////////////*/}
                <div className={"editor_view_right col-sm-12 col-xl-4 order-lg-last"}>
                    <div className={"ed_f_r_top row py-3 "}>
                        <p>side stoff</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
