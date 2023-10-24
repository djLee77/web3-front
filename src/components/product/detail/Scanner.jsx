export default function Scanner({ scannerPosition }) {
    const scannerStyle = {
        position: "absolute",
        top: scannerPosition?.y,
        left: scannerPosition?.x,
        width: 150,
        height: 150,
        border: "1px solid #000",
        backgroundColor: "rgba(255,255,255,0.7)",
        cursor: "pointer",
        display: scannerPosition ? "block" : "none",
    };

    return <span style={scannerStyle} />;
}
