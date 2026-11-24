import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import "./style.scss";

import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import Spinner from "../../components/spinner/Spinner";
import ErrorMessage from "../../components/errorMessage/ErrorMessage";

const SearchResult = () => {
    const [data, setData] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const { query } = useParams();

    const fetchNextPageData = () => {
        fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`)
            .then((res) => {
                if (data?.results) {
                    setData({
                        ...data,
                        results: [...data?.results, ...res.results],
                    });
                } else {
                    setData(res);
                }
                setPageNum((prev) => prev + 1);
            })
            .catch(() => {});
    };

    useEffect(() => {
        setPageNum(1);
        setLoading(true);
        setError(false);
        fetchDataFromApi(`/search/multi?query=${query}&page=1`)
            .then((res) => {
                setData(res);
                setPageNum((prev) => prev + 1);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, [query]);

    return (
        <div className="searchResultsPage">
            {loading && <Spinner initial={true} />}
            {!loading && error && <ErrorMessage />}
            {!loading && !error && (
                <ContentWrapper>
                    {data?.results?.length > 0 ? (
                        <>
                            <div className="pageTitle">
                                {`Search ${
                                    data?.total_results > 1
                                        ? "results"
                                        : "result"
                                } of `}
                                <span className="query">&apos;{query}&apos;</span>
                            </div>
                            <InfiniteScroll
                                className="content"
                                dataLength={data?.results?.length || []}
                                next={fetchNextPageData}
                                hasMore={pageNum <= data?.total_pages}
                                loader={<Spinner />}
                            >
                                {data?.results.map((item, index) => {
                                    if (item.media_type === "person") return null;
                                    return (
                                        <MovieCard
                                            key={index}
                                            data={item}
                                            fromSearch={true}
                                        />
                                    );
                                })}
                            </InfiniteScroll>
                        </>
                    ) : (
                        <span className="resultNotFound">
                            Sorry, Results not found!
                        </span>
                    )}
                </ContentWrapper>
            )}
        </div>
    );
};

export default SearchResult;
