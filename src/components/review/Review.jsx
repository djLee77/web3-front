import { forwardRef, useEffect, useState } from "react";
import StarRating from "../StarRating";
import { Avatar, Pagination } from "@mui/material";
import style from "../../css/Review.module.css";
import axios from "axios";

const Review = forwardRef((props, ref) => {
    const [reviewList, setReviewList] = useState([]); // 리뷰 목록
    const [page, setPage] = useState(1); // 페이지
    const [totalPage, setTotalPage] = useState(10); // 전체 페이지
    const [sort, setSort] = useState(""); // 정렬 타입
    const [sortType, setSortType] = useState(""); // 정렬 방법

    // 정렬 타입 배열
    const sortTypes = [
        {
            name: "최신순",
            sort: "createdAt",
            sortType: "asc",
        },
        {
            name: "오래된순",
            sort: "createdAt",
            sortType: "desc",
        },
        {
            name: "높은 별점순",
            sort: "rate",
            sortType: "asc",
        },
        {
            name: "낮은 별점순",
            sort: "rate",
            sortType: "desc",
        },
    ];

    //페이지 이동하는 함수
    const handleChange = (e, value) => {
        setPage(value);
    };

    // 정렬 방법 클릭
    const onClickSortType = (sort, sortType) => {
        setSort(sort);
        setSortType(sortType);
        setPage(1);
    };

    // 리뷰 가져오는 함수
    const getReview = async () => {
        console.log(page);
        try {
            const res = await axios.get(`/api/public/reviews/${props.id}`, {
                params: {
                    sort: sort,
                    sortType: sortType,
                    pageNum: page - 1, // 백엔드 페이징은 0부터 시작해서 -1
                    pageSize: 10,
                },
                headers: {
                    "ngrok-skip-browser-warning": "1234",
                },
            });
            setReviewList(res.data.data.reviews);
            setTotalPage(res.data.data.totalPage);
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    // 페이지 바뀔때 마다 리뷰 가져오기
    useEffect(() => {
        getReview();
    }, [page, sortType]);

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
        <div ref={ref}>
            <hr />
            {reviewList.length === 0 ? (
                <div style={{ display: "flex", justifyContent: "center", fontSize: "18px" }}>
                    등록된 상품평이 없습니당
                </div>
            ) : (
                <>
                    <div className={style.totalBox}>
                        <h4>총 평점</h4>
                        <StarRating rate={props.rate} size={24} space={2} />
                        <span>({props.reviewCount})</span>
                    </div>
                    <hr />
                    <div className={style.sortBox}>
                        {sortTypes.map((item, idx) => (
                            <span key={idx} onClick={() => onClickSortType(item.sort, item.sortType)}>
                                {item.name}
                            </span>
                        ))}
                    </div>
                    {reviewList.map((review) => (
                        <div>
                            <div className={style.headerBox}>
                                <Avatar sx={{ width: "48px", height: "48px" }} />
                                <div className={style.userBox}>
                                    <span className={style.userId}>{review.userId}</span>
                                    <div className={style.rateBox}>
                                        <StarRating rate={review.rate} size={14} space={2} />
                                        <span className={style.updatedAt}>{review.updatedAt.split("T")[0]}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={style.imgBox}>
                                <img src={review.image} alt="리뷰사진" width={100} height={100}></img>
                            </div>
                            <div className={style.contentBox}>
                                <span>{review.content}</span>
                            </div>
                            <hr />
                        </div>
                    ))}
                    <div className={style.paginationBox}>
                        <Pagination count={totalPage} page={page} onChange={handleChange} />
                    </div>
                </>
            )}
        </div>
    );
});

export default Review;
