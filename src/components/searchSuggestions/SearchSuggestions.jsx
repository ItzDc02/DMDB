import React from "react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

import "./style.scss";
import Img from "../lazyLoadImage/Img";
import PosterFallback from "../../assets/no-poster.png";

const SearchSuggestions = ({ results, onSelect }) => {
    const { url } = useSelector((state) => state.home);

    if (!results?.length) return null;

    return (
        <div className="searchSuggestions">
            {results.map((item) => {
                const year = dayjs(
                    item.release_date || item.first_air_date
                ).format("YYYY");
                return (
                    <div
                        key={`${item.media_type}-${item.id}`}
                        className="suggestionItem"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onSelect(item);
                        }}
                    >
                        <Img
                            className="suggestionPoster"
                            src={
                                item.poster_path
                                    ? url.poster + item.poster_path
                                    : PosterFallback
                            }
                        />
                        <div className="suggestionText">
                            <span className="suggestionTitle">
                                {item.title || item.name}
                            </span>
                            <span className="suggestionMeta">
                                {item.media_type === "tv"
                                    ? "TV Show"
                                    : "Movie"}
                                {year && ` · ${year}`}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SearchSuggestions;
