import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/product/detail/Header";
import Content from "../components/product/detail/Content";
import Review from "../components/review/Review";
import style from "../css/ProductDetail.module.css";
import axios from "axios";
import Loading from "../components/Loading";

export default function ProductDetail() {
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const testProduct = {
    data: {
      itemId: 100110,
      categoryId: 10001,
      name: "이쁜 옷",
      image1: "/imgs/github.png",
      image2: "/imgs/facebook.png",
      image3: "/imgs/test.png",
      content: "판매 내용",
      price: 100,
      rate: 4,
      reviewCount: 10,
      remaining: "",
    },
  };
  const [product, setProduct] = useState([]); // 상품 정보
  const [scrollPosition, setScrollPosition] = useState(0); // 스크롤 위치
  const [contentPosition, setContentPosition] = useState(0); // 스크롤 위치
  const [loading, setLoading] = useState(true); // 로딩창
  const [selectedTab, setSelectedTab] = useState(""); // 선택한 탭

  const contentRef = useRef(null); // 상품 상세 Ref
  const reviewRef = useRef(null); // 리뷰 ref
  const { id } = useParams(); // 상품 ID (url 파라미터)

  // 탭 클릭했을 때 맞는 위치로 이동하는 함수
  const onClickTab = (tab) => {
    tab.current?.scrollIntoView({ behavior: "smooth" }); // 부드럽게 해당 위치로 이동
    console.log(tab);
    setSelectedTab(tab);
  };

  // 현재 스크롤 위치 업데이트하는 함수
  const updateScroll = () => {
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
  };

  // 상품 정보 가져오는 함수
  const getProductInfo = async (id) => {
    try {
      const res = await axios.get(`${serverUrl}/api/public/items/${id}`,);
      console.log("상품 정보 : ", res);
      setProduct(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // 로딩 바뀌면
  useEffect(() => {
    console.log(id); // 상품 id
    getProductInfo(id); // 상품 정보 가져오기
    setContentPosition(contentRef.current?.offsetTop); // 상품상세 위치 값 저장
    window.addEventListener("scroll", updateScroll, { capture: true }); // 스크롤 이벤트 등록
    return () => {
      window.removeEventListener("scroll", updateScroll); // 스크롤 이벤트 등록 제거(성능저하방지)
    };
  }, [loading]);

  const tabStyle = {
    fontWeight: "normal", // 기본 폰트 가중치
  };

  const selectedTabStyle = {
    fontWeight: "bold", // 선택된 탭의 폰트 가중치
  };

  return (
    <>
      {loading ? (
        <Loading content="상품 상세 정보를 가져오는 중입니다.." />
      ) : (
        <div className={style.box}>
          <Header product={product} reviewRef={reviewRef} />
          <div
            className={
              scrollPosition < contentPosition
                ? style.tabBox
                : style.tabBoxFixed
            }
          >
            <div
              onClick={() => onClickTab(contentRef)}
              className={style.tab}
              style={selectedTab === contentRef ? selectedTabStyle : tabStyle}
            >
              <span>상품상세</span>
            </div>
            <div
              onClick={() => onClickTab(reviewRef)}
              className={style.tab}
              style={selectedTab === reviewRef ? selectedTabStyle : tabStyle}
            >
              <span>상품평 ({product.reviewCount})</span>
            </div>
          </div>
          <Content ref={contentRef} content={product.content} />
          <Review
            ref={reviewRef}
            id={id}
            rate={product.rate}
            reviewCount={product.reviewCount}
          />
        </div>
      )}
    </>
  );
}
