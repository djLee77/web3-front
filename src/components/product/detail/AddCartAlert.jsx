import { useEffect, useState } from "react";

export default function AddCartAlert({ isAddCart, setIsAddCart, navigate }) {
    const [scrolled, setScrolled] = useState(false);

    const addCartAlertStyle = {
        position: "absolute",
        top: scrolled ? 339 : 280,
        padding: "14px",
        border: "1px solid gray",
        backgroundColor: "white",
        width: "300px",
        textAlign: "center",
        right: 300,
    };

    const buttonStyle = {
        width: "180px",
        height: "40px",
        border: 0,
        backgroundColor: "#fcfcfc",
        border: "1px solid gray",
        fontWeight: "bold",
        marginTop: "10px",
    };

    // 장바구니에 상품 담았을때 장바구니 바로가기 div 지정한 시간 동안 보였다가 사라지게함
    useEffect(() => {
        if (isAddCart) {
            // 5초 후에 isAddCart를 false로 변경
            const timeoutId = setTimeout(() => {
                setIsAddCart(false);
            }, 4000);

            // 컴포넌트가 언마운트될 때 clearTimeout을 호출하여 메모리 누수를 방지
            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [isAddCart]);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 1) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        console.log(scrolled);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [scrolled]);
    return (
        <>
            <div style={addCartAlertStyle}>
                <span>상품을 장바구니에 담았습니다.</span>
                <button style={buttonStyle} onClick={() => navigate("/cart")}>
                    장바구니 바로가기
                </button>
            </div>

            <style></style>
        </>
    );
}
