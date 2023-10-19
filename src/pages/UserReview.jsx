import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import cookie from "react-cookies";
import NavBar from "../components/user/NavBar";
import StarRating from "../components/StarRating";
import ModifyReviewModal from "../components/review/modal/ModifyReviewModal";
import { Button, Pagination } from "@mui/material";
import style from "../css/UserReview.module.css";
import Loading from "../components/Loading";
import reissueAccToken from "../lib/reissueAccToken";

export default function UserReview() {
    const [myReviews, setMyReviews] = useState([]); // 작성한 리뷰 목록
    const id = cookie.load("id"); // 로그인한 쇼핑몰 ID
    const [page, setPage] = useState(1); // 페이지
    const [totalPage, setTotalPage] = useState(10); // 전체 페이지
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);

    const defaultReviewImgURL = "/imgs/defaultAddImg.png"; // 리뷰 기본 이미지 경로
    const navigate = useNavigate();

    //페이지 이동하는 함수
    const handleChange = (e, value) => {
        setPage(value);
        navigate(`/user/review?page=${value}`);
    };

    // 작성한 리뷰 목록 가져오기
    const getMyReviews = async () => {
        let isSuccess = false;
        const urlPage = searchParams.get("page");
        const pageNum = urlPage ? parseInt(urlPage, 10) : 1;
        setPage(pageNum);
        try {
            console.log(id);
            const res = await axios.get(`/api/users/reviews/${id}`, {
                params: {
                    pageNum: pageNum - 1, // 백엔드 페이징은 0부터 시작해서 -1
                    pageSize: 10,
                },
                headers: {
                    Authorization: `Bearer ${cookie.load("accessToken")}`,
                    "ngrok-skip-browser-warning": "1234",
                },
            });

            setMyReviews(res.data.data.reviews);
            setTotalPage(res.data.totalPage);
            setLoading(false);
            isSuccess = true;
            console.log(res);
        } catch (error) {
            // 만약 401(인증) 에러가 나면
            if (error.response.status === 401) {
                await reissueAccToken(); // 토큰 재발급 함수 실행
                !isSuccess && getMyReviews(); // 함수 다시 실행
            }
        }
    };

    // 페이지 바뀔때 작성한 리뷰 목록 가져오기
    useEffect(() => {
        if (!id) {
            alert("로그인 후 이용 가능합니다");
            navigate("/");
        } else {
            getMyReviews();
        }
    }, [page]);

    // 리뷰 삭제 버튼 함수
    const onClickReviewDelBtn = async (id) => {
        let isSuccess = false;
        try {
            const res = await axios.delete(`/api/users/reviews/${id}`, {
                headers: {
                    Authorization: `Bearer ${cookie.load("accessToken")}`,
                    "ngrok-skip-browser-warning": "1234",
                },
            });
            console.log(res);
            getMyReviews();
            isSuccess = true;
        } catch (error) {
            // 만약 401(인증) 에러가 나면
            if (error.response.status === 401) {
                await reissueAccToken(); // 토큰 재발급 함수 실행
                !isSuccess && onClickReviewDelBtn(); // 함수 다시 실행
            }
        }
    };

    const onClickProduct = (id) => {
        navigate(`/product/detail/${id}`);
    };

    return (
        <>
            {loading ? (
                <Loading content="등록한 리뷰 목록을 불러오는 중입니다.." />
            ) : (
                <div className={style.box}>
                    <NavBar />
                    {myReviews.length === 0 ? (
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <h4>등록한 상품 리뷰가 없습니다.</h4>
                        </div>
                    ) : (
                        <div>
                            <div style={{ width: "700px", margin: "0 auto" }}>
                                {myReviews?.map((review, idx) => (
                                    <div className={style.reviewBox} key={idx}>
                                        <div className={style.productBox} onClick={() => onClickProduct(review.itemId)}>
                                            <img src={review.itemImage} alt="상품이미지" width={80} height={80} />
                                            <span>{review.itemName}</span>
                                        </div>
                                        <hr />
                                        <div className={style.rateBox}>
                                            <StarRating rate={review.rate} size={18} space={3} />
                                            <span>{review.updatedAt.split("T")[0]}</span>
                                        </div>
                                        {review.reviewImage !== defaultReviewImgURL && (
                                            <div>
                                                <img
                                                    src={review.reviewImage}
                                                    alt="리뷰 이미지"
                                                    width={100}
                                                    height={100}
                                                />
                                            </div>
                                        )}

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
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "30px",
                                    marginBottom: "30px",
                                }}
                            >
                                <Pagination count={totalPage} page={page} onChange={handleChange} />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
