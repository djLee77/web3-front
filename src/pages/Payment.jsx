import { TextField } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import DaumPostCodeModal from "../components/payment/modal/DaumPostCodeModal";

export default function Payment() {
    const location = useLocation();
    const [name, setName] = useState(""); // 받으실분 이름
    const [phone, setPhone] = useState(""); // 받으실분 전화번호
    const [zipCode, setZipcode] = useState("");
    const [roadAddress, setRoadAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");

    const orders = { ...location.state }; // 주문서 폼
    console.log(orders);

    return (
        <div style={{ display: "flex", flexDirection: "column", flexWrap: "wrap", alignContent: "center" }}>
            <div style={{ display: "flex" }}>
                <div>
                    <h4>배송지</h4>
                    <div>
                        <TextField
                            helperText="받으실 분의 이름을 입력해주세요"
                            label="이름"
                            size="small"
                            sx={{ marginRight: "10px" }}
                        />
                        <TextField helperText="받으실 분의 전화번호를 입력해주세요" label="전화번호" size="small" />
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
                        {orders.data.map((item) => (
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
            <div>
                <button>결제하기</button>
                <button>취소</button>
            </div>
        </div>
    );
}
