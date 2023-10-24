export default function ZoomView({ scannerPosition, mainImgRect, mainImg }) {
    const zoomViewStyle = {
        zIndex: 1,
        position: "absolute",
        top: 0,
        left: mainImgRect?.right + 40 + "px",
        width: 440,
        height: 440,
        border: "1px solid gray",
        backgroundColor: "white",
        backgroundImage: `url(${mainImg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: `${(scannerPosition?.x - mainImgRect.left) * -3}px ${scannerPosition?.y * -3}px`,
        backgroundSize: "300% 300%",
        display: scannerPosition ? "block" : "none",
    };

    return <div style={zoomViewStyle} />;
}
