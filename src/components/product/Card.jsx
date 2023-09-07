import { useState } from "react";
import StarRatings from "react-star-ratings";
import "../../css/Card.module.css";

const Card = ({ product }) => {
    const [rating, setRating] = useState(product.rate); // 별점 상태 저장

    // 상품 카드 클릭했을때 함수 (상품 상세 페이지로 넘어갈 예정)
    const onClickCard = () => {
        console.log(product.itemId + " 상품 카드 클릭");
    };

    // 별점 변경하는 함수 (여기선 안 필요하고 사용자가 리뷰 남길 때 사용할 예정)
    const handleRatingChange = (newRating) => {
        setRating(newRating); // rating 업데이트
    };

    return (
        <>
            <div className="card-box" onClick={onClickCard}>
                <div className="img">
                    <img src="https://cdn.discordapp.com/attachments/1136307485398007878/1147779261319618560/facebook.png"></img>
                </div>
                <div className="content-box">
                    <span className="title">{product.name}</span>
                    <span className="price">{product.price}원</span>
                    <span className="rate">
                        <StarRatings
                            rating={rating} // 현재 별점 값
                            starRatedColor="#FFB800" // 별점 색상 설정
                            changeRating={handleRatingChange} // 별점이 변경될 때 호출되는 콜백 함수
                            numberOfStars={5} // 별점의 총 개수 설정
                            name="rating" // 이름 설정
                            starDimension="12px" // 별 크기
                            starSpacing="1px" // 별들의 간격
                            //뚠뚠이 귀여운 별 svg
                            svgIconPath="M5.35626 0.399536L3.89159 3.36925L0.614589 3.84701C0.0269265 3.93224 -0.208587 4.65673 0.21758 5.07168L2.58842 7.38195L2.02767 10.6455C1.92674 11.2354 2.54804 11.6773 3.06842 11.4014L6 9.86045L8.93159 11.4014C9.45196 11.675 10.0733 11.2354 9.97233 10.6455L9.41158 7.38195L11.7824 5.07168C12.2086 4.65673 11.9731 3.93224 11.3854 3.84701L8.10841 3.36925L6.64374 0.399536C6.38131 -0.129809 5.62094 -0.136538 5.35626 0.399536Z"
                            svgIconViewBox="0 0 12 12"
                        />
                        <span>({product.reviewCount})</span>
                    </span>
                </div>
            </div>
        </>
    );
};

export default Card;
