import { useState } from "react";
import StarRatings from "react-star-ratings";
import "../../css/Card.css";
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
                <div className="card-box">
                    <div className="img">
                        <img src="https://cdn.discordapp.com/attachments/1136307485398007878/1147779261319618560/facebook.png"></img>
                    </div>
                    <div className="content-box">
                        <span className="title">{product.name}</span>
                        <span className="price">{product.price}원</span>
                        <span className="rate">
                            <StarRating rate={product.rate} size={12} space={2} />
                            <span className="">({product.reviewCount})</span>
                        </span>
                    </div>
                </div>
            </Link>
        </>
    );
};

export default Card;
