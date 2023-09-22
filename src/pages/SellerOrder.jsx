import NavBar from "../components/seller/NavBar";
import style from "../css/SellerOrder.module.css";
import { MenuItem, Select } from "@mui/material";
import cookie from "react-cookies";
import axios from "axios";
import { useEffect, useState } from "react";

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
            {
                orderDetailId: 923182,
                orderId: 12392,
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

    // 주문 목록 가져오는 함수
    const getOrders = async () => {
        try {
            const res = await axios.get(`/api/sellers/orders/${1}`, {
                headers: {
                    Authorization: `Bearer ${cookie.load("accessToken")}`,
                    "ngrok-skip-browser-warning": "1234",
                },
            });

            console.log(res);
            setOrders(res.data.data.orders);
        } catch (error) {
            console.log(error);
        }
    };

    // 첫 마운트 될 때 주문 목록 가져오기
    useEffect(() => {
        getOrders();
    }, []);

    // 주문 상품 상태 변경 함수
    const handleCountChange = async (id, e) => {
        try {
            const res = await axios.patch(
                `/api/sellers/orders/${id}`,
                {
                    quantity: e.target.value,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookie.load("accessToken")}`,
                        "ngrok-skip-browser-warning": "1234",
                    },
                }
            );

            getOrders();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <NavBar />
            <h4>주문 상품 목록</h4>
            <div>
                {data.items.map((product, idx) => (
                    <div className={style.productBox} key={idx}>
                        <div className={style.imgBox}>
                            <img src="" alt="상품 이미지"></img>
                        </div>
                        <div className={style.infoBox}>
                            <span>주문 일자 : {product.orderDate}</span>
                            <span>{product.name}</span>
                            <span>{product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</span>
                            <span>주문 개수 : {product.quantity}</span>
                            <span>구매자 ID : {product.buyerId}</span>
                            <span>배송지 : {product.address}</span>
                        </div>
                        <div className={style.btnBox}>
                            <Select
                                defaultValue={product.result}
                                onChange={(e) => handleCountChange(product.itemId, e)}
                            >
                                <MenuItem value={1}>배송전</MenuItem>
                                <MenuItem value={2}>배송중</MenuItem>
                                <MenuItem value={3}>배송 완료</MenuItem>
                                <MenuItem value={9}>판매자 연락 요망</MenuItem>
                            </Select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}