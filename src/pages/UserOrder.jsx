import style from "../css/Order.module.css";
import cookie from "react-cookies";
import axios from "axios";
import { useEffect, useState } from "react";
import CreateReviewModal from "../components/review/modal/CreateReviewModal";
import NavBar from "../components/user/NavBar";

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

    // 주문 목록 가져오는 함수
    const getOrders = async () => {
        const id = cookie.load("id");
        try {
            const res = await axios.get(`/api/users/orders/${id}`, {
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

    return (
        <div>
            <NavBar />
            <h4>주문 상품 목록</h4>
            <div>
                {data.items.map((product, idx) => {
                    const orderStateByResult = {
                        1: "배송 전",
                        2: "배송 중",
                        3: "배송 완료",
                        9: "판매자 연락 요망",
                    };
                    const orderState = orderStateByResult[product.result];
                    return (
                        <div className={style.box} key={idx}>
                            <div>
                                <h4>{orderState}</h4>
                            </div>
                            <div className={style.productBox}>
                                <div className={style.imgBox}>
                                    <img src="" alt="상품 이미지"></img>
                                </div>
                                <div className={style.infoBox}>
                                    <span>주문 일자 : {product.orderDate}</span>
                                    <span>{product.name}</span>
                                    <span>{product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</span>
                                    <span>주문 개수 : {product.quantity}</span>
                                    <span></span>
                                </div>
                                {product.result === 3 && <CreateReviewModal product={product} />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
