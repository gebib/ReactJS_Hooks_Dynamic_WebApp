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


export const UI_Jobs = () => {

    const {t, i18n} = useTranslation("SL_languages");
    const history = useHistory();

    const [isAdminSignedIn, setIsAdminSignedIn] = useState(true); //////////////
    const [loading, setLoading] = useState(false);
    const {read_job} = useAuth();
    const [listOfJobs, setListOfJobs] = useState(null);
    // const [filteredListOfJobs, setFilteredListOfJobs] = useState(null);
    //for filter reference, holds original none filtered list of jobs.
    const [listOfJobsOrigBK, setListOfJobsOrigBK] = useState(null);
    const [listOfJobsFilteredBK, setListOfJobsFilteredBK] = useState(null);

    //[ IT Developer | Project manager | Architect | Fultime | Part time | Project ]
    const [filter, setFilter] = useState([false, false, false, false, false, false]);
    //what filter index was changed?: for if <=2 else..
    const [filterIndex, setFilterIndex] = useState(0);


    useEffect(() => {

        let filteredJobsList = [];
        // filter for: [IT Developer | Project manager | Architect]
        if (filterIndex <= 2) {
            if (listOfJobsOrigBK !== null) {
                listOfJobsOrigBK.forEach((aJob) => {
                    if (filter[0] && aJob.jobTypeAndContAr[0] || filter[1] && aJob.jobTypeAndContAr[1] || filter[2] && aJob.jobTypeAndContAr[2]) {
                        filteredJobsList.push(aJob);
                    }
                });
                if ((filteredJobsList.length >= 1)) {
                    setListOfJobs(filteredJobsList);
                    setListOfJobsFilteredBK(filteredJobsList);
                } else {
                    setListOfJobs(listOfJobsOrigBK);
                    setListOfJobsFilteredBK(listOfJobsFilteredBK);
                }
            }
        }
    }, [filter]);

    useEffect(() => {
        let filteredJobsList = [];
        //if there exist filtered list of jobs: filter for: [Fultime | Part time | Project]
        if (filterIndex >= 3) {
            if (listOfJobsFilteredBK !== null) {
                listOfJobsFilteredBK.forEach((aJob) => {
                    if (filter[3] && aJob.jobTypeAndContAr[3] || filter[4] && aJob.jobTypeAndContAr[4] || filter[5] && aJob.jobTypeAndContAr[5]) {
                        filteredJobsList.push(aJob);
                    }
                });
                if ((filteredJobsList.length >= 1)) {
                    setListOfJobs(filteredJobsList);
                } else {
                    setListOfJobs(listOfJobsFilteredBK);
                }
            }
        }
    }, [filter]);


    const handleIsIncludedCB = (cbValue, cbName) => {
        let newWhatToFilter = [...filter];
        switch (cbName) {
            case "itdev":
                newWhatToFilter[0] = cbValue;
                setFilterIndex(0);
                break;
            case "projM":
                newWhatToFilter[1] = cbValue;
                setFilterIndex(1);
                break;
            case "arch":
                newWhatToFilter[2] = cbValue;
                setFilterIndex(2);
                break;
            case "fultime":
                newWhatToFilter[3] = cbValue;
                setFilterIndex(3);
                break;
            case "pt":
                newWhatToFilter[4] = cbValue;
                setFilterIndex(4);
                break;
            case "project":
                newWhatToFilter[5] = cbValue;
                setFilterIndex(5);
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
                        jobTypeAndContAr: [],
                        jobTxtRawTableData: null,
                        txtInHTMLform: "",
                        postedDate: ""
                    };
                    snData.snKey = aSnapShot.key;
                    snData.jobTypeAndContAr = JSON.parse(aSnapShot.val()[0]);
                    snData.jobTxtRawTableData = JSON.parse(aSnapShot.val()[1][0]).blocks;
                    snData.txtInHTMLform = JSON.parse(aSnapShot.val()[1][1]);
                    snData.postedDate = JSON.parse(aSnapShot.val()[2]);

                    fetchedJobsList.push(snData);
                });
                fetchedJobsList.reverse();
                setListOfJobs(fetchedJobsList);
                setListOfJobsOrigBK(fetchedJobsList);
                setListOfJobsFilteredBK(fetchedJobsList);
                setLoading(false);
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
                                {/*<UI_drop_down/>*/}
                                <div className={"list_header_textDiv"} style={{color: "#ffffff"}}>
                                    {t("jform.jobType")}
                                </div>

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
                            return <UI_jlist_card key={oneJobL.snKey} aJobData={oneJobL}/>
                        })
                    }
                </div>
            </section>

        </main>
    );
}
