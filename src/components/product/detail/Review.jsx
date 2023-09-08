import { forwardRef } from "react";
import StarRating from "../../StarRating";
import { Avatar } from "@mui/material";
import style from "../../../css/Review.module.css";

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
        <div className="review" ref={ref}>
            <div>
                <h4>총 평점</h4>
                <StarRating rate={props.rate} size={24} space={2} />
                <span>({props.reviewCount})</span>
            </div>
            <hr />
            {testReivew.data.reviews.map((review) => (
                <div>
                    <div className={style.headerBox}>
                        <Avatar sx={{ width: "48px", height: "48px" }} />
                        <div className={style.userBox}>
                            <span className="userId">{review.userId}</span>
                            <div>
                                <StarRating rate={review.rate} size={18} space={2} />
                                <span className={style.createAt}>{review.created_at}</span>
                            </div>
                        </div>
                    </div>
                    <div className={style.imgBox}>
                        <img src="" alt="리뷰사진"></img>
                    </div>
                    <div className={style.contentBox}>
                        <span>{review.content}</span>
                    </div>
                    <hr />
                </div>
            ))}
        </div>
    );
});

export default Review;
