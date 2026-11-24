import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import "./style.scss";

const CircleRating = ({ rating }) => {
    return (
        <div className="circleRating">
            <CircularProgressbar
                value={rating}
                maxValue={10}
                text={rating}
                styles={buildStyles({
                    pathColor:
                        rating < 5
                            ? "#e50914"
                            : rating < 7
                            ? "#f5c518"
                            : "#46d369",
                })}
            />
        </div>
    );
};

export default CircleRating;
