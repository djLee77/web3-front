import { TextField } from "@mui/material";
import style from "../../../css/ProductDetail.module.css";
import StarRatings from "react-star-ratings";

export default function Detail() {
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
    return (
        <div>
            <div className={style.box}>
                {/* 이미지 선택 영역 */}
                <div className={style.imgBox}>
                    <div className={style.mainImg}>
                        <img src="" width={300} height={300} alt="이미지1" />
                    </div>

                    <div className={style.imgBox2}>
                        <div className={style.subImg}>
                            <img src="" width={145} height={145} alt="이미지2" />
                        </div>
                        <div className={style.subImg}>
                            <img src="" width={145} height={145} alt="이미지3" />
                        </div>
                    </div>
                </div>

                <div className={style.inpoBox}>
                    <div className={style.rateBox}>
                        <StarRatings
                            rating={product.data.rate} // 현재 별점 값
                            starRatedColor="#FFB800" // 별점 색상 설정
                            numberOfStars={5} // 별점의 총 개수 설정
                            name="rating" // 이름 설정
                            starDimension="16px" // 별 크기
                            starSpacing="1px" // 별들의 간격
                            //뚠뚠이 귀여운 별 svg
                            svgIconPath="M5.35626 0.399536L3.89159 3.36925L0.614589 3.84701C0.0269265 3.93224 -0.208587 4.65673 0.21758 5.07168L2.58842 7.38195L2.02767 10.6455C1.92674 11.2354 2.54804 11.6773 3.06842 11.4014L6 9.86045L8.93159 11.4014C9.45196 11.675 10.0733 11.2354 9.97233 10.6455L9.41158 7.38195L11.7824 5.07168C12.2086 4.65673 11.9731 3.93224 11.3854 3.84701L8.10841 3.36925L6.64374 0.399536C6.38131 -0.129809 5.62094 -0.136538 5.35626 0.399536Z"
                            svgIconViewBox="0 0 12 12"
                        />
                        <span>({product.data.reviewCount}) 리뷰 보러가기</span>
                    </div>
                    {/* 상품 제목 */}
                    <div className={style.title}>
                        <span>{product.data.name}</span>
                    </div>

                    {/* 상품 가격 */}
                    <div className={style.price}>
                        <span>{product.data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</span>
                    </div>

                    {/* 버튼 영역 */}
                    <div>
                        {/* 상품 수량 */}
                        <TextField
                            type="number"
                            inputProps={{ maxLength: 2, style: { width: "50px", height: "40px" } }}
                            defaultValue={1}
                            id="count_id"
                            size="small"
                            onChange={(e) => {}}
                        />
                        <button className={style.payBtn}>바로 구매하기</button>
                        <button className={style.cartBtn}>장바구니에 담기</button>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
}
