import CartList from "../components/cart/CartList";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "../css/Cart.module.css";

export default function Cart() {
    const [cartList, setCartList] = useState([]); // 장바구니 목록
    const [selectAll, setSelectAll] = useState(false); // 상품 전체 선택
    const [selectedItems, setSelectedItems] = useState([]); // 선택한 상품 목록
    const [total, setTotal] = useState(0); // 총 금액

    const navigate = useNavigate();

    // 토탈 가격 구하기
    useEffect(() => {
        // 선택된 아이템들의 price 값을 합산하여 totalPrice 업데이트
        let total = 0;
        selectedItems.forEach((itemId) => {
            const selectedItem = cartList.find((item) => item.cartId === itemId);
            if (selectedItem) {
                total += selectedItem.price * selectedItem.quantity; // 선택한 상품의 수량과 가격 곱해서 토탈에 더함
            }
        });
        setTotal(total);
    }, [selectedItems, cartList]);

    // 장바구니 목록 가져오는 함수
    const getCartList = async () => {
        try {
            const res = await axios.get(`/api/users/carts/${1}`, {
                headers: {
                    "ngrok-skip-browser-warning": "1234",
                },
            });
            console.log("장바구니 : ", res.data.data);
            setCartList(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    // 처음 마운트 될때 카테고리 가져오기
    useEffect(() => {
        getCartList();
    }, []);

    // 결제 버튼 함수
    const handlePayBtn = () => {
        alert("구현 중");
    };

    // 취소 버튼 함수
    const handleBackBtn = () => {
        navigate("/");
    };

    return (
        <div>
            <h4>장바구니 목록</h4>
            <CartList
                cartList={cartList}
                selectAll={selectAll}
                setSelectAll={setSelectAll}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                getCartList={getCartList}
            />
            <div className={style.box}>
                <div className={style.totalBox}>
                    <span>총 주문 금액 : </span>
                    <span className={style.total}>{total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</span>
                </div>

                {/* 버튼 영역 */}
                <div className={style.cartBtnBox}>
                    <button className={style.payBtn} onClick={handlePayBtn}>
                        결제하기
                    </button>
                    <button className={style.backBtn} onClick={handleBackBtn}>
                        계속 쇼핑하기
                    </button>
                </div>
            </div>
        </div>
    );
}
