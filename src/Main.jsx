import React, {Suspense, useState} from "react";
import './Main.scss';

import {Row, Col} from "react-bootstrap";
import {UI_login} from "./m1_components/c1_auth/login/UI_login";
import {FullPageLoader} from "./resources/miscellaneous/FullPageLoader";
import {UI_register} from "./m1_components/c1_auth/register/UI_register";

export default function Main() {
    const [count, setCount] = useState(0);
    return (
        <main className={"container_main"}>
            <Suspense fallback={FullPageLoader}>
                {/*<UI_login/>*/}
                <UI_register/>
            </Suspense>
        </main>
    );
}