import { TextField } from "@mui/material";
import style from "../../../css/ProductDetail.module.css";
import StarRating from "../../StarRating";
import { useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { useEffect } from "react";

export default function Detail({ product, reviewRef }) {
    const [mainImg, setMainImg] = useState(""); // 메인 이미지
    const [quantity, setQuantity] = useState(1); // 상품 수량

    const id = cookie.load("id"); // 사용자 ID

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
            }
        } catch (error) {
            console.log(error);
        }
    };

    // 구매 버튼 클릭 함수 미완성임
    const onClickPayBtn = async (productId, quantity) => {
        console.log(cookie.load("accessToken"));
        try {
            const res = await axios.patch(
                `/api/admin/users/${"6OuEWnVpBMOTGGUHcZZlb"}`,
                {
                    role: "ROLE_ADMIN",
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookie.load("accessToken")}`,
                        "ngrok-skip-browser-warning": "1234",
                    },
                }
            );

            console.log(res);
        } catch (error) {
            console.log(error);
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
                    <div className={style.mainImg}>
                        <img src={mainImg} alt="이미지1" />
                    </div>
                </div>
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
                        <span>{(product.price * quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</span>
                    </div>

                    {/* 판매자 정보 */}
                    <div className={style.sellerId}>
                        <span>판매자 ID : {product.sellerId}</span>
                    </div>
                    {/* 버튼 영역 */}
                    <div>
                        {/* 상품 수량 */}
                        <TextField
                            type="number"
                            inputProps={{ maxLength: 2, min: 1, max: 99, style: { width: "40px", height: "24px" } }}
                            value={quantity}
                            id="count_id"
                            size="small"
                            onChange={(e) => {
                                onChangeQuantity(e);
                            }}
                        />
                        <button className={style.payBtn} onClick={() => onClickPayBtn(product.itemId, quantity)}>
                            바로 구매하기
                        </button>
                        <button className={style.cartBtn} onClick={() => onClickCartBtn(product.itemId)}>
                            장바구니에 담기
                        </button>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
}
