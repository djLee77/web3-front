import { useState } from "react";
import style from "../../css/Card.module.css";
import { Link } from "react-router-dom";
import StarRating from "../StarRating";

const Card = ({ product }) => {
    const [rating, setRating] = useState(product.rate); // 별점 상태 저장

  // 별점 변경하는 함수 (여기선 안 필요하고 사용자가 리뷰 남길 때 사용할 예정)
  const handleRatingChange = (newRating) => {
    setRating(newRating); // rating 업데이트
  };

    return (
        <>
            <Link to={`/product/detail/${product.itemId}`}>
                <div className={style.cardBox}>
                    <div className={style.cardImg}>
                        <img
                            src="https://image.msscdn.net/images/goods_img/20210204/1778404/1778404_1_320.jpg"
                            width={160}
                            height={160}
                        ></img>
                    </div>
                    <div className={style.contentBox}>
                        <span className={style.title}>{product.name}</span>
                        <span className={style.price}>{product.price}원</span>
                        <span className={style.rate}>
                            <StarRating rate={product.rate} size={12} space={2} />
                            <span>({product.reviewCount})</span>
                        </span>
                    </div>
                </div>
            </Link>
        </>
    );
};

export default Card;
