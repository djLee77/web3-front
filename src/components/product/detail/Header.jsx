import { TextField } from "@mui/material";
import style from "../../../css/ProductDetail.module.css";
import StarRating from "../../StarRating";
import { useRef, useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import reissueAccToken from "../../../lib/reissueAccToken";
import numberComma from "../../../lib/numberComma";

export default function Detail({ product, reviewRef }) {
    const [mainImg, setMainImg] = useState(""); // 메인 이미지
    const [quantity, setQuantity] = useState(1); // 상품 수량
    const [totalPrice, setTotalPrice] = useState(""); // 총 금액
    const [mainImgRect, setMainImgRect] = useState({});
    const [scannerPosition, setScannerPosition] = useState(null); // 이미지 스캐너 위치

    const mainImgRef = useRef(null); // 메인 이미지 ref

    useEffect(() => {
        setMainImgRect(mainImgRef.current?.getBoundingClientRect()); // 메인이미지 위치 값
    }, [mainImgRect]);

    const id = cookie.load("id"); // 사용자 ID
    const navigate = useNavigate();

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

    // 상세 이미지 스캐너 움직이는 함수
    const onMouseMove = (e) => {
        const { left } = mainImgRect;
        let scannerPostionX = e.clientX - 75;
        let scannerPostionY = e.clientY - 120;

        if (scannerPostionX < left) {
            scannerPostionX = left;
        }

        if (scannerPostionX > left + 280) {
            scannerPostionX = left + 280;
        }

        if (scannerPostionY < 0) {
            scannerPostionY = 0;
        }

        if (scannerPostionY > 290) {
            scannerPostionY = 290;
        }

        console.log(scannerPosition?.x, scannerPosition?.y);

        setScannerPosition({ x: scannerPostionX, y: scannerPostionY });
    };

    // product 바뀔때 메인 이미지 설정해주기 (proudct 처음에 undefined였다가 product 불러와지면 메인 이미지 설정)
    useEffect(() => {
        setMainImg(product.image1);
    }, [product]);

    // 리뷰 보러가는 함수
    const onReviewClick = () => {
        reviewRef.current?.scrollIntoView({ behavior: "smooth" }); // 부드럽게 해당 위치로 이동
    };

    // 서브 이미지에 마우스 올리면 메인이미지에 이미지 보이도록 하는 함수
    const onMouseOverImg = (img) => {
        setMainImg(img);
    };

    // 장바구니 담기 버튼 클릭 함수
    const onClickCartBtn = async (productId) => {
        let isSuccess = false;
        if (!id) {
            return alert("로그인 후 이용 가능합니다.");
        }

        try {
            const res = await axios.post(
                `/api/users/carts/${id}`,
                {
                    itemId: productId,
                    quantity: quantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookie.load("accessToken")}`,
                        "ngrok-skip-browser-warning": "1234",
                    },
                }
            );

            console.log(res);
            if (res.status === 200) {
                alert("장바구니에 상품을 담았습니다.");
                isSuccess = true;
            }
        } catch (error) {
            console.log(error);
            // 만약 401(인증) 에러가 나면
            if (error.response.status === 401) {
                await reissueAccToken(); // 토큰 재발급 함수 실행
                !isSuccess && onClickCartBtn(productId); // 함수 다시 실행
            }
        }
    };

    // 구매 버튼 클릭 함수
    const onClickPayBtn = async (productId, quantity) => {
        let isSuccess = false;
        if (!id) {
            return alert("로그인 후 이용 가능합니다.");
        }

        try {
            const data = `${productId}:${quantity}`;
            console.log(data);
            const res = await axios.get(`/api/users/form/orders/${id}`, {
                params: {
                    items: data,
                },
                headers: {
                    Authorization: `Bearer ${cookie.load("accessToken")}`,
                    "ngrok-skip-browser-warning": "1234",
                },
            });

            console.log(res);
            const orders = res.data.data; // 주문서 저장
            isSuccess = true;
            navigate("/payment", { state: { orders: orders, data: data } }); // 결제 페이지에 주문서 데이터 보내주기
        } catch (error) {
            // 만약 401(인증) 에러가 나면
            if (error.response.status === 401) {
                await reissueAccToken(); // 토큰 재발급 함수 실행
                !isSuccess && onClickPayBtn(productId, quantity); // 함수 다시 실행
            }
        }
    };

    // 상품 개수 바꾸는 함수
    const onChangeQuantity = (e) => {
        let value = parseInt(e.target.value);

        if (isNaN(value)) {
            // 숫자가 아닌 경우 1로 설정
            value = 1;
        } else {
            // 숫자인 경우 범위 체크
            value = Math.min(Math.max(1, value), 99);
        }

        setQuantity(value);
    };

    // 수량 바뀔때마다 총 금액 업데이트
    useEffect(() => {
        setTotalPrice(numberComma(product.price * quantity));
    }, [quantity]);

    return (
        <div>
            <div className={style.headerBox}>
                <div className={style.subImgBox}>
                    <div className={style.subImg} onMouseOver={() => onMouseOverImg(product.image1)}>
                        <img src={product.image1} alt="이미지1" />
                    </div>
                    <div className={style.subImg} onMouseOver={() => onMouseOverImg(product.image2)}>
                        <img src={product.image2} alt="이미지2" />
                    </div>
                    <div className={style.subImg} onMouseOver={() => onMouseOverImg(product.image3)}>
                        <img src={product.image3} alt="이미지3" />
                    </div>
                </div>
                {/* 이미지 선택 영역 */}
                <div className={style.mainImgBox}>
                    <div
                        className={style.mainImg}
                        onMouseMove={onMouseMove}
                        onMouseLeave={() => setScannerPosition(null)}
                        ref={mainImgRef}
                    >
                        <img src={mainImg} alt="메인 이미지" />
                        <span style={scannerStyle} />
                    </div>
                </div>
                <div style={zoomViewStyle} />
                <div className={style.inpoBox}>
                    <div className={style.rateBox}>
                        <StarRating
                            rate={product.rate} // 현재 별점 값
                            size={18}
                            space={1}
                        />
                        <span onClick={onReviewClick}>({product.reviewCount}) 리뷰 보러가기</span>
                    </div>
                    {/* 상품 제목 */}
                    <div className={style.title}>
                        <span>{product.name}</span>
                    </div>

                    {/* 상품 가격 */}
                    <div className={style.price}>
                        <span>{totalPrice}원</span>
                    </div>

                    {/* 판매자 정보 */}
                    <div className={style.sellerId}>
                        <span>판매자 ID</span> {product.sellerId}
                    </div>

                    {/* 수량 정보 */}
                    <div className={style.stock}>
                        <span>남은 수량</span> {product.stock}
                    </div>

                    {/* 구매 수량 */}
                    <div className={style.quantity}>
                        <span>수량</span>
                        <hr />
                        <TextField
                            type="number"
                            inputProps={{ maxLength: 2, min: 1, max: 99, style: { width: "40px", height: "24px" } }}
                            value={quantity}
                            id="count_id"
                            size="small"
                            onChange={(e) => {
                                onChangeQuantity(e);
                            }}
                            sx={{ backgroundColor: "white" }}
                        />
                    </div>

                    <div className={style.totalPrice}>
                        <span>총 주문 금액({quantity})개</span>
                        <span>{totalPrice}원</span>
                    </div>

                    {/* 버튼 영역 */}
                    <div className={style.btnBox}>
                        <button className={style.payBtn} onClick={() => onClickPayBtn(product.itemId, quantity)}>
                            바로 구매
                        </button>
                        <button className={style.cartBtn} onClick={() => onClickCartBtn(product.itemId)}>
                            장바구니
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
