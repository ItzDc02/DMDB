import React from "react";

import "./style.scss";

import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import { useWatchlist } from "../../utils/watchlist";

const Watchlist = () => {
    const { list } = useWatchlist();

    return (
        <div className="watchlistPage">
            <ContentWrapper>
                <div className="pageTitle">My Watchlist</div>
            {list.length > 0 && (
                <span className="pageSubtitle">
                    <span className="count">{list.length}</span>{" "}
                    {list.length === 1 ? "title" : "titles"} saved
                </span>
            )}
                {list.length > 0 ? (
                    <div className="content">
                        {list.map((item) => (
                            <MovieCard
                                key={`${item.media_type}-${item.id}`}
                                data={item}
                                mediaType={item.media_type}
                            />
                        ))}
                    </div>
                ) : (
                    <span className="emptyState">
                        Your watchlist is empty — tap the bookmark on any
                        movie to save it.
                    </span>
                )}
            </ContentWrapper>
        </div>
    );
};

export default Watchlist;
