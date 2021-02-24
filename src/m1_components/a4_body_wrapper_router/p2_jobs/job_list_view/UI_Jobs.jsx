import React, {useEffect, useState} from "react";
import "./ST_Jobs.scss";
import {useTranslation} from "react-i18next";
import {IconContext} from "react-icons";
import {MdWork} from "react-icons/md";
import {RiArrowDownSLine} from "react-icons/ri";
import {FaMapMarkerAlt} from "react-icons/fa";
import {GrStatusGoodSmall} from "react-icons/gr";
import {UI_jlist_card} from "../../../a0_shared_all/job_list_card/UI_jlist_card";
import Dropdown from "react-bootstrap/Dropdown";
import SelectSearch from 'react-select-search';
import {UI_drop_down} from "../../../a0_shared_all/drop_down/UI_drop_down";
import projMngr from "../../../../resources/images/project-manager.jpg";
import {BsPlusCircleFill} from "react-icons/bs";
import {Link, useHistory, useParams} from "react-router-dom";
import {MdEmail} from "react-icons/md";
import {useAuth} from "../../../c1_auth/a0_auth_common/firebase/AuthContext";


export const UI_Jobs = () => {

    const {t, i18n} = useTranslation("SL_languages");
    const history = useHistory();

    const [isAdminSignedIn, setIsAdminSignedIn] = useState(true); //////////////
    const [loading, setLoading] = useState(false);
    const {read_job} = useAuth();
    const [listOfJobs, setListOfJobs] = useState(null);

    let renderPases = 0;

    const handleJobAddition = () => {
        if (isAdminSignedIn) {
            history.push("jobs/jobeditor");
            // history.push("jobs/jobeditor/123");
        } else {
            alert("Get in touch with us!");
        }
    }

    const fetchListOfJobs = async () => {
        setLoading(true);
        await read_job().then(snapshot => {
            if (snapshot.val() !== null) {
                let fetchedJobsList = [];
                snapshot.forEach((aSnapShot) => {
                    let snData = {
                        snKey: "",
                        jobTypeAndContAr: [],
                        jobTxtRawTableData: null,
                        txtInHTMLform: "",
                        postedDate: ""
                    }
                    snData.snKey = aSnapShot.key;
                    snData.jobTypeAndContAr = JSON.parse(aSnapShot.val()[0]);
                    snData.jobTxtRawTableData = JSON.parse(aSnapShot.val()[1][0]).blocks;
                    snData.txtInHTMLform = JSON.parse(aSnapShot.val()[1][1]);
                    snData.postedDate = JSON.parse(aSnapShot.val()[2]);

                    fetchedJobsList.push(snData);
                });
                setListOfJobs(fetchedJobsList);
                setLoading(false);
                try {
                    localStorage.setItem("fbOkDataCache", JSON.stringify(fetchedJobsList));
                }catch(e){
                    console.log("local storage error! ",e);
                }
            }
        });
    }

    useEffect(() => {
        //effect
        if (localStorage.getItem("fbOkDataCache") !== null) {
            console.log(":FE: locale (cache)");
            setListOfJobs(JSON.parse(localStorage.getItem("fbOkDataCache")));
        } else {
            console.log(":FE: no locale (cache)");
            fetchListOfJobs().then(r => {
                setLoading(false);
            });
        }
        return () => {
            //cleanup
        }
    }, [/*for update on change*/]);

    useEffect(() => {
        //effect
        if (listOfJobs !== null) {
            // console.log("////:state listOfJobs useEf: ",listOfJobs);
        }
        return () => {
            //cleanup
        }
    }, [listOfJobs]);


    return (
        <main className={"container jobs_list_main_wrapper "}>
            <header className={"jobs_header row"}>
                {
                    isAdminSignedIn ? <div className={"manage_job_List"} onClick={handleJobAddition}>
                        <h3 style={{color: "#248C9D"}}>{t("jobs.t1")}</h3>
                    </div> : <div className={"manage_job_List"} onClick={handleJobAddition}>
                        <IconContext.Provider value={{size: "3em"}}>
                            <MdEmail style={{color: "#248C9D", marginRight: "10px"}}/>
                        </IconContext.Provider>
                        <h3>{t("jobs.t2")}</h3>
                    </div>
                }
            </header>

            <section className={"row asidePmainRow d-flex justify-content-center"}>

                <div className={"asideRow_wrapper col-xl-3 py-2"}>
                    <div className={"row asideRow "}>

                        <div className={"as1  col-xl-12 col-md-6 col-sm-12 "}>
                            <p style={{fontWeight: "600", color: "#248c9d"}}>{t("jform.jobType")}</p>
                            <ul>
                                <li>
                                    <div className="form-check my-2">
                                        <input className="form-check-input" type="checkbox" value=""
                                               id="flexCheckDefault"/>
                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                            {t("jform.itdev")}
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check my-2">
                                        <input className="form-check-input" type="checkbox" value=""
                                               id="flexCheckDefault"/>
                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                            {t("jform.projM")}
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check my-2">
                                        <input className="form-check-input" type="checkbox" value=""
                                               id="flexCheckDefault"/>
                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                            {t("jform.arch")}
                                        </label>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className={"as2 col-xl-12 col-md-6 col-sm-12 "}>
                            <p style={{fontWeight: "600", color: "#248c9d"}}>{t("jform.workH")}</p>
                            <ul>
                                <li>
                                    <div className="form-check my-2">
                                        <input className="form-check-input" type="checkbox" value=""
                                               id="flexCheckDefault"/>
                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                            {t("jform.fultime")}
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check my-2">
                                        <input className="form-check-input" type="checkbox" value=""
                                               id="flexCheckDefault"/>
                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                            {t("jform.pt")}
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check my-2">
                                        <input className="form-check-input" type="checkbox" value=""
                                               id="flexCheckDefault"/>
                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                            {t("jform.project")}
                                        </label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={"col bmain"}>
                    <section className={"col2 col"}>
                        <header className={"top_bar row "}>
                            {/*take up 6 for lg else 8 for md*/}
                            <div className={"job_names col"}>
                                <div className={"icon_div"}>
                                    <IconContext.Provider value={{size: "1.5em"}}>
                                        <MdWork className={"d-none d-lg-block"}
                                                style={{marginLeft: "10px", color: "#248c9d"}}/>
                                    </IconContext.Provider>
                                    <div>
                                        <div className={"list_header_textDiv"} style={{color: "#ffffff"}}>
                                            {t("jform.availableJP")}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"type_tag d-none d-lg-block col-2"}>
                                <IconContext.Provider value={{size: "1.5em"}}>
                                    <FaMapMarkerAlt style={{marginLeft: "10px", color: "#E34934"}}/>
                                </IconContext.Provider>
                            </div>
                            <div className={"type_tag d-none d-md-block col-2 d-flex justify-content-center"}>
                                {/*<div className={"wortby_wrap"}>*/}
                                {/*    <div className={"list_header_textDiv"}>Sort by:</div>*/}
                                {/*    <IconContext.Provider value={{size: "1.5em"}}>*/}
                                {/*        <RiArrowDownSLine style={{marginLeft: "10px", color: "#000000"}}/>*/}
                                {/*    </IconContext.Provider>*/}
                                {/*</div>*/}
                                <UI_drop_down/>

                            </div>
                            {/*/////////////////////hide for any < xl = 1200px*/}
                            <div className={"type_tag col-1 d-none d-sm-block"}>
                                <div className={"list_header_textDiv"} style={{color: "#ffffff"}}>
                                </div>
                            </div>
                        </header>
                    </section>
                    {/*//////////////job entry list cards*/}
                    <div className={"spinner_job"}>
                        {loading ?
                            <span className="spinner-border mx-1 text-info spinner-border-sm" role="status"
                                  aria-hidden="true"/> : null}
                    </div>
                    {
                        listOfJobs && listOfJobs.map((oneJobL, index) => {
                            renderPases++;
                            return <UI_jlist_card key={oneJobL.snKey} aJobData={oneJobL}/>
                        })

                    }
                </div>


            </section>

        </main>
    );
}
