import CartList from "../components/cart/CartList";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "../css/Cart.module.css";
import cookie from "react-cookies";
import Loading from "../components/Loading";
import reissueAccToken from "../lib/reissueAccToken";

export default function Cart() {
    const [cartList, setCartList] = useState([]); // 장바구니 목록
    const [selectAll, setSelectAll] = useState(false); // 상품 전체 선택
    const [selectedItems, setSelectedItems] = useState([]); // 선택한 상품 목록
    const [total, setTotal] = useState(0); // 총 금액
    const [loading, setLoading] = useState(true);

    const id = cookie.load("id"); // 사용자 ID
    const navigate = useNavigate();

    // 토탈 가격 구하기
    useEffect(() => {
        // 선택된 아이템들의 price 값을 합산하여 totalPrice 업데이트
        let total = 0;
        console.log(selectedItems);
        selectedItems.forEach((item) => {
            const selectedItem = cartList.find((cart) => cart.itemId === item.itemId);
            if (selectedItem) {
                total += selectedItem.price * selectedItem.quantity; // 선택한 상품의 수량과 가격 곱해서 토탈에 더함
            }
        });
        setTotal(total);
    }, [selectedItems, cartList]);

    // 장바구니 목록 가져오는 함수
    const getCartList = async () => {
        // 장바구니 목록 불러왔는지 확인
        let isSuccess = false;
        setLoading(true);
        try {
            const res = await axios.get(`/api/users/carts/${id}`, {
                headers: {
                    Authorization: `Bearer ${cookie.load("accessToken")}`,
                    "ngrok-skip-browser-warning": "1234",
                },
            });
            console.log("장바구니 : ", res.data.data);
            setCartList(res.data.data);
            setLoading(false);
            isSuccess = true; // 장바구니 목록 가져왔으면 isSuccess true로 변경
        } catch (error) {
            // 만약 401(인증) 에러가 나면
            if (error.response.status === 401) {
                await reissueAccToken(); // 토큰 재발급 함수 실행
                !isSuccess && getCartList(); // isSuccess가 false면은 장바구니 목록 함수 실행
            }
            console.log("에러:", error);
        }
    };

    // 처음 마운트 될때 카테고리 가져오기
    useEffect(() => {
        getCartList();
    }, []);

    // 주문서 데이터 생성
    const createOrders = async () => {
        let isSuccess = false;
        try {
            console.log(selectedItems);
            const data = selectedItems.map(({ itemId, quantity }) => `${itemId}:${quantity}`).join(",");
            console.log(data);
            const res = await axios.get(`/api/users/form/orders/${id}`, {
                params: {
                    items: data,
                },
                headers: {
                    Authorization: `Bearer ${cookie.load("accessToken")}`,
                    "ngrok-skip-browser-warning": "1234",
                },
            });

            console.log(res);
            const orders = res.data.data; // 주문서 저장
            isSuccess = true;
            navigate("/payment", { state: { orders: orders, data: data } }); // 결제 페이지에 주문서 데이터 보내주기
        } catch (error) {
            // 만약 401(인증) 에러가 나면
            if (error.response.status === 401) {
                await reissueAccToken(); // 토큰 재발급 함수 실행
                !isSuccess && createOrders(); // 함수 다시 실행
            }
            console.log("에러:", error);
        }
    };

    // 결제 버튼 함수
    const onClickPayBtn = () => {
        createOrders();
    };

    // 돌아가기 버튼 함수
    const onClickBackBtn = () => {
        navigate("/");
    };

    return (
        <>
            {loading ? (
                <Loading content="장바구니 목록을 불러오는 중입니다.." />
            ) : (
                <div className={style.box}>
                    <h4 className={style.title}>장바구니</h4>
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
                            <span className={style.total}>
                                {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
                            </span>
                        </div>

                        {/* 버튼 영역 */}
                        <div className={style.cartBtnBox}>
                            <button className={style.payBtn} onClick={onClickPayBtn}>
                                결제하기
                            </button>
                            <button className={style.backBtn} onClick={onClickBackBtn}>
                                계속 쇼핑하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
