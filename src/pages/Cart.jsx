import CartList from "../components/cart/CartList";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Cart.css";

export default function Cart() {
    const [cartList, setCartList] = useState([]); // 장바구니 목록
    const [total, setTotal] = useState(0); // 총 금액

    const navigate = useNavigate();

    // 장바구니 목록 가져오기
    const getCartList = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/carts");
            console.log("장바구니 : ", res.data.data.carts);
            setCartList(res.data.data.carts);
            setTotal(res.data.data.total);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCartList();
    }, []);

    // 결제 버튼 함수
    const handlePayBtn = () => {};

    // 취소 버튼 함수
    const handleBackBtn = () => {
        navigate("/");
    };

    return (
        <div>
            <h4>장바구니 목록</h4>
            <CartList cartList={cartList} />
            <div className="box">
                <div className="total-box">
                    <span>총 주문 금액 : </span>
                    <span className="total">{total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</span>
                </div>

                {/* 버튼 영역 */}
                <div className="cart-btn-box">
                    <button className="pay-btn" onClick={handlePayBtn}>
                        결제하기
                    </button>
                    <button className="back-btn" onClick={handleBackBtn}>
                        계속 쇼핑하기
                    </button>
                </div>
            </div>
        </div>
    );
}
