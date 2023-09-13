import { forwardRef, useEffect, useState } from "react";
import StarRating from "../../StarRating";
import { Avatar, Pagination } from "@mui/material";
import style from "../../../css/Review.module.css";
import axios from "axios";

const Review = forwardRef((props, ref) => {
    const [reviewList, setReviewList] = useState([]); // 리뷰 목록
    const [page, setPage] = useState(1); // 페이지
    const [totalPage, setTotalPage] = useState(10); // 전체 페이지
    const [sortType, setSortType] = useState(""); // 정렬 타입

    // 정렬 타입 배열
    const sortTypes = [
        {
            name: "최신순",
            code: "n",
        },
        {
            name: "높은 별점순",
            code: "hr",
        },
        {
            name: "낮은 별점순",
            code: "lr",
        },
    ];

    //페이지 이동하는 함수
    const handleChange = (e, value) => {
        setPage(value);
    };

    const onClickSortType = (code) => {
        setSortType(code);
    };

    // 리뷰 가져오는 함수
    const getReview = async () => {
        console.log(page);
        try {
            const res = await axios.get(`/api/public/reviews/${props.id}`, {
                params: {
                    sortType: sortType,
                    pageNum: page,
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
            <div className={style.totalBox}>
                <h4>총 평점</h4>
                <StarRating rate={props.rate} size={32} space={2} />
                <span>({props.reviewCount})</span>
            </div>
            <hr />
            <div className={style.sortBox}>
                {sortTypes.map((item, idx) => (
                    <span key={idx} onClick={() => onClickSortType(item.code)}>
                        {item.name}
                    </span>
                ))}
            </div>
            {reviewList.map((review) => (
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
            <div className={style.paginationBox}>
                <Pagination count={totalPage} page={page} onChange={handleChange} />
            </div>
        </div>
    );
});

export default Review;
