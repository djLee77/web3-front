import { CircularProgress } from "@mui/material";

export default function Loading({ content }) {
    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <CircularProgress sx={{ marginBottom: "42px" }} />
            <p>{content}</p>
        </div>
    );
}
