import React, { useState } from "react";
import { useEffect } from "react";
import Web3 from "web3";
import cookie from "react-cookies";

export default function TestSend() {
    // Ganache에 연결할 URL
    const ganacheUrl = "http://localhost:7545"; // Ganache의 주소로 설정하세요.

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

    // Ganache와 연결
    const web3 = new Web3(new Web3.providers.HttpProvider(ganacheUrl));

    // 트랜잭션을 보내는 함수
    const sendTransaction = async () => {
        try {
            // 이더 양을 Wei로 변환
            const weiAmount = web3.utils.toWei(ethAmount, "ether");

            // 트랜잭션 정보 설정
            const transactionData = {
                from: fromAccount,
                to: toAddress,
                value: weiAmount,
            };

            // 트랜잭션 전송
            const receipt = await web3.eth.sendTransaction(transactionData);
            setTransactionHash(receipt.transactionHash);
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
