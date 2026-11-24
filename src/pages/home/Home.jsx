import React from "react";

import "./style.scss";

import HeroBanner from "./heroBanner/HeroBanner";
import GenreChips from "./genreChips/GenreChips";
import TopTen from "./topTen/TopTen";
import SpotlightRow from "./spotlight/SpotlightRow";
import Popular from "./popular/Popular";
import TopRated from "./topRated/TopRated";

const Home = () => {
    return (
        <div className="homePage">
            <HeroBanner />
            <GenreChips />
            <TopTen />
            <SpotlightRow />
            <Popular />
            <TopRated />
        </div>
    );
};

export default Home;
