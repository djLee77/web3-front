import { TextField } from "@mui/material";
import style from "../../../css/ProductDetail.module.css";
import StarRating from "../../StarRating";
import { useState } from "react";

export default function Detail({ product, reviewRef }) {
    const [mainImg, setMainImg] = useState(product.data.image1); // 메인 이미지
    const [quantity, setQuantity] = useState(1); // 상품 수량

    // 리뷰 보러가는 함수
    const onReviewClick = () => {
        reviewRef.current?.scrollIntoView({ behavior: "smooth" }); // 부드럽게 해당 위치로 이동
    };

    // 서브 이미지에 마우스 올리면 메인이   미지에 이미지 보이도록 하는 함수
    const onMouseOverImg = (img) => {
        setMainImg(img);
    };

    // 장바구니 담기 버튼 클릭 함수
    const onClickCartBtn = (productId) => {
        alert(productId + " 장바구니 담기 구현 중");
    };

    // 구매 버튼 클릭 함수
    const onClickPayBtn = (productId, quantity) => {
        alert("상품 ID: " + productId + " 수량 : " + quantity);
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
                    <div className={style.subImg} onMouseOver={() => onMouseOverImg(product.data.image1)}>
                        <img src={product.data.image1} alt="이미지1" />
                    </div>
                    <div className={style.subImg} onMouseOver={() => onMouseOverImg(product.data.image2)}>
                        <img src={product.data.image2} alt="이미지2" />
                    </div>
                    <div className={style.subImg} onMouseOver={() => onMouseOverImg(product.data.image3)}>
                        <img src={product.data.image3} alt="이미지3" />
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
                            rate={product.data.rate} // 현재 별점 값
                            size={18}
                            space={1}
                        />
                        <span onClick={onReviewClick}>({product.data.reviewCount}) 리뷰 보러가기</span>
                    </div>
                    {/* 상품 제목 */}
                    <div className={style.title}>
                        <span>{product.data.name}</span>
                    </div>

                    {/* 상품 가격 */}
                    <div className={style.price}>
                        <span>
                            {(product.data.price * quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
                        </span>
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
                        <button className={style.payBtn} onClick={() => onClickPayBtn(product.data.itemId, quantity)}>
                            바로 구매하기
                        </button>
                        <button className={style.cartBtn} onClick={() => onClickCartBtn(product.data.itemId)}>
                            장바구니에 담기
                        </button>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
}
