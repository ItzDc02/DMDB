import React from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

import "./style.scss";
import { useWatchlist } from "../../utils/watchlist";

const WatchlistButton = ({ item, withLabel }) => {
    const { toggle, isSaved } = useWatchlist();
    const saved = isSaved(item.id, item.media_type);

    return (
        <button
            type="button"
            className={`watchlistBtn ${saved ? "saved" : ""} ${
                withLabel ? "withLabel" : ""
            }`}
            title={saved ? "Remove from watchlist" : "Add to watchlist"}
            aria-label={
                saved ? "Remove from watchlist" : "Add to watchlist"
            }
            aria-pressed={saved}
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggle(item);
            }}
        >
            {saved ? <BsBookmarkFill /> : <BsBookmark />}
            {withLabel && (
                <span>{saved ? "In Watchlist" : "Watchlist"}</span>
            )}
        </button>
    );
};

export default WatchlistButton;
