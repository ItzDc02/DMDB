import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { BsStarFill, BsPlayFill } from "react-icons/bs";
import "./style.scss";

import useFetch from "../../../hooks/useFetch";
import useSearchSuggestions from "../../../hooks/useSearchSuggestions";
import { fetchDataFromApi } from "../../../utils/api";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import ErrorMessage from "../../../components/errorMessage/ErrorMessage";
import SearchSuggestions from "../../../components/searchSuggestions/SearchSuggestions";
import VideoPopup from "../../../components/videoPopup/VideoPopup";
import WatchlistButton from "../../../components/watchlistButton/WatchlistButton";
import Genres from "../../../components/genres/Genres";

const HeroBanner = () => {
  const [background, setBackground] = useState("");
  const [featured, setFeatured] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { url } = useSelector((state) => state.home);
  const { data, loading, error } = useFetch("/movie/upcoming");
  const { results: suggestions } = useSearchSuggestions(query);

  useEffect(() => {
    const pick =
      data?.results?.[Math.floor(Math.random() * 20)] || null;
    setFeatured(pick);
    // Backdrop size by viewport: original on phones, w1280 on desktop.
    // The hero is a full-screen-height portrait box (~720x1560 device
    // px on a phone) showing a 16:9 still with object-fit: cover, so
    // the image is upscaled to fill the height: w500 was ~5.5x and
    // w780 still ~3.5x, both visibly soft. "original" is typically a
    // 1920x1080 still, upscaled only ~1.4x, which reads properly sharp.
    // url.backdrop is "<base>w1280", so swap the size token.
    // Don't wait for the /configuration call either: if url.backdrop
    // hasn't loaded yet, use TMDB's standard image base (the same base
    // the config returns) so the download starts the moment
    // /movie/upcoming responds instead of after a second API round-trip.
    let next = "";
    if (pick?.backdrop_path) {
      const base = url.backdrop || "https://image.tmdb.org/t/p/w1280";
      const size =
        typeof window !== "undefined" && window.innerWidth < 768
          ? "original"
          : "w1280";
      next = base.replace("w1280", size) + pick.backdrop_path;
    }
    setBackground(next);
    // Pre-warm the photo the moment its URL is known, so the download
    // starts before the <img> below even mounts.
    if (next) {
      const pre = new Image();
      pre.src = next;
    }
  }, [data, url.backdrop]);

  // Load the featured title's trailer key so "Watch Trailer" can play it.
  useEffect(() => {
    if (!featured?.id) {
      setTrailerKey(null);
      return;
    }
    let cancelled = false;
    fetchDataFromApi(`/movie/${featured.id}/videos`)
      .then((res) => {
        if (cancelled) return;
        const trailer =
          res.results?.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
          ) || res.results?.[0];
        setTrailerKey(trailer?.key || null);
      })
      .catch(() => {
        if (!cancelled) setTrailerKey(null);
      });
    return () => {
      cancelled = true;
    };
  }, [featured?.id]);

  const searchQueryHandler = (event) => {
    if (event.key === "Enter" && query.length > 0) {
      setShowSuggestions(false);
      navigate(`/search/${query}`);
    }
    if (event.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const runSearch = () => {
    if (query.length > 0) {
      setShowSuggestions(false);
      navigate(`/search/${query}`);
    }
  };

  const onSuggestionSelect = (item) => {
    setShowSuggestions(false);
    navigate(`/${item.media_type}/${item.id}`);
  };

  return (
    <div className="heroBanner">
      {/* The backdrop container always renders (over the #262626
          fallback colour), so the hero never reads as a black screen
          while the data loads. The photo itself is a plain eager
          <img> — not a lazy loader — with fetchpriority="high"
          (lowercase: React 18 passes it through as the attribute). */}
      <div className="backdrop-img">
        {background && (
          <img
            src={background}
            alt=""
            fetchpriority="high"
            decoding="async"
          />
        )}
      </div>

      <div className="opacity-layer"></div>
      <ContentWrapper>
        <div className="heroBannerContent">
          {featured && (
            <div className="featured">
              <span className="eyebrow">Featured Movie</span>
              <h1 className="title">{featured.title || featured.name}</h1>
              <div className="metaRow">
                {featured.vote_average >= 7 && (
                  <span className="match">
                    {Math.round(featured.vote_average * 10)}% Match
                  </span>
                )}
                {featured.vote_average > 0 && (
                  <span className="rating">
                    <BsStarFill />
                    {featured.vote_average.toFixed(1)}
                  </span>
                )}
                {featured.release_date && (
                  <span className="year">
                    {dayjs(featured.release_date).format("YYYY")}
                  </span>
                )}
                <Genres data={featured.genre_ids?.slice(0, 3)} />
              </div>
              {featured.overview && (
                <p className="overview">{featured.overview}</p>
              )}
              <div className="actions">
                {trailerKey && (
                  <button
                    type="button"
                    className="trailerBtn"
                    onClick={() => {
                      setVideoId(trailerKey);
                      setShowTrailer(true);
                    }}
                  >
                    <BsPlayFill />
                    Watch Trailer
                  </button>
                )}
                <button
                  type="button"
                  className="detailsBtn"
                  onClick={() => navigate(`/movie/${featured.id}`)}
                >
                  Details
                </button>
                <WatchlistButton
                  withLabel
                  item={{
                    id: featured.id,
                    media_type: "movie",
                    title: featured.title || featured.name,
                    poster_path: featured.poster_path,
                    release_date: featured.release_date,
                    vote_average: featured.vote_average,
                    genre_ids: featured.genre_ids,
                    overview: featured.overview,
                  }}
                />
              </div>
            </div>
          )}
          {!featured && (
            <>
              <span className="title">Welcome</span>
              <span className="subTitle">
                What Are We Watching Today?! Lets Explore!!
              </span>
            </>
          )}
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search movies & TV shows"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyUp={searchQueryHandler}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() =>
                setTimeout(() => setShowSuggestions(false), 150)
              }
            />
            <button onClick={runSearch}>Search</button>
            {showSuggestions && suggestions.length > 0 && (
              <SearchSuggestions
                results={suggestions}
                onSelect={onSuggestionSelect}
              />
            )}
          </div>
          {!loading && error && <ErrorMessage />}
        </div>
      </ContentWrapper>
      <VideoPopup
        show={showTrailer}
        setShow={setShowTrailer}
        videoId={videoId}
        setVideoId={setVideoId}
      />
    </div>
  );
};

export default HeroBanner;
