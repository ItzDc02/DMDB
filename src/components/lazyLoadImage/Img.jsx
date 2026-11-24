import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

// No blur effect: the Cinematic system is flat colour + photography only,
// with no blur filters anywhere. Images still lazy-load.
const Img = ({ src, className }) => {
    return <LazyLoadImage className={className || ""} alt="" src={src} />;
};

export default Img;
