import React, {Suspense, useState} from "react";
import './Main.scss';
import {Row, Col} from "react-bootstrap";
import {Login} from "./components/c1_auth/login/Login";
import {FullPageLoader} from "./resources/miscellaneous/FullPageLoader";


export default function Main() {
    const [count, setCount] = useState(0);
    return (
        <main className={"container_main"}>
            <Suspense fallback={FullPageLoader}>
                <Login/>
            </Suspense>
        </main>
    );
}