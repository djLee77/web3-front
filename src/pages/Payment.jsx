import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DaumPostCodeModal from "../components/payment/modal/DaumPostCodeModal";
import style from "../css/Payment.module.css";

export default function Payment() {
    const location = useLocation();
    const [name, setName] = useState(""); // 이름
    const [phone, setPhone] = useState(""); // 전화번호
    const [zipCode, setZipcode] = useState(""); // 우편 번호
    const [roadAddress, setRoadAddress] = useState(""); // 도로명 주소
    const [detailAddress, setDetailAddress] = useState(""); // 상세 주소
    const navigate = useNavigate();

    const orders = { ...location.state }; // 주문서 폼
    console.log(orders);

    const onChangePhone = (e) => {
        // 전화번호 형식으로 정규화
        const regex = /^[0-9\b -]{0,13}$/;
        if (regex.test(e.target.value)) {
            setPhone(e.target.value);
        }
    };

    //
    useEffect(() => {
        if (phone.length === 10) {
            setPhone(phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
        }
        if (phone.length === 13) {
            setPhone(phone.replace(/-/g, "").replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"));
        }
    }, [phone]);

    return (
        <div className={style.box}>
            <div style={{ display: "flex" }}>
                <div>
                    <h4>배송지</h4>
                    <div>
                        <TextField
                            helperText="받으실 분의 이름을 입력해주세요"
                            label="이름"
                            size="small"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{ marginRight: "10px" }}
                        />
                        <TextField
                            helperText="받으실 분의 전화번호를 입력해주세요"
                            label="전화번호"
                            placeholder="010-1234-5678"
                            size="small"
                            value={phone}
                            onChange={onChangePhone}
                        />
                    </div>
                    <div style={{ display: "flex", marginTop: "20px", marginBottom: "20px", alignItems: "center" }}>
                        <TextField label="우편번호" size="small" value={zipCode} sx={{ marginRight: "10px" }} />
                        <DaumPostCodeModal setZipcode={setZipcode} setRoadAddress={setRoadAddress} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", width: "460px" }}>
                        <TextField label="도로명 주소" size="small" value={roadAddress} sx={{ marginBottom: "20px" }} />
                        <TextField
                            label="상세 주소"
                            size="small"
                            value={detailAddress}
                            onChange={(e) => setDetailAddress(e.target.value)}
                        />
                    </div>
                </div>
                <div style={{ marginLeft: "80px" }}>
                    <h4>주문 상품 목록</h4>
                    <div style={{ width: "420px", height: "300px", overflow: "auto" }}>
                        {orders.data?.map((item) => (
                            <div style={{ display: "flex" }}>
                                <div>
                                    <img src={item.image} alt="상품 이미지" width={180} height={180} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span>{item.itemName}</span>
                                    <span>수량 : {item.quantity}</span>
                                    <span>가격 : {item.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={style.btnBox}>
                <Button variant="contained" sx={{ marginRight: "20px" }}>
                    결제하기
                </Button>
                <Button variant="outlined" onClick={() => navigate("/")}>
                    취소
                </Button>
            </div>
        </div>
    );
}
