import style from "../../css/Card.module.css";
import { Link } from "react-router-dom";
import StarRating from "../StarRating";
import numberComma from "../../lib/numberComma";

const Card = ({ product }) => {
    return (
        <>
            <Link to={`/product/detail/${product.itemId}`}>
                <div className={style.cardBox}>
                    <div className={style.cardImg}>
                        <img
                            src={product.image1} // 수정된 부분: 서버에서 받아온 이미지의 url 경로로 이미지를 출력
                            alt={product.name} // alt 태그에 상품 이름 추가: 이미지 로드 실패 시 대체 텍스트로 상품 이름을 보여줌
                            width={160}
                            height={160}
                        />
                    </div>
                    <div className={style.contentBox}>
                        <span className={style.title}>{product.name}</span>
                        <span className={style.price}>{numberComma(product.price)}원</span>
                        <span className={style.rate}>
                            <StarRating rate={product.avgRating} size={12} space={2} />
                            <span>({product.reviewCount})</span>
                        </span>
                    </div>
                </div>
            </Link>
        </>
    );
};

export default Card;
