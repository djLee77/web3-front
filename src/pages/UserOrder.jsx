import cookie from "react-cookies";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CreateReviewModal from "../components/review/modal/CreateReviewModal";
import NavBar from "../components/user/NavBar";
import { Pagination } from "@mui/material";
import style from "../css/UserOrder.module.css";
import Loading from "../components/Loading";
import reissueAccToken from "../lib/reissueAccToken";
import numberComma from "../lib/numberComma";

export default function UserOrder() {
    const [orders, setOrders] = useState([]); // 주문 목록
    const [reviewItemIds, setReviewItemIds] = useState([]); // 작성한 리뷰 상품id 목록
    const [page, setPage] = useState(1); // 페이지
    const [totalPage, setTotalPage] = useState(10); // 전체 페이지
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const id = cookie.load("id");

    //페이지 이동하는 함수
    const handleChange = (e, value) => {
        setPage(value);
        navigate(`/user/order?page=${value}`);
    };

    // 작성한 리뷰 목록 가져오기
    const getMyReviews = async () => {
        let isSuccess = false;
        try {
            console.log(id);
            const res = await axios.get(`/api/users/reviews/${id}`, {
                params: {
                    pageNum: 0,
                    pageSize: 1000,
                },
                headers: {
                    Authorization: `Bearer ${cookie.load("accessToken")}`,
                    "ngrok-skip-browser-warning": "1234",
                },
            });

            setReviewItemIds(res.data.data.reviews.map((item) => item.itemId));
            console.log("리뷰 불러옴");
        } catch (error) {
            // 만약 401(인증) 에러가 나면
            if (error.response.status === 401) {
                await reissueAccToken(); // 토큰 재발급 함수 실행
                !isSuccess && getMyReviews(); // 함수 다시 실행
            }
        }
    };

    // 주문 목록 가져오는 함수
    const getOrders = async () => {
        let isSuccess = false;
        const urlPage = searchParams.get("page");
        const pageNum = urlPage ? parseInt(urlPage) : 1;
        setPage(pageNum);
        try {
            const res = await axios.get(`/api/users/orders/${id}`, {
                params: {
                    pageNum: page - 1, // 백엔드 페이징은 0부터 시작해서 -1
                    pageSize: 2,
                },
                headers: {
                    Authorization: `Bearer ${cookie.load("accessToken")}`,
                    "ngrok-skip-browser-warning": "1234",
                },
            });

            console.log("주문목록 불러옴");

            setOrders(res.data.data.orders);
            setTotalPage(res.data.data.totalPage);
            setLoading(false);
            isSuccess = true;
        } catch (error) {
            // 만약 401(인증) 에러가 나면
            if (error.response.status === 401) {
                await reissueAccToken(); // 토큰 재발급 함수 실행
                !isSuccess && getOrders(); // 함수 다시 실행
            }
        }
    };

    // 페이지 바뀔때 주문 목록 가져오기
    useEffect(() => {
        id && getOrders();
    }, [page]);

    useEffect(() => {
        if (!id) {
            alert("로그인 후 이용 가능합니다");
            navigate("/");
        } else {
            getMyReviews();
        }
    }, []);

    return (
        <>
            {loading ? (
                <Loading content="주문 목록을 불러오는 중입니다.." />
            ) : (
                <div className={style.box}>
                    <NavBar />
                    {orders.length === 0 ? (
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <h4>주문하신 상품이 없습니다.</h4>
                        </div>
                    ) : (
                        <div>
                            {orders?.map((order, idx) => (
                                <div className={style.orderBox} key={idx}>
                                    <h4>{order.orderDate.split("T")[0]} 주문</h4>
                                    {order.orderDetails?.map((product, idx) => {
                                        const orderStateByResult = {
                                            0: "입금 확인 중",
                                            1: "배송 전",
                                            2: "배송 중",
                                            3: "배송 완료",
                                            9: "판매자 연락 요망",
                                        };
                                        const orderState = orderStateByResult[product.result];
                                        return (
                                            <div className={style.orderDetailBox} key={idx}>
                                                <h5
                                                    style={{
                                                        fontWeight: "bold",
                                                        marginTop: "10px",
                                                        marginBottom: "20px",
                                                    }}
                                                >
                                                    {orderState}
                                                </h5>
                                                <div style={{ display: "flex" }}>
                                                    <img
                                                        src={product.image}
                                                        alt="상품 이미지"
                                                        width={100}
                                                        height={100}
                                                    />
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            marginLeft: "14px",
                                                            width: "60%",
                                                        }}
                                                    >
                                                        <span>{product.itemName}</span>
                                                        <span>
                                                            {numberComma(product.price)}원 | {product.quantity}개
                                                        </span>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        {product.result === 3 &&
                                                            (!reviewItemIds?.includes(product.itemId) ? (
                                                                <CreateReviewModal
                                                                    product={product}
                                                                    getMyReviews={getMyReviews}
                                                                />
                                                            ) : (
                                                                <div>리뷰 작성 완료</div>
                                                            ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <Pagination count={totalPage} page={page} onChange={handleChange} />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
