import { Button, TextField } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DaumPostCodeModal from "../components/payment/modal/DaumPostCodeModal";
import style from "../css/Payment.module.css";
import axios from "axios";
import cookie from "react-cookies";
import reissueAccToken from "../lib/reissueAccToken";
import numberComma from "../lib/numberComma";
import exchangeWonToEth from "../lib/exchangeWonToEth";
import Web3 from "web3";

export default function Payment() {
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    const [name, setName] = useState(""); // 이름
    const [isNameInput, setIsNameInput] = useState(true); // 이름 입력했는지 확인
    const [phone, setPhone] = useState(""); // 전화번호
    const [isPhoneInput, setIsPhoneInput] = useState(true); // 전화번호 입력했는지 확인
    const [zipCode, setZipcode] = useState(""); // 우편 번호
    const [roadAddress, setRoadAddress] = useState(""); // 도로명 주소
    const [detailAddress, setDetailAddress] = useState(""); // 상세 주소
    const [isDetailAddressInput, setIsDetailAddressInput] = useState(true); // 상세주소 입력했는지 확인
    const [modalOpen, setModalOpen] = useState(false); // 우편번호 모달창 여닫기
    const [isDisabled, setIsDisabled] = useState(false); // 메타마스크 결제 창 열릴시 배송지 변경 못하게
    const [fromAccount, setFromAccount] = useState("0x2c879C9Fc9399024E3FD17e5cF6ccd02Bb6f0dD0"); // 보내는 계정 주소
    const [toAddress, setToAddress] = useState("0x700ABc8484329FfB828ee2B76D2758a1233E6742"); // 받는 계정 주소
    const [orderProduct, setOrderProduct] = useState([]); // 주문 상품

    // seporia 연결, infura 활용해서 sepolia 테스트넷 원격 이더리움 노드에 접근할 수 있도록 엔드포인트 제공
    const web3 = new Web3("https://sepolia.infura.io/v3/54bf52443e4f442c8dc927eaf1825c77b6");

    const navigate = useNavigate();
    const location = useLocation(); // url 정보 가져오기

    const nameRef = useRef(); // 이름 인풋창 ref
    const phoneRef = useRef(); //전화번호 인풋창 ref
    const detailAddressRef = useRef(); // 상세주소 인풋창 ref

    // const orders = location.state.orders; // location에 있는 주문서 폼
    const data = location.state.data.split(":"); // location에 있는 productId, quantity
    const productId = data[0];
    const quantity = data[1];

    // 전화번호 형식으로 정규화 함수
    const onChangePhone = (e) => {
        const regex = /^[0-9\b -]{0,13}$/;
        if (regex.test(e.target.value)) {
            setPhone(e.target.value);
        }
    };

    useEffect(() => {
        getProductInfo(productId);
    }, []);

    // 상품 정보 가져오는 함수
    const getProductInfo = async (id) => {
        try {
            const res = await axios.get(`${serverUrl}/api/public/items/${id}`);
            console.log("상품 정보 : ", res.data.data);
            setOrderProduct(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    // 트랜잭션을 보내는 함수
    const onClickPaymentBtn = async () => {
        // 값들 제대로 썼는지 확인 제대로 안 썼으면 인풋창 포커스 한 후 false 리턴
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
            setIsDisabled(true);
            const weiAmount = web3.utils.toWei(exchangeWonToEth(orderProduct.price * quantity).toString(), "ether");
            const gasLimit = "21000"; // 가스 한도 (기본값)
            const gasPrice = web3.utils.toWei("1", "gwei"); // 가스 가격 (Gwei 단위, 예: 50 Gwei)
            const hexValue = web3.utils.numberToHex(weiAmount); // 16진수로 변환 (이더리움은 16진수로 되어있음)

            // 트랜잭션 정보 설정
            const transactionData = {
                from: fromAccount, // 보내는 계정 주소
                to: toAddress, // 받는 계정 주소
                value: hexValue, // 이더 양
                gas: gasLimit, // 가스 한도 설정
                gasPrice: gasPrice, // 가스 가격 설정
            };

            // 트랜잭션 전송
            // 메타마스크로 트랜잭션 보내기
            const result = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [transactionData],
            });
            console.log("영수증 : ", result);
            if (result !== "") {
                sendPaymentInfo();
                setIsDisabled(false);
            }
        } catch (error) {
            console.log(error);
            setIsDisabled(false);
        }
    };

    // 결제 정보 보내기
    const sendPaymentInfo = async () => {
        const id = cookie.load("id");
        let isSuccess = false;
        try {
            const res = await axios.post(
                `${serverUrl}/api/users/payments/${id}`,
                {
                    recipient: name,
                    address: roadAddress,
                    detailAddress: detailAddress,
                    phone: phone,
                    zipCode: zipCode,
                    //transactionHash 보내기
                },
                {
                    params: {
                        items: location.state.data,
                    },
                    headers: {
                        Authorization: `Bearer ${cookie.load("accessToken")}`,
                    },
                }
            );

            console.log(res);

            if (res.data.data !== null) {
                alert("상품 구매 완료!");
                navigate("/");
                isSuccess = true;
            } else {
                alert("상품 구매 실패 관리자에게 문의 바랍니다.");
                navigate("/");
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
                            disabled={isDisabled}
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
                            disabled={isDisabled}
                        />
                    </div>
                    <div style={{ display: "flex", marginTop: "20px", marginBottom: "20px", alignItems: "center" }}>
                        <TextField label="우편번호" size="small" value={zipCode} sx={{ marginRight: "10px" }} />
                        <DaumPostCodeModal
                            modalOpen={modalOpen}
                            setModalOpen={setModalOpen}
                            setZipcode={setZipcode}
                            setRoadAddress={setRoadAddress}
                            isDisabled={isDisabled}
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
                        disabled={isDisabled}
                    />
                </div>
                <div className={style.orderListBox}>
                    <h4>주문 상품 목록</h4>
                    <div style={{ width: "420px", height: "300px", overflow: "auto" }}>
                        <div style={{ display: "flex" }}>
                            <div>
                                <img src={orderProduct.image1} alt="상품 이미지" width={150} height={150} />
                            </div>
                            <div className={style.orderProductBox}>
                                <span>{orderProduct.name}</span>
                                <span>수량 {quantity}개</span>
                                <span>
                                    가격 {numberComma(quantity * orderProduct.price)}원 /{" "}
                                    {exchangeWonToEth(quantity * orderProduct.price)} eth
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.btnBox}>
                <button className={style.payBtn} onClick={onClickPaymentBtn}>
                    결제하기
                </button>
                <button className={style.backBtn} onClick={() => navigate("/")}>
                    취소
                </button>
            </div>
        </div>
    );
}
