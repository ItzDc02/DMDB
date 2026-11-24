import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./style.scss";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";

// Curated genre shortcuts — tap one to open Explore pre-filtered by it.
const CHIP_GENRES = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 18, name: "Drama" },
    { id: 27, name: "Horror" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" },
    { id: 53, name: "Thriller" },
];

const GenreChips = () => {
    const navigate = useNavigate();
    const { genres } = useSelector((state) => state.home);

    // A swipe across the row must scroll it, never navigate: track the
    // pointer and ignore the click if the finger moved more than 10px
    // between press and release (that is a scroll, not a tap). This is
    // what was "selecting on hover" — on touch, a swipe ending over a
    // chip still fires a click on it, and the sticky :hover style made
    // each chip under the finger look selected as it passed.
    const press = useRef({ x: 0, y: 0, moved: false });

    const onPointerDown = (e) => {
        press.current = { x: e.clientX, y: e.clientY, moved: false };
    };
    const onPointerMove = (e) => {
        const dx = e.clientX - press.current.x;
        const dy = e.clientY - press.current.y;
        if (dx * dx + dy * dy > 100) press.current.moved = true;
    };
    const onChipClick = (id) => {
        if (press.current.moved) return;
        navigate(`/explore/movie?genre=${id}`);
    };

    return (
        <div className="genreChips">
            <ContentWrapper>
                <span className="genreChipsLabel">Browse by genre</span>
                <div className="chips">
                    {CHIP_GENRES.map((g) => {
                        if (!genres[g.id]?.name) return null;
                        return (
                            <button
                                key={g.id}
                                type="button"
                                className="chip"
                                onPointerDown={onPointerDown}
                                onPointerMove={onPointerMove}
                                onClick={() => onChipClick(g.id)}
                            >
                                {g.name}
                            </button>
                        );
                    })}
                </div>
            </ContentWrapper>
        </div>
    );
};

export default GenreChips;
