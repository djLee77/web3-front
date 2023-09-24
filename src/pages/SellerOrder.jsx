import NavBar from "../components/seller/NavBar";
import style from "../css/SellerOrder.module.css";
import { MenuItem, Pagination, Select } from "@mui/material";
import cookie from "react-cookies";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../components/Loading";

export default function SellerOrder() {
    const data = {
        items: [
            {
                orderDetailId: 923183,
                orderId: 12391,
                itemId: 11001,
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
        ],
    };

    const [orders, setOrders] = useState([]); // 주문 목록
    const [page, setPage] = useState(1); // 페이지
    const [totalPage, setTotalPage] = useState(10); // 전체 페이지
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);

    const id = cookie.load("id"); // 로그인한 ID
    const navigate = useNavigate();

    // 주문 목록 가져오는 함수
    const getOrders = async () => {
        const urlPage = searchParams.get("page");
        const pageNum = urlPage ? parseInt(urlPage) : 1;
        setPage(pageNum);
        try {
            const res = await axios.get(`/api/sellers/orders/${id}`, {
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
        } catch (error) {
            console.log(error);
        }
    };

    // 첫 마운트 될 때 주문 목록 가져오기
    useEffect(() => {
        getOrders();
    }, []);

    //페이지 이동하는 함수
    const handleChange = (e, value) => {
        setPage(value);
        navigate(`/seller/order?page=${value}`);
    };

    // 주문 상품 상태 변경 함수
    const handleCountChange = async (id, e) => {
        try {
            const res = await axios.patch(
                `/api/sellers/orders/${id}`,
                {
                    result: e.target.value,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookie.load("accessToken")}`,
                        "ngrok-skip-browser-warning": "1234",
                    },
                }
            );
            console.log("주문 상태 변경 ", res);
            getOrders();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {loading ? (
                <Loading content="주문 목록을 불러오는 중입니다.." />
            ) : (
                <div className={style.box}>
                    <NavBar />
                    <div>
                        {orders?.map((product, idx) => (
                            <div className={style.orderBox}>
                                <div className={style.orderDateBox}>
                                    <span>{product.orderDate.split("T")[0]} 주문</span>
                                </div>
                                <div className={style.productBox} key={idx}>
                                    <div className={style.imgBox}>
                                        <img src={product.image} alt="상품 이미지" width={100} height={100}></img>
                                    </div>
                                    <div className={style.infoBox}>
                                        <span>{product.name}</span>
                                        <span>
                                            {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원 |{" "}
                                            {product.quantity}개
                                        </span>
                                        <span>구매자 ID : {product.buyerId}</span>
                                        <span>배송지 : {product.address}</span>
                                    </div>
                                    <div className={style.btnBox}>
                                        <Select
                                            defaultValue={product.result}
                                            onChange={(e) => handleCountChange(product.orderDetailId, e)}
                                        >
                                            <MenuItem value={0}>입금 확인 중</MenuItem>
                                            <MenuItem value={1}>배송전</MenuItem>
                                            <MenuItem value={2}>배송중</MenuItem>
                                            <MenuItem value={3}>배송 완료</MenuItem>
                                            <MenuItem value={9}>판매자 연락 요망</MenuItem>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Pagination count={totalPage} page={page} onChange={handleChange} />
                    </div>
                </div>
            )}
        </>
    );
}
