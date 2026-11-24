import React from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./style.scss";
import Img from "../lazyLoadImage/Img";
import PosterFallback from "../../assets/no-poster.png";
import WatchlistButton from "../watchlistButton/WatchlistButton";
import { BsStarFill } from "react-icons/bs";

const MovieCard = ({ data, mediaType }) => {
    const { url } = useSelector((state) => state.home);
    const navigate = useNavigate();
    const posterUrl = data.poster_path
        ? url.poster + data.poster_path
        : PosterFallback;
    const watchlistItem = {
        id: data.id,
        media_type: data.media_type || mediaType,
        title: data.title || data.name,
        poster_path: data.poster_path,
        release_date: data.release_date || data.first_air_date,
        vote_average: data.vote_average,
        genre_ids: data.genre_ids,
        overview: data.overview,
    };
    return (
        <div
            className="movieCard"
            onClick={() =>
                navigate(`/${data.media_type || mediaType}/${data.id}`)
            }
        >
            <div className="posterBlock">
                <Img className="posterImg" src={posterUrl} />
                <div className="watchlistWrap">
                    <WatchlistButton item={watchlistItem} />
                </div>
                {data.overview && (
                    <div className="overviewOverlay">{data.overview}</div>
                )}
            </div>
            <div className="textBlock">
                <span className="title">{data.title || data.name}</span>
                <span className="meta">
                    {data.vote_average > 0 && (
                        <span className="rating">
                            <BsStarFill />
                            {data.vote_average.toFixed(1)}
                        </span>
                    )}
                    <span className="year">
                        {dayjs(
                            data.release_date || data.first_air_date
                        ).format("YYYY")}
                    </span>
                </span>
            </div>
        </div>
    );
};

export default MovieCard;
