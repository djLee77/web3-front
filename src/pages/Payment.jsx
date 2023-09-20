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
        <div>
            <div>
                <h4>받는 사람 정보</h4>
                <div>
                    <TextField helperText="받으실 분의 이름을 입력해주세요" label="이름" size="small" />
                    <TextField helperText="받으실 분의 전화번호를 입력해주세요" label="전화번호" size="small" />
                </div>
                <div style={{ display: "flex" }}>
                    <TextField label="우편번호" size="small" value={zipCode} />
                    <DaumPostCodeModal setZipcode={setZipcode} setRoadAddress={setRoadAddress} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", width: "500px" }}>
                    <TextField label="도로명 주소" size="small" value={roadAddress} />
                    <TextField
                        label="상세 주소"
                        size="small"
                        value={detailAddress}
                        onChange={(e) => setDetailAddress(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
