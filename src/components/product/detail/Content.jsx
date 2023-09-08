import Review from "./Review";
import style from "../../../css/ProductDetail.module.css";
import { useRef } from "react";

export default function Content() {
    const explationRef = useRef(null); // 상품 상세 Ref
    const reviewRef = useRef(null); // 리뷰 ref

    // 탭 클릭했을 때 맞는 위치로 이동하는 함수
    const onTabClick = (tab) => {
        tab.current?.scrollIntoView({ behavior: "smooth" }); // 부드럽게 해당 위치로 이동
    };

    return (
        <div>
            <div className={style.tabBox}>
                <div onClick={() => onTabClick(explationRef)} className={style.tab}>
                    <span>상품상세</span>
                </div>
                <div onClick={() => onTabClick(reviewRef)} className={style.tab}>
                    <span>상품평</span>
                </div>
            </div>
            <div ref={explationRef} style={{ height: "1300px" }}>
                <h2>상품 내용</h2>
            </div>
            <Review ref={reviewRef} />
        </div>
    );
}
