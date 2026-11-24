import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { BsStarFill } from "react-icons/bs";

import "./style.scss";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import Img from "../../../components/lazyLoadImage/Img";
import ErrorMessage from "../../../components/errorMessage/ErrorMessage";

import useFetch from "../../../hooks/useFetch";

// Wide landscape spotlight cards: backdrop art with the title and rating
// overlaid, instead of another portrait-poster row.
const SpotlightRow = () => {
    const { url } = useSelector((state) => state.home);
    const navigate = useNavigate();

    const { data, loading, error } = useFetch("/movie/now_playing");

    const items =
        data?.results?.filter((item) => item.backdrop_path).slice(0, 10) ||
        [];

    return (
        <div className="spotlightRow">
            <ContentWrapper>
                <span className="carouselTitle">Now Playing in Cinemas</span>
                {loading ? (
                    <div className="spotlightSkeleton">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="skeletonItem">
                                <div className="spotlightCard skeleton"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <ErrorMessage />
                ) : (
                    <div className="spotlightItems">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="spotlightCard"
                                onClick={() => navigate(`/movie/${item.id}`)}
                            >
                                <Img
                                    src={url.backdrop + item.backdrop_path}
                                />
                                <div className="spotlightInfo">
                                    <span className="spotlightTitle">
                                        {item.title || item.name}
                                    </span>
                                    <span className="spotlightMeta">
                                        {item.vote_average > 0 && (
                                            <span className="rating">
                                                <BsStarFill />
                                                {item.vote_average.toFixed(1)}
                                            </span>
                                        )}
                                        {item.release_date && (
                                            <span className="year">
                                                {dayjs(
                                                    item.release_date
                                                ).format("YYYY")}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ContentWrapper>
        </div>
    );
};

export default SpotlightRow;
