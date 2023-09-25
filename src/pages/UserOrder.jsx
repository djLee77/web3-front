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

export default function UserOrder() {
    const data = {
        items: [
            {
                orderDetailId: 923183,
                orderId: 12391,
                itemId: 2,
                name: "이쁜옷1",
                sellerId: "aF3ksj3",
                image: "imageUrl",
                price: 10000,
                quantity: 10,
                result: 1,
                orderDate: "2023-09-16",
                buyerId: "asdk123",
                address: "인천 계양구",
            },
            {
                orderDetailId: 923182,
                orderId: 3,
                itemId: 3,
                name: "이쁜옷1",
                sellerId: "aF3ksj3",
                image: "imageUrl",
                price: 10000,
                quantity: 10,
                result: 3,
                orderDate: "2023-09-16",
                buyerId: "asdk123",
                address: "인천 계양구",
            },
        ],
    };

    const [orders, setOrders] = useState([]); // 주문 목록
    const [page, setPage] = useState(1); // 페이지
    const [totalPage, setTotalPage] = useState(10); // 전체 페이지
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    //페이지 이동하는 함수
    const handleChange = (e, value) => {
        setPage(value);
        navigate(`/user/order?page=${value}`);
    };

    // 주문 목록 가져오는 함수
    const getOrders = async () => {
        let isSuccess = false;
        const id = cookie.load("id");
        const urlPage = searchParams.get("page");
        const pageNum = urlPage ? parseInt(urlPage) : 1;
        setPage(pageNum);
        try {
            const res = await axios.get(`/api/users/orders/${id}`, {
                params: {
                    pageNum: page,
                    pageSize: 10,
                },
                headers: {
                    Authorization: `Bearer ${cookie.load("accessToken")}`,
                    "ngrok-skip-browser-warning": "1234",
                },
            });

            console.log(res);
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
        getOrders();
    }, [page]);

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
                                    {order.orderDetails.map((product) => {
                                        const orderStateByResult = {
                                            0: "입금 확인 중",
                                            1: "배송 전",
                                            2: "배송 중",
                                            3: "배송 완료",
                                            9: "판매자 연락 요망",
                                        };
                                        const orderState = orderStateByResult[product.result];
                                        return (
                                            <div className={style.orderDetailBox}>
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
                                                            {product.price
                                                                .toString()
                                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                            원 | {product.quantity}개
                                                        </span>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        {product.result === 3 && (
                                                            <CreateReviewModal product={product} />
                                                        )}
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
