import { Button, TextField } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DaumPostCodeModal from "../components/payment/modal/DaumPostCodeModal";
import style from "../css/Payment.module.css";
import axios from "axios";
import cookie from "react-cookies";
import reissueAccToken from "../lib/reissueAccToken";
import numberComma from "../lib/numberComma";

export default function Payment() {
    const [name, setName] = useState(""); // 이름
    const [isNameInput, setIsNameInput] = useState(true); // 이름 입력했는지 확인
    const [phone, setPhone] = useState(""); // 전화번호
    const [isPhoneInput, setIsPhoneInput] = useState(true); // 전화번호 입력했는지 확인
    const [zipCode, setZipcode] = useState(""); // 우편 번호
    const [roadAddress, setRoadAddress] = useState(""); // 도로명 주소
    const [detailAddress, setDetailAddress] = useState(""); // 상세 주소
    const [isDetailAddressInput, setIsDetailAddressInput] = useState(true); // 상세주소 입력했는지 확인
    const [modalOpen, setModalOpen] = useState(false); // 모달창 여닫기

    const navigate = useNavigate();
    const location = useLocation();

    const nameRef = useRef(); // 이름 인풋창 ref
    const phoneRef = useRef(); //전화번호 인풋창 ref
    const detailAddressRef = useRef(); // 상세주소 인풋창 ref

    const orders = location.state.orders; // 주문서 폼
    const data = location.state.data; // 상품 id, 수량

    const onChangePhone = (e) => {
        // 전화번호 형식으로 정규화
        const regex = /^[0-9\b -]{0,13}$/;
        if (regex.test(e.target.value)) {
            setPhone(e.target.value);
        }
    };

    // 결제 버튼 함수
    const onClickPaymentBtn = async () => {
        const id = cookie.load("id");
        let isSuccess = false;
        // 값들 제대로 썼는지 확인
        if (name === "") {
            nameRef.current.focus();
            return setIsNameInput(false);
        }

        if (phone === "") {
            phoneRef.current.focus();
            return setIsPhoneInput(false);
        }

        if (zipCode === "") {
            setModalOpen(true);
        }

        if (roadAddress === "") {
            setModalOpen(true);
        }

        if (detailAddress === "") {
            detailAddressRef.current.focus();
            return setIsDetailAddressInput(false);
        }

        try {
            const res = await axios.post(
                `/api/users/payments/${id}`,
                {
                    recipient: name,
                    address: roadAddress,
                    detailAddress: detailAddress,
                    phone: phone,
                    zipCode: zipCode,
                },
                {
                    params: {
                        items: data,
                    },
                    headers: {
                        Authorization: `Bearer ${cookie.load("accessToken")}`,
                        "ngrok-skip-browser-warning": "1234",
                    },
                }
            );

            if (res.status === 200) {
                alert("상품 구매 완료!");
                navigate("/");
                isSuccess = true;
            }

            console.log(res);
        } catch (error) {
            // 만약 401(인증) 에러가 나면
            if (error.response.status === 401) {
                await reissueAccToken(); // 토큰 재발급 함수 실행
                !isSuccess && onClickPaymentBtn(); // isSuccess가 false면은 장바구니 목록 함수 실행
            }
            console.log("에러:", error);
        }
    };

    // 전화번호 하이픈 넣기
    useEffect(() => {
        if (phone.length === 10) {
            setPhone(phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
        }
        if (phone.length === 13) {
            setPhone(phone.replace(/-/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"));
        }
    }, [phone]);

    // 주문 데이터가 없으면 이전 페이지로 돌아가기
    // useEffect(() => {
    //     if (orders.length === undefined) {
    //         alert("주문 상품 목록이 없습니다. 이전 페이지로 돌아갑니다.");
    //         navigate(-1);
    //     }
    // }, []);

    return (
        <div className={style.box}>
            <div style={{ display: "flex" }}>
                <div className={style.deliveryBox}>
                    <h4>배송지</h4>
                    <div>
                        <TextField
                            autoFocus
                            error={isNameInput ? false : true}
                            helperText={!isNameInput && "받으실 분의 이름을 입력해주세요"}
                            label="이름"
                            size="small"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{ marginRight: "10px" }}
                            inputRef={nameRef}
                        />
                        <TextField
                            error={isPhoneInput ? false : true}
                            helperText={!isPhoneInput && "받으실 분의 전화번호를 입력해주세요"}
                            label="전화번호"
                            placeholder="010-1234-5678"
                            size="small"
                            value={phone}
                            onChange={onChangePhone}
                            inputRef={phoneRef}
                        />
                    </div>
                    <div style={{ display: "flex", marginTop: "20px", marginBottom: "20px", alignItems: "center" }}>
                        <TextField label="우편번호" size="small" value={zipCode} sx={{ marginRight: "10px" }} />
                        <DaumPostCodeModal
                            modalOpen={modalOpen}
                            setModalOpen={setModalOpen}
                            setZipcode={setZipcode}
                            setRoadAddress={setRoadAddress}
                        />
                    </div>
                    <TextField label="도로명 주소" size="small" value={roadAddress} sx={{ marginBottom: "20px" }} />
                    <TextField
                        error={isDetailAddressInput ? false : true}
                        helperText={!isDetailAddressInput && "받으실 분의 상세 주소를 입력해주세요"}
                        label="상세 주소"
                        size="small"
                        value={detailAddress}
                        onChange={(e) => setDetailAddress(e.target.value)}
                        inputRef={detailAddressRef}
                    />
                </div>
                <div className={style.orderListBox}>
                    <h4>주문 상품 목록</h4>
                    <div style={{ width: "420px", height: "300px", overflow: "auto" }}>
                        {orders?.map((item, idx) => (
                            <div key={idx} style={{ display: "flex" }}>
                                <div>
                                    <img src={item.image} alt="상품 이미지" width={150} height={150} />
                                </div>
                                <div className={style.orderProductBox}>
                                    <span>{item.itemName}</span>
                                    <span>수량 {item.quantity}개</span>
                                    <span>가격 {numberComma(item.quantity * item.price)}원</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={style.btnBox}>
                <Button variant="contained" sx={{ marginRight: "20px" }} onClick={onClickPaymentBtn}>
                    결제하기
                </Button>
                <Button variant="outlined" onClick={() => navigate("/")}>
                    취소
                </Button>
            </div>
        </div>
    );
}
