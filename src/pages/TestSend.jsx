import React, { useState } from "react";
import { useEffect } from "react";
import Web3 from "web3";
import cookie from "react-cookies";

export default function TestSend() {
    // Ganache 계정 주소 (from 계정)와 수신자 주소를 상태로 관리합니다.
    const [fromAccount, setFromAccount] = useState("");
    const [toAddress, setToAddress] = useState("");
    const [ethAmount, setEthAmount] = useState(""); // 보낼 이더 양

    // 트랜잭션 상태를 관리합니다.
    const [transactionHash, setTransactionHash] = useState("");
    const [transactionError, setTransactionError] = useState("");

    // 현재 연결된 메타마스크 계정 저장
    useEffect(() => {
        setFromAccount(cookie.load("address"));
    }, []);

    // Ganache에 연결할 URL, 로컬 환경에서만 가능..
    // const ganacheUrl = "http://localhost:7545"; // Ganache의 주소로 설정하세요.

    // Ganache와 연결
    // const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl));

    // seporia 연결, infura 활용해서 sepolia 테스트넷 원격 이더리움 노드에 접근할 수 있도록 엔드포인트 제공
    const web3 = new Web3("https://sepolia.infura.io/v3/54bf52443e4f442c8dc927eaf1825cb6");

    // 트랜잭션을 보내는 함수
    const sendTransaction = async () => {
        try {
            // 이더 양을 Wei로 변환, 0.0001 입력시 0.07205759 나옴;; 수정 필요!!
            const weiAmount = web3.utils.toWei(ethAmount.toString(), "ether");
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
            setTransactionHash(result);
            setTransactionError("");
        } catch (error) {
            setTransactionHash("");
            setTransactionError(error.message);
        }
    };

    return (
        <div>
            <h1>트랜잭션 전송</h1>
            <div>
                <label>보내는 계정 주소:</label>
                {fromAccount}
            </div>
            <div>
                <label>수신자 주소:</label>
                <input type="text" value={toAddress} onChange={(e) => setToAddress(e.target.value)} />
            </div>
            <div>
                <label>보낼 이더 양:</label>
                <input type="text" value={ethAmount} onChange={(e) => setEthAmount(e.target.value)} />
            </div>
            <button onClick={sendTransaction}>트랜잭션 보내기</button>
            {transactionHash && (
                <div>
                    <p>트랜잭션 해시: {transactionHash}</p>
                </div>
            )}
            {transactionError && (
                <div>
                    <p>트랜잭션 오류: {transactionError}</p>
                </div>
            )}
        </div>
    );
}
