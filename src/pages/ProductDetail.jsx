import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/product/detail/Header";
import Content from "../components/product/detail/Content";
import Review from "../components/product/detail/Review";
import style from "../css/ProductDetail.module.css";

export default function ProductDetail() {
    const product = {
        data: {
            itemId: 100110,
            categoryId: 10001,
            name: "이쁜 옷",
            image1: "image1",
            image2: "image2",
            image3: "image3",
            content: "판매 내용",
            price: 100,
            rate: 4,
            reviewCount: 10,
            remaining: "",
        },
    };
    const [scrollPosition, setScrollPosition] = useState(0); // 스크롤 위치
    const [contentPosition, setContentPosition] = useState(0); // 스크롤 위치
    const contentRef = useRef(null); // 상품 상세 Ref
    const reviewRef = useRef(null); // 리뷰 ref
    const { id } = useParams();

    // 탭 클릭했을 때 맞는 위치로 이동하는 함수
    const onTabClick = (tab) => {
        tab.current?.scrollIntoView({ behavior: "smooth" }); // 부드럽게 해당 위치로 이동
    };

    // 현재 스크롤 위치 업데이트하는 함수
    const updateScroll = () => {
        setScrollPosition(window.scrollY || document.documentElement.scrollTop);
    };

    useEffect(() => {
        console.log(id); // 상품 id
        setContentPosition(contentRef.current?.offsetTop);
        window.addEventListener("scroll", updateScroll, { capture: true }); // 스크롤 이벤트 등록
        return () => {
            window.removeEventListener("scroll", updateScroll); // 스크롤 이벤트 등록 제거(성능저하방지)
        };
    }, []);

    return (
        <div>
            <Header product={product} />
            <div className={scrollPosition < contentPosition ? style.tabBox : style.tabBoxFixed}>
                <div onClick={() => onTabClick(contentRef)} className={style.tab}>
                    <span>상품상세</span>
                </div>
                <div onClick={() => onTabClick(reviewRef)} className={style.tab}>
                    <span>상품평 ({product.data.reviewCount})</span>
                </div>
            </div>
            <Content ref={contentRef} />
            <Review ref={reviewRef} rate={product.data.rate} reviewCount={product.data.reviewCount} />
        </div>
    );
}
