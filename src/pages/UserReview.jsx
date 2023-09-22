import axios from "axios";
import { useEffect, useState } from "react";
import cookie from "react-cookies";
import NavBar from "../components/user/NavBar";
import StarRating from "../components/StarRating";
import ModifyReviewModal from "../components/review/modal/ModifyReviewModal";
import { Button } from "@mui/material";

export default function UserReview() {
    const [myReviews, setMyReviews] = useState([]); // 작성한 리뷰 목록
    const id = cookie.load("id"); // 로그인한 쇼핑몰 ID

    // 작성한 리뷰 목록 가져오기
    const getMyReviews = async () => {
        try {
            console.log(id);
            const res = await axios.get(`/api/users/reviews/${id}`, {
                params: {
                    pageNum: 1,
                    pageSize: 10,
                },
                headers: {
                    Authorization: `Bearer ${cookie.load("accessToken")}`,
                    "ngrok-skip-browser-warning": "1234",
                },
            });
            setMyReviews(res.data.data.reviews);
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    // 처음 마운트 될 때 작성한 리뷰 목록 가져오기
    useEffect(() => {
        getMyReviews();
    }, []);

    // 리뷰 삭제 버튼 함수
    const onClickReviewDelBtn = async (id) => {
        try {
            const res = await axios.delete(`/api/users/reviews/${id}`, {
                headers: {
                    Authorization: `Bearer ${cookie.load("accessToken")}`,
                    "ngrok-skip-browser-warning": "1234",
                },
            });
            console.log(res);
            getMyReviews();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <NavBar />
            <h4>작성한 리뷰 목록</h4>
            <div>
                {myReviews?.map((review, idx) => (
                    <div key={idx}>
                        <div>
                            <h4>작성일 {review.updatedAt.split("T")[0]}</h4>
                        </div>
                        <div style={{ display: "flex" }}>
                            <div>
                                <img src={review.itemImage} alt="상품이미지" width={150} height={150} />
                            </div>
                            <div>
                                <span style={{ fontWeight: "bold", fontSize: "18px" }}>{review.itemName}</span>
                                <div>
                                    <span>작성한 별점 </span> <StarRating rate={review.rate} size={18} space={3} />
                                </div>
                                <div>
                                    <span>작성한 내용</span>
                                    <p style={{ border: "1px solid black", borderRadius: "9px", padding: "10px" }}>
                                        {review.content}
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <ModifyReviewModal id={id} review={review} getMyReviews={getMyReviews} />
                                <Button
                                    onClick={() => {
                                        if (window.confirm("정말로 삭제하시겠습니까?")) {
                                            onClickReviewDelBtn(review.reviewId);
                                        }
                                    }}
                                >
                                    삭제
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
