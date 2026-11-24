import React from "react";
import { useNavigate } from "react-router-dom";

import "./style.scss";

import ContentWrapper from "../../components/contentWrapper/ContentWrapper";

const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="pageNotFound">
            <ContentWrapper>
                <span className="bigText">404</span>
                <span className="smallText">Page not found!</span>
                <button
                    type="button"
                    className="homeBtn"
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </button>
            </ContentWrapper>
        </div>
    );
};

export default PageNotFound;
