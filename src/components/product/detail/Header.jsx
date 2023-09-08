import { TextField } from "@mui/material";
import style from "../../../css/ProductDetail.module.css";
import StarRating from "../../StarRating";

export default function Detail({ product, reviewRef }) {
    //
    const onReviewClick = () => {
        reviewRef.current?.scrollIntoView({ behavior: "smooth" }); // 부드럽게 해당 위치로 이동
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
