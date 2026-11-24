import React from "react";
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
                                onClick={() =>
                                    navigate(`/explore/movie?genre=${g.id}`)
                                }
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
