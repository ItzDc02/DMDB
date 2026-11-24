import { useState, useEffect, useCallback } from "react";

export const WATCHLIST_KEY = "dmdb-watchlist";

// A watchlist item keeps everything a card needs to render, so the
// Watchlist page never has to refetch from TMDB.
export const normalizeWatchlistItem = (item) => ({
    id: item.id,
    media_type: item.media_type,
    title: item.title || item.name || "",
    poster_path: item.poster_path || null,
    release_date: item.release_date || item.first_air_date || "",
    vote_average: item.vote_average ?? null,
    genre_ids: item.genre_ids || [],
    overview: item.overview || "",
});

export const loadWatchlist = () => {
    try {
        return JSON.parse(localStorage.getItem(WATCHLIST_KEY)) || [];
    } catch {
        return [];
    }
};

const saveWatchlist = (list) => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("dmdb-watchlist-changed"));
};

export const isInWatchlist = (id, mediaType) =>
    loadWatchlist().some(
        (item) => item.id === id && item.media_type === mediaType
    );

export const toggleWatchlistItem = (rawItem) => {
    const item = normalizeWatchlistItem(rawItem);
    const list = loadWatchlist();
    const index = list.findIndex(
        (entry) =>
            entry.id === item.id && entry.media_type === item.media_type
    );
    if (index >= 0) {
        list.splice(index, 1);
    } else {
        list.push(item);
    }
    saveWatchlist(list);
    return index < 0;
};

export const useWatchlist = () => {
    const [list, setList] = useState(loadWatchlist);

    useEffect(() => {
        const sync = () => setList(loadWatchlist());
        window.addEventListener("dmdb-watchlist-changed", sync);
        window.addEventListener("storage", sync);
        return () => {
            window.removeEventListener("dmdb-watchlist-changed", sync);
            window.removeEventListener("storage", sync);
        };
    }, []);

    const toggle = useCallback((item) => {
        toggleWatchlistItem(item);
        setList(loadWatchlist());
    }, []);

    const isSaved = useCallback(
        (id, mediaType) =>
            list.some(
                (item) => item.id === id && item.media_type === mediaType
            ),
        [list]
    );

    return { list, toggle, isSaved };
};
