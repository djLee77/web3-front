import React, { forwardRef } from "react";
import StarRatings from "react-star-ratings";

const Review = forwardRef((props, ref) => {
    const testReivew = {
        data: {
            reviews: [
                {
                    userId: "aF3ksj3",
                    rate: 3,
                    content: "리뷰 내용~!@~@",
                    image: "이미지",
                    created_at: "2023-09-02",
                    upsdated_at: "2023-09-01",
                },

                {
                    userId: "asd",
                    rate: 4,
                    content: "리뷰 내용~!@~@",
                    image: "이미지",
                    created_at: "2023-09-01",
                    upsdated_at: "2023-09-01",
                },

                {
                    userId: "qwe",
                    rate: 5,
                    content: "리뷰 내용~!@~@",
                    image: "이미지",
                    created_at: "2023-09-01",
                    upsdated_at: "2023-09-01",
                },
            ],
        },
    };
    return (
        <div id="review" className="review" ref={ref}>
            <div>
                <h4>총 평점</h4>
                <StarRatings
                    rating={5} // 현재 별점 값
                    starRatedColor="#FFB800" // 별점 색상 설정
                    numberOfStars={5} // 별점의 총 개수 설정
                    name="rating" // 이름 설정
                    starDimension="38px" // 별 크기
                    starSpacing="6px" // 별들의 간격
                    //뚠뚠이 귀여운 별 svg
                    svgIconPath="M5.35626 0.399536L3.89159 3.36925L0.614589 3.84701C0.0269265 3.93224 -0.208587 4.65673 0.21758 5.07168L2.58842 7.38195L2.02767 10.6455C1.92674 11.2354 2.54804 11.6773 3.06842 11.4014L6 9.86045L8.93159 11.4014C9.45196 11.675 10.0733 11.2354 9.97233 10.6455L9.41158 7.38195L11.7824 5.07168C12.2086 4.65673 11.9731 3.93224 11.3854 3.84701L8.10841 3.36925L6.64374 0.399536C6.38131 -0.129809 5.62094 -0.136538 5.35626 0.399536Z"
                    svgIconViewBox="0 0 12 12"
                />
            </div>
            <hr />
            {testReivew.data.reviews.map((review) => (
                <div>
                    <div>
                        <span>{review.userId}</span>
                        <StarRatings />
                    </div>
                    <hr />
                </div>
            ))}
        </div>
    );
});

export default Review;
