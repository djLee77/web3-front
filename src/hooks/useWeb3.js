import { useEffect } from "react";
import { useState } from "react";
import Web3 from "web3";

/**
web3-react 라이브러리 말고 web3 라이브러리를 사용하여 계정 연결하는 방법

쓸지 안 쓸지 아직 의문
 */

export default function useWeb3() {
    // 메타마스크에서 사용하고 있는 계정과 관련된 상태
    const [account, setAccount] = useState(null);
    // 클라이언트와 메타마스크가 통신하기 위한 web3
    const [web3, setWeb3] = useState(null);

    useEffect(() => {
        (async () => {
            /*
                클라이언트 브라우저에 메타마스크 확장프로그램이 설치되어 있지 않다면 알림창 띄우고 함수 종료
            */
            if (!window.ethereum) {
                alert("메타마스크 확장 프로그램을 설치해주세요");
                return;
            }

            /*
             메타마스크가 설치되어 있다면 아래와 같이 window.ethereum.request( ) 메소드를 사용해 메타마스크에서 
             현재 연결되어 있는 계정을 가져와 account 상태값을 업데이트 해준다.
             */
            const [address] = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            setAccount(address);

            /*
            new Web3(window.ethereum) 에 의해 생성된 web3 인스턴스로 web3 상태값을 업데이트 해준다. 
            이제 해당 web3 인스턴스를 통해서 메타마스크와 통신을 주고 받을 수 있게 된다.
            */
            const web3 = new Web3(window.ethereum);
            setWeb3(web3);
        })();
    }, []);

    return [web3, account];
}
