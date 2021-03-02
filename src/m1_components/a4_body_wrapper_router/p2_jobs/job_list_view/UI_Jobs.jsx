import React, {useEffect, useState} from "react";
import "./ST_Jobs.scss";
import {useTranslation} from "react-i18next";
import {IconContext} from "react-icons";
import {MdWork} from "react-icons/md";
import {FaMapMarkerAlt} from "react-icons/fa";
import {UI_jlist_card} from "../../../a0_shared_all/job_list_card/UI_jlist_card";
import {Link, useHistory, useParams} from "react-router-dom";
import {MdEmail} from "react-icons/md";
import {useAuth} from "../../../c1_auth/a0_auth_common/firebase/AuthContext";
import {showToast} from "../../../../UI_Main_pages_wrapper";
import jlcStyle from "../../../a0_shared_all/job_list_card/ST_jlist_card.module.scss";

export const UI_Jobs = () => {

    const {t, i18n} = useTranslation("SL_languages");
    const history = useHistory();

    const [isAdminSignedIn, setIsAdminSignedIn] = useState(true); //////////////
    const [loading, setLoading] = useState(false);
    const {read_job} = useAuth();
    const [listOfJobs, setListOfJobs] = useState(null);
    const [listOfJobsOrigBK, setListOfJobsOrigBK] = useState(null);
    //[ IT Developer | Project manager | Architect | Fultime | Part time | Project ]
    const [filter, setFilter] = useState([false, false, false, false, false, false]);
    const [filteredExist, setFilteredExist] = useState(true);
    const [isListOfJobsIsEmpty, setIsListOfJobsEmpty] = useState(false);

    useEffect(() => {
        let jobTypeFilter = [];
        let workHourFilter = [];

        if (listOfJobsOrigBK !== null && filter.includes(true)) {
            //Job type filter | stage1 filter
            let jobTypeFilterBaseAr = (workHourFilter.length < 1) ? listOfJobsOrigBK : jobTypeFilter;
            if (filter[0] || filter[1] || filter[2]) {
                jobTypeFilterBaseAr.forEach((aJob) => {
                    let aJobHasJobType_MatchingFilter = (
                        (aJob.jobAr[0] & filter[0]) ||
                        (aJob.jobAr[1] & filter[1]) ||
                        (aJob.jobAr[2] & filter[2])
                    );
                    if (aJobHasJobType_MatchingFilter) {
                        jobTypeFilter.push(aJob);
                    }
                });
                workHourFilter = [];
            }
            //Work hour filter | | stage2 filter
            let workHourFilterBaseAr = (jobTypeFilter.length < 1) ? listOfJobsOrigBK : jobTypeFilter;
            if (filter[3] || filter[4] || filter[5]) {
                workHourFilterBaseAr.forEach((filteredJob) => {
                    let aJobHasWorkHours_MatchingFilter = (
                        (filteredJob.jobAr[3] & filter[3]) ||
                        (filteredJob.jobAr[4] & filter[4]) ||
                        (filteredJob.jobAr[5] & filter[5])
                    );
                    if (aJobHasWorkHours_MatchingFilter) {
                        workHourFilter.push(filteredJob);
                    }
                });
                jobTypeFilter = [];
            }

            if (workHourFilter.length > 0) {
                setListOfJobs(workHourFilter);
                setFilteredExist(true);
            } else if (jobTypeFilter.length > 0) {
                setListOfJobs(jobTypeFilter);
                setFilteredExist(true);
            } else {
                setListOfJobs([]);
                setFilteredExist(false);
            }
        } else {
            setListOfJobs(listOfJobsOrigBK);
        }
    }, [filter]);


    const handleIsIncludedCB = (cbValue, cbName) => {
        let newWhatToFilter = [...filter];
        switch (cbName) {
            case "itdev":
                newWhatToFilter[0] = cbValue;
                break;
            case "projM":
                newWhatToFilter[1] = cbValue;
                break;
            case "arch":
                newWhatToFilter[2] = cbValue;
                break;
            case "fultime":
                newWhatToFilter[3] = cbValue;
                break;
            case "pt":
                newWhatToFilter[4] = cbValue;
                break;
            case "project":
                newWhatToFilter[5] = cbValue;
                break;
            default:
                newWhatToFilter = [false, false, false, false, false, false];
                break;
        }
        setFilter(newWhatToFilter); //update for tracker for filtered or not!
    };

    const handleJobAddition = () => {
        if (isAdminSignedIn) {
            history.push("jobs/jobeditor");
            // history.push("jobs/jobeditor/123");
        } else {
            alert("Get in touch with us!");
        }
    };

    const fetchListOfJobs = async () => {
        setLoading(true);
        await read_job().then(snapshot => {
            if (snapshot.val() !== null) {
                let fetchedJobsList = [];
                snapshot.forEach((aSnapShot) => {
                    let snData = {
                        snKey: "",
                        jobAr: [],
                        jobTxtRawTableData: null,
                        txtInHTMLform: "",
                        postedDate: ""
                    };
                    snData.snKey = aSnapShot.key;
                    snData.jobAr = JSON.parse(aSnapShot.val()[0]);
                    snData.jobTxtRawTableData = JSON.parse(aSnapShot.val()[1][0]).blocks;
                    snData.txtInHTMLform = JSON.parse(aSnapShot.val()[1][1]);
                    snData.postedDate = JSON.parse(aSnapShot.val()[2]);

                    fetchedJobsList.push(snData);
                });
                fetchedJobsList.reverse();
                setListOfJobs(fetchedJobsList);
                setListOfJobsOrigBK(fetchedJobsList);
                setLoading(false);

                if (fetchedJobsList.length < 1) {
                    setIsListOfJobsEmpty(true);
                } else {
                    setIsListOfJobsEmpty(false);
                }
            }
        });
    }

    useEffect(() => {
        fetchListOfJobs().then(r => {
            setLoading(false);
        });
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
        <main className={"jobs_list_main_wrapper "}>
            <header className={"jobs_header"}>
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

            <section className={"row asidePmainRow "}>
                <div className={"asideRow_wrapper col-xl-3 py-2"}>
                    <div className={"row asideRow "}>
                        <h5 style={{
                            color: "#ffffff",
                            fontWeight: "400",
                            marginTop: "20px",
                            marginBottom: "20px"
                        }}>{t("jobs.filter")}</h5>
                        <div className={"as1  col-xl-12 col-md-6 col-sm-12 "}>
                            <p style={{fontWeight: "600", color: "#248c9d"}}>{t("jform.jobType")}</p>
                            <ul>
                                <li>
                                    <div className="form-check my-2">
                                        <input onChange={(e) => {
                                            handleIsIncludedCB(e.target.checked, "itdev");
                                        }} className="form-check-input" type="checkbox" value=""
                                               id="flexCheckDefault"/>
                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                            {t("jform.itdev")}
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check my-2">
                                        <input onChange={(e) => {
                                            // setWhatToFilter
                                            // e.target.checked
                                            handleIsIncludedCB(e.target.checked, "projM");
                                        }} className="form-check-input" type="checkbox" value=""
                                               id="flexCheckDefault"/>
                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                            {t("jform.projM")}
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check my-2">
                                        <input onChange={(e) => {
                                            // setWhatToFilter
                                            // e.target.checked
                                            handleIsIncludedCB(e.target.checked, "arch");
                                        }} className="form-check-input" type="checkbox" value=""
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
                                        <input onChange={(e) => {
                                            // setWhatToFilter
                                            // e.target.checked
                                            handleIsIncludedCB(e.target.checked, "fultime");
                                        }} className="form-check-input" type="checkbox" value=""
                                               id="flexCheckDefault"/>
                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                            {t("jform.fultime")}
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check my-2">
                                        <input onChange={(e) => {
                                            // setWhatToFilter
                                            // e.target.checked
                                            handleIsIncludedCB(e.target.checked, "pt");
                                        }} className="form-check-input" type="checkbox" value=""
                                               id="flexCheckDefault"/>
                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                            {t("jform.pt")}
                                        </label>
                                    </div>
                                </li>
                                <li>
                                    <div className="form-check my-2">
                                        <input onChange={(e) => {
                                            // setWhatToFilter
                                            // e.target.checked
                                            handleIsIncludedCB(e.target.checked, "project");
                                        }} className="form-check-input" type="checkbox" value=""
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
                        <header className={"top_bar "}>
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
                                <div className={"list_header_textDiv"} style={{color: "#ffffff"}}>
                                    {t("jform.jobType")}
                                </div>

                            </div>
                            {/* /////////////////hide for any < xl = 1200px*/}
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
                            return <UI_jlist_card key={oneJobL.snKey} aJobData={oneJobL}/>
                        })
                    }
                    <div hidden={filteredExist} className={"noResult"}>
                        <h3 style={{color:"white"}}>{t("jobs.noRes")}</h3>
                    </div>
                </div>
            </section>

        </main>
    );
};

