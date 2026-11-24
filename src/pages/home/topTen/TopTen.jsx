import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./style.scss";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import SwitchTabs from "../../../components/switchTabs/SwitchTabs";
import Img from "../../../components/lazyLoadImage/Img";
import PosterFallback from "../../../assets/no-poster.png";
import WatchlistButton from "../../../components/watchlistButton/WatchlistButton";
import ErrorMessage from "../../../components/errorMessage/ErrorMessage";

import useFetch from "../../../hooks/useFetch";

// Netflix-style Top 10: a giant rank numeral beside each poster.
const TopTen = () => {
    const [endpoint, setEndpoint] = useState("day");
    const { url } = useSelector((state) => state.home);
    const navigate = useNavigate();

    const { data, loading, error } = useFetch(`/trending/movie/${endpoint}`);

    const onTabChange = (tab) => {
        setEndpoint(tab === "Day" ? "day" : "week");
    };

    const items = data?.results?.slice(0, 10) || [];

    return (
        <div className="topTen">
            <ContentWrapper>
                <div className="topTenHead">
                    <span className="carouselTitle">Top 10 Trending</span>
                    <SwitchTabs data={["Day", "Week"]} onTabChange={onTabChange} />
                </div>
                {loading ? (
                    <div className="topTenSkeleton">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="skeletonItem">
                                <div className="posterBlock skeleton"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <ErrorMessage />
                ) : (
                    <div className="topTenItems">
                        {items.map((item, index) => {
                            const posterUrl = item.poster_path
                                ? url.poster + item.poster_path
                                : PosterFallback;
                            return (
                                <div
                                    key={item.id}
                                    className="topTenItem"
                                    onClick={() =>
                                        navigate(`/movie/${item.id}`)
                                    }
                                >
                                    <span className="rank">{index + 1}</span>
                                    <div className="posterBlock">
                                        <Img src={posterUrl} />
                                        <div
                                            className="watchlistWrap"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <WatchlistButton
                                                item={{
                                                    id: item.id,
                                                    media_type: "movie",
                                                    title:
                                                        item.title ||
                                                        item.name,
                                                    poster_path:
                                                        item.poster_path,
                                                    release_date:
                                                        item.release_date,
                                                    vote_average:
                                                        item.vote_average,
                                                    genre_ids:
                                                        item.genre_ids,
                                                    overview: item.overview,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </ContentWrapper>
        </div>
    );
};

export default TopTen;
