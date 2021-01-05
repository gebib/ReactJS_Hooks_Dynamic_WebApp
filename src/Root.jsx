import React, { useState } from "react";
import './Root.scss';

export default function Root() {
    const [count, setCount] = useState(0);
    return (
        <div>
            app component ok.
        </div>
    );
}