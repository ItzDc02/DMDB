import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.scss";

import useFetch from "../../../hooks/useFetch";
import useSearchSuggestions from "../../../hooks/useSearchSuggestions";

import Img from "../../../components/lazyLoadImage/Img";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import ErrorMessage from "../../../components/errorMessage/ErrorMessage";
import SearchSuggestions from "../../../components/searchSuggestions/SearchSuggestions";

const HeroBanner = () => {
  const [background, setBackground] = useState("");
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { url } = useSelector((state) => state.home);
  const { data, loading, error } = useFetch("/movie/upcoming");
  const { results: suggestions } = useSearchSuggestions(query);

  useEffect(() => {
    const bg =
      url.backdrop +
      data?.results?.[Math.floor(Math.random() * 20)]?.backdrop_path;
    setBackground(bg);
  }, [data, url.backdrop]);

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
      {!loading && (
        <div className="backdrop-img">
          <Img src={background} />
        </div>
      )}

      <div className="opacity-layer"></div>
      <ContentWrapper>
        <div className="heroBannerContent">
          <span className="title">Welcome</span>
          <span className="subTitle">
            What Are We Watching Today?! Lets Explore!!
          </span>
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search For Movies and TV Shows"
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
    </div>
  );
};

export default HeroBanner;
