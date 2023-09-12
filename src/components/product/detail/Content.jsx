import React, { forwardRef } from "react";
const Content = forwardRef((props, ref) => {
    return (
        <div ref={ref} style={{ height: "1300px" }}>
            <h2>상품 내용</h2>
        </div>
    );
});

export default Content;
