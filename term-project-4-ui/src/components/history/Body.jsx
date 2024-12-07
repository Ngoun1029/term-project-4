import React from "react";
import Navbar from "../Navbar";
import FetchHistory from "./FetchHistory";

export default function Body() {
    return (
        <div className="ms-36">
            <Navbar />
            <FetchHistory />
        </div>
    );
}
