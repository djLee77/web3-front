import MDEditor from "@uiw/react-md-editor";
import React, { forwardRef } from "react";
const Content = forwardRef((props, ref) => {
    return (
        <div className="markdownDiv" ref={ref} data-color-mode="light">
            <MDEditor.Markdown source={props.content} />
        </div>
    );
});

export default Content;
