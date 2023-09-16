import NavBar from "../components/seller/NavBar";
import style from "../css/SellerOrder.module.css";
import { MenuItem, Select } from "@mui/material";
import cookie from "react-cookies";
import axios from "axios";

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
                address: "인천 계양구",
            },
        ],
    };

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
