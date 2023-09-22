import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import cookie from "react-cookies";
import NavBar from "../components/user/NavBar";
import StarRating from "../components/StarRating";
import ModifyReviewModal from "../components/review/modal/ModifyReviewModal";
import { Button, Pagination } from "@mui/material";
import style from "../css/UserReview.module.css";

export default function UserReview() {
    const [myReviews, setMyReviews] = useState([]); // 작성한 리뷰 목록
    const id = cookie.load("id"); // 로그인한 쇼핑몰 ID
    const [page, setPage] = useState(1); // 페이지
    const [totalPage, setTotalPage] = useState(10); // 전체 페이지

    const navigate = useNavigate();

    //페이지 이동하는 함수
    const handleChange = (e, value) => {
        setPage(value);
        navigate(`/user/review?page=${value}`);
    };

    // 작성한 리뷰 목록 가져오기
    const getMyReviews = async () => {
        try {
            console.log(id);
            const res = await axios.get(`/api/users/reviews/${id}`, {
                params: {
                    pageNum: page,
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
    }, [page]);

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

    const reviewTest = [
        {
            userId: "aF3ksj3”",
            itemName: "상품1",
            rate: 3,
            content: "리뷰 내용~!@~@",
            image: "이미지",
            createdAt: "2023-09-01",
            updatedAt: "2023-09-01",
        },

        {
            userId: "aF3ksj3”",
            itemName: "상품2",
            rate: 3,
            content: "리뷰 내용~!@~@",
            image: "이미지",
            createdAt: "2023-09-01",
            updatedAt: "2023-09-01",
        },

        {
            userId: "aF3ksj3”",
            itemName: "상품3",
            rate: 3,
            content: "리뷰 내용~!@~@",
            image: "이미지",
            createdAt: "2023-09-01",
            updatedAt: "2023-09-01",
        },
    ];

    return (
        <div className={style.box}>
            <NavBar />
            <div style={{ width: "700px", margin: "0 auto" }}>
                {reviewTest?.map((review, idx) => (
                    <div className={style.reviewBox} key={idx}>
                        <div className={style.productBox}>
                            <img src={review.itemImage} alt="상품이미지" width={150} height={150} />
                            <span>{review.itemName}</span>
                        </div>
                        <hr />
                        <div className={style.rateBox}>
                            <StarRating rate={review.rate} size={18} space={3} />
                            <span>{review.updatedAt}</span>
                        </div>
                        <p>{review.content}</p>
                        <div className={style.btnBox}>
                            <ModifyReviewModal id={id} review={review} getMyReviews={getMyReviews} />
                            <Button
                                onClick={() => {
                                    if (window.confirm("정말로 삭제하시겠습니까?")) {
                                        onClickReviewDelBtn(review.reviewId);
                                    }
                                }}
                                color="error"
                            >
                                삭제
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
                <Pagination count={totalPage} page={page} onChange={handleChange} />
            </div>
        </div>
    );
}
