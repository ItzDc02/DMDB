import { useState, useEffect } from "react";
import { fetchDataFromApi } from "../utils/api";

// Debounced TMDB multi-search for live suggestions. Returns the top
// movie/TV matches only; people results are filtered out.
const useSearchSuggestions = (query) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const trimmed = query.trim();
        if (trimmed.length < 2) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        let cancelled = false;
        const timer = setTimeout(() => {
            fetchDataFromApi(`/search/multi?query=${trimmed}&page=1`)
                .then((res) => {
                    if (cancelled) return;
                    const matches = (res?.results || [])
                        .filter(
                            (item) =>
                                (item.media_type === "movie" ||
                                    item.media_type === "tv") &&
                                item.poster_path
                        )
                        .slice(0, 6);
                    setResults(matches);
                    setLoading(false);
                })
                .catch(() => {
                    if (cancelled) return;
                    setResults([]);
                    setLoading(false);
                });
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [query]);

    return { results, loading };
};

export default useSearchSuggestions;
