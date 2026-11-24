import React, { useState, useEffect, useCallback, useRef } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation } from "react-router-dom";

import "./style.scss";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import SearchSuggestions from "../searchSuggestions/SearchSuggestions";
import useSearchSuggestions from "../../hooks/useSearchSuggestions";

const Header = () => {
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const { results: suggestions } = useSearchSuggestions(query);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const controlNavbar = useCallback(() => {
    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY && !mobileMenu) {
        setShow("hide");
      } else {
        setShow("show");
      }
    } else {
      setShow("top");
    }
    setLastScrollY(window.scrollY);
  }, [lastScrollY, mobileMenu]);

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [controlNavbar]);

  const openSearch = useCallback(() => {
    setMobileMenu(false);
    setShowSearch(true);
    setTimeout(() => searchInputRef.current?.focus(), 0);
  }, []);

  // Press "/" anywhere (except while typing) to focus the search box.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== "/") return;
      const target = event.target;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      openSearch();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openSearch]);

  const searchQueryHandler = (event) => {
    if (event.key === "Enter" && query.length > 0) {
      navigate(`/search/${query}`);
      setShowSuggestions(false);
      setTimeout(() => {
        setShowSearch(false);
      }, 1000);
    }
    if (event.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const onSuggestionSelect = (item) => {
    navigate(`/${item.media_type}/${item.id}`);
    setShowSuggestions(false);
    setShowSearch(false);
    setQuery("");
  };

  const openMobileMenu = () => {
    setMobileMenu(true);
    setShowSearch(false);
  };

  const navigationHandler = (type) => {
    if (type === "movie") {
      navigate("/explore/movie");
    } else if (type === "tv") {
      navigate("/explore/tv");
    } else {
      navigate("/watchlist");
    }
    setMobileMenu(false);
  };

  const isActive = (type) =>
    (type === "movie" && location.pathname === "/explore/movie") ||
    (type === "tv" && location.pathname === "/explore/tv") ||
    (type === "watchlist" && location.pathname === "/watchlist");

  return (
    <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
      <ContentWrapper>
        <div className="logo" onClick={() => navigate("/")}>
          <span className="logoText">
            DMDB<span className="logoDot">.</span>
          </span>
        </div>
        <ul className="menuItems">
          <li
            className={`menuItem ${isActive("movie") ? "active" : ""}`}
            onClick={() => navigationHandler("movie")}
          >
            Movies
          </li>
          <li
            className={`menuItem ${isActive("tv") ? "active" : ""}`}
            onClick={() => navigationHandler("tv")}
          >
            TV Shows
          </li>
          <li
            className={`menuItem ${isActive("watchlist") ? "active" : ""}`}
            onClick={() => navigationHandler("watchlist")}
          >
            Watchlist
          </li>
          <li className="menuItem searchItem">
            <HiOutlineSearch onClick={openSearch} />
          </li>
        </ul>

        <div className="mobileMenuItems">
          <button
            type="button"
            className="mobileSearchPill"
            onClick={openSearch}
            aria-label="Search movies and TV shows"
          >
            <HiOutlineSearch />
            <span>Search movies &amp; TV</span>
          </button>
          {mobileMenu ? (
            <VscChromeClose onClick={() => setMobileMenu(false)} />
          ) : (
            <SlMenu onClick={openMobileMenu} />
          )}
        </div>
      </ContentWrapper>
      {showSearch && (
        <div className="searchBar">
          <ContentWrapper>
            <div className="searchInput">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for movies and TV shows"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyUp={searchQueryHandler}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              />
              <VscChromeClose onClick={() => setShowSearch(false)} />
              {showSuggestions && suggestions.length > 0 && (
                <SearchSuggestions
                  results={suggestions}
                  onSelect={onSuggestionSelect}
                />
              )}
            </div>
          </ContentWrapper>
        </div>
      )}
    </header>
  );
};

export default Header;
