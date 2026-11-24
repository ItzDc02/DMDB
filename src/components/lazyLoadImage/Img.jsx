import React from "react";

// Plain <img> with native lazy-loading.
//
// Why not LazyLoadImage: react-lazy-load-image-component only renders
// its `.lazy-load-image-background` wrapper span when an effect (or a
// placeholder) is set. The transplant removed `effect="blur"`, so every
// <Img> in the app rendered a bare <img> with no wrapper — and all the
// image sizing in the app is written against
// `.lazy-load-image-background img` (width/height 100%, object-fit:
// cover). With the wrapper gone those rules matched nothing, so every
// image rendered at its natural size: posters at 342x513 inside a
// 125px card (hugely tall, cropped to a slice), backdrops at 1280x720
// inside a full-screen hero (stuck at the top with a huge gap below).
// Native loading="lazy" keeps the same lazy behaviour; sizing is now
// explicit CSS on the <img> itself (poster-block mixin, backdrop
// rules). The hero uses its own eager <img> (see HeroBanner).
const Img = ({ src, className }) => {
    return (
        <img
            className={className || ""}
            alt=""
            src={src}
            loading="lazy"
            decoding="async"
        />
    );
};

export default Img;
