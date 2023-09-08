import React, { forwardRef } from "react";

const Review = forwardRef((props, ref) => {
    return (
        <div id="review" className="review" ref={ref}>
            <h4>상품평</h4>
        </div>
    );
});

export default Review;
