import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { BsStarFill } from "react-icons/bs";

import "./style.scss";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import useFetch from "../../../hooks/useFetch";
import Genres from "../../../components/genres/Genres";
import ErrorMessage from "../../../components/errorMessage/ErrorMessage";
import Img from "../../../components/lazyLoadImage/Img.jsx";
import WatchlistButton from "../../../components/watchlistButton/WatchlistButton";
import PosterFallback from "../../../assets/no-poster.png";
import { PlayIcon } from "../Playbtn";
import VideoPopup from "../../../components/videoPopup/VideoPopup";

const DetailsBanner = ({ video, crew }) => {
    const [show, setShow] = useState(false);
    const [videoId, setVideoId] = useState(null);

    const { mediaType, id } = useParams();
    const { data, loading, error } = useFetch(`/${mediaType}/${id}`);

    const { url } = useSelector((state) => state.home);

    const _genres = data?.genres?.map((g) => g.id);

    const director = crew?.filter((f) => f.job === "Director");
    const writer = crew?.filter(
        (f) => f.job === "Screenplay" || f.job === "Story" || f.job === "Writer"
    );

    const toHoursAndMinutes = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
    };

    const releaseDate = data?.release_date || data?.first_air_date;

    return (
        <div className="detailsBanner">
            {!loading ? (
                error ? (
                    <ContentWrapper>
                        <ErrorMessage />
                    </ContentWrapper>
                ) : (
                    <>
                        {!!data && (
                        <React.Fragment>
                            {/* Backdrop-led hero: the artwork is the banner,
                                title / rating / actions sit on top of it. */}
                            <div className="backdropHero">
                                <div className="backdrop-img">
                                    <Img
                                        src={
                                            url.backdrop + data.backdrop_path
                                        }
                                    />
                                </div>
                                <div className="opacity-layer"></div>
                                <ContentWrapper>
                                    <div className="heroContent">
                                        <span className="eyebrow">
                                            {mediaType === "tv"
                                                ? "TV Show"
                                                : "Movie"}
                                        </span>
                                        <h1 className="title">
                                            {data.name || data.title}
                                        </h1>
                                        {data.tagline && (
                                            <div className="subtitle">
                                                {data.tagline}
                                            </div>
                                        )}
                                        <div className="metaRow">
                                            {data.vote_average >= 7 && (
                                                <span className="match">
                                                    {Math.round(
                                                        data.vote_average * 10
                                                    )}
                                                    % Match
                                                </span>
                                            )}
                                            {data.vote_average > 0 && (
                                                <span className="rating">
                                                    <BsStarFill />
                                                    {data.vote_average.toFixed(
                                                        1
                                                    )}
                                                </span>
                                            )}
                                            {releaseDate && (
                                                <span className="metaItem">
                                                    {dayjs(releaseDate).format(
                                                        "YYYY"
                                                    )}
                                                </span>
                                            )}
                                            {data.runtime > 0 && (
                                                <span className="metaItem">
                                                    {toHoursAndMinutes(
                                                        data.runtime
                                                    )}
                                                </span>
                                            )}
                                            {data.status && (
                                                <span className="metaItem">
                                                    {data.status}
                                                </span>
                                            )}
                                        </div>
                                        <Genres data={_genres} />
                                        <div className="actions">
                                            <div
                                                className="playbtn"
                                                onClick={() => {
                                                    setShow(true);
                                                    setVideoId(video?.key);
                                                }}
                                            >
                                                <PlayIcon />
                                                <span className="text">
                                                    Watch Trailer
                                                </span>
                                            </div>
                                            <WatchlistButton
                                                withLabel
                                                item={{
                                                    id: data.id,
                                                    media_type: mediaType,
                                                    title:
                                                        data.title ||
                                                        data.name,
                                                    poster_path:
                                                        data.poster_path,
                                                    release_date:
                                                        data.release_date ||
                                                        data.first_air_date,
                                                    vote_average:
                                                        data.vote_average,
                                                    genre_ids: _genres,
                                                    overview: data.overview,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </ContentWrapper>
                            </div>

                            {/* Poster + overview + facts in the content flow. */}
                            <div className="detailsBody">
                                <ContentWrapper>
                                    <div className="bodyGrid">
                                        <div className="posterCol">
                                            {data.poster_path ? (
                                                <Img
                                                    className="posterImg"
                                                    src={
                                                        url.poster +
                                                        data.poster_path
                                                    }
                                                />
                                            ) : (
                                                <Img
                                                    className="posterImg"
                                                    src={PosterFallback}
                                                />
                                            )}
                                        </div>
                                        <div className="infoCol">
                                            <div className="overview">
                                                <div className="heading">
                                                    Overview
                                                </div>
                                                <div className="description">
                                                    {data.overview}
                                                </div>
                                            </div>
                                            <div className="facts">
                                                {releaseDate && (
                                                    <div className="factRow">
                                                        <span className="label">
                                                            Release Date
                                                        </span>
                                                        <span className="value">
                                                            {dayjs(
                                                                releaseDate
                                                            ).format(
                                                                "MMM D, YYYY"
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                                {data.runtime > 0 && (
                                                    <div className="factRow">
                                                        <span className="label">
                                                            Runtime
                                                        </span>
                                                        <span className="value">
                                                            {toHoursAndMinutes(
                                                                data.runtime
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                                {data.status && (
                                                    <div className="factRow">
                                                        <span className="label">
                                                            Status
                                                        </span>
                                                        <span className="value">
                                                            {data.status}
                                                        </span>
                                                    </div>
                                                )}
                                                {director?.length > 0 && (
                                                    <div className="factRow">
                                                        <span className="label">
                                                            Director
                                                        </span>
                                                        <span className="value">
                                                            {director
                                                                ?.map(
                                                                    (d) =>
                                                                        d.name
                                                                )
                                                                .join(", ")}
                                                        </span>
                                                    </div>
                                                )}
                                                {writer?.length > 0 && (
                                                    <div className="factRow">
                                                        <span className="label">
                                                            Writer
                                                        </span>
                                                        <span className="value">
                                                            {writer
                                                                ?.map(
                                                                    (d) =>
                                                                        d.name
                                                                )
                                                                .join(", ")}
                                                        </span>
                                                    </div>
                                                )}
                                                {data?.created_by?.length >
                                                    0 && (
                                                    <div className="factRow">
                                                        <span className="label">
                                                            Creator
                                                        </span>
                                                        <span className="value">
                                                            {data?.created_by
                                                                ?.map(
                                                                    (d) =>
                                                                        d.name
                                                                )
                                                                .join(", ")}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </ContentWrapper>
                            </div>
                            <VideoPopup
                                show={show}
                                setShow={setShow}
                                videoId={videoId}
                                setVideoId={setVideoId}
                            />
                        </React.Fragment>
                    )}
                    </>
                )
            ) : (
                <div className="detailsBannerSkeleton">
                    <div className="bannerSkeleton skeleton"></div>
                    <ContentWrapper>
                        <div className="bodySkeleton">
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                        </div>
                    </ContentWrapper>
                </div>
            )}
        </div>
    );
};

export default DetailsBanner;
