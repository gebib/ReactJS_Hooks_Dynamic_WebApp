import React, { useState } from "react";
export const FullPageLoader = () => {
    return (
        <div>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow"  role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}