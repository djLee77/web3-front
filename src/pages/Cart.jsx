import CartList from "../components/cart/CartList";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "../css/Cart.module.css";
import cookie from "react-cookies";
import Loading from "../components/Loading";
import reissueAccToken from "../lib/reissueAccToken";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import numberComma from "../lib/numberComma";

export default function Cart() {
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const [cartList, setCartList] = useState([]); // 장바구니 목록
    // const [selectAll, setSelectAll] = useState(false); // 상품 전체 선택
    // const [selectedItems, setSelectedItems] = useState([]); // 선택한 상품 목록
    // const [total, setTotal] = useState(0); // 총 금액
    const [loading, setLoading] = useState(true);

    const id = cookie.load("id"); // 사용자 ID
    const navigate = useNavigate();

    // 중복된 상품 합치는 함수
    const mergeDuplicateItems = (cartItems) => {
        const mergedCart = [];
        cartItems.forEach((item) => {
            const existingItem = mergedCart.find((mergedItem) => mergedItem.itemId === item.itemId);
            if (existingItem) {
                // 중복된 아이템이 이미 존재하는 경우, 수량 합치기
                existingItem.quantity += item.quantity;
            } else {
                // 중복되지 않은 아이템은 그대로 추가
                mergedCart.push({ ...item });
            }
        });
        return mergedCart;
    };

    // 토탈 가격 구하기
    // useEffect(() => {
    //     // 선택된 아이템들의 price 값을 합산하여 totalPrice 업데이트
    //     let total = 0;
    //     console.log(selectedItems);
    //     selectedItems.forEach((item) => {
    //         const selectedItem = cartList.find((cart) => cart.cartId === item.cartId);
    //         if (selectedItem) {
    //             total += selectedItem.price * selectedItem.quantity; // 선택한 상품의 수량과 가격 곱해서 토탈에 더함
    //         }
    //     });
    //     setTotal(total);
    // }, [selectedItems, cartList]);

    // 장바구니 목록 가져오는 함수
    const getCartList = async () => {
        // 장바구니 목록 불러왔는지 확인
        let isSuccess = false;
        setLoading(true);
        try {
            const res = await axios.get(`${serverUrl}/api/users/carts/${id}`, {
                headers: {
                    Authorization: `Bearer ${cookie.load("accessToken")}`,
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
        if (!id) {
            alert("로그인 후 이용 가능합니다");
            navigate("/");
        } else {
            getCartList();
        }
    }, []);

    // // 주문서 데이터 생성
    // const createOrders = async () => {
    //     let isSuccess = false;
    //     try {
    //         // console.log(selectedItems);
    //         // const data = selectedItems.map(({ itemId, quantity }) => `${itemId}:${quantity}`).join(",");
    //         const data = `${productId}:${quantity}`;
    //         console.log(data);
    //         const res = await axios.get(`${serverUrl}/api/users/form/orders/${id}`, {
    //             params: {
    //                 items: data,
    //             },
    //             headers: {
    //                 Authorization: `Bearer ${cookie.load("accessToken")}`,
    //             },
    //         });

    //         console.log(res);
    //         const orders = res.data.data; // 주문서 저장
    //         isSuccess = true;
    //         navigate("/payment", { state: { orders: orders, data: data } }); // 결제 페이지에 주문서 데이터 보내주기
    //     } catch (error) {
    //         // 만약 401(인증) 에러가 나면
    //         if (error.response.status === 401) {
    //             await reissueAccToken(); // 토큰 재발급 함수 실행
    //             !isSuccess && createOrders(); // 함수 다시 실행
    //         }
    //         console.log("에러:", error);
    //     }
    // };

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
                    <CartList cartList={cartList} getCartList={getCartList} />
                    <div className={style.box}>
                        {/* <div className={style.totalBox}>
                            <span>총 주문 금액 : </span>
                            <span className={style.total}>{numberComma(total)}원</span>
                        </div> */}

                        {/* 버튼 영역 */}
                        <div className={style.cartBtnBox}>
                            {/* <button className={style.payBtn} onClick={onClickPayBtn}>
                                결제하기
                            </button> */}
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
