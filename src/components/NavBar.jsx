import React from "react";
import ToggleMenu from "./ToggleMenu";
import "../css/NavBar.module.css";
import SearchBar from "../components/SearchBar";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../lib/connectors";
import { useEffect, useState } from "react";
const NavBar = () => {
  const [balance, setBalance] = useState(""); // 토큰

  // 사용자가 연결된 네트워크를 id가 아닌 name 또는 symbol로 보여주기 위한 배열
  const chainIds = {
    1: { name: "Ethereum mainnet", symbol: "ETH" },
    3: { name: "Ropsten", symbol: "RopstenETH" },
    4: { name: "Rinkeby", symbol: "RinkebyETH" },
    5: { name: "Goerli", symbol: "GoerliETH" },
    42: { name: "Kovan", symbol: "KovanETH" },
    11155111: { name: "Sepolia", symbol: "SepoliaETH" },
    56: { name: "Binance Smart Chain Mainnet", symbol: "BNB" },
    97: { name: "Binance Smart Chain Testnet", symbol: "tBNB" },
    43114: { name: "Avalanche C-Chain", symbol: "AVAX" },
    137: { name: "Polygon Mainnet", symbol: "MATIC" },
    80001: { name: "Mumbai", symbol: "MATIC" },
    42161: { name: "Arbitrum One", symbol: "ETH" },
    10: { name: "Optimism", symbol: "ETH" },
    250: { name: "Fantom Opera", symbol: "FTM" },
    8217: { name: "Klaytn Mainnet Cypress", symbol: "KLAY" },
    1001: { name: "baobob", symbol: "KLAY" },
    61: { name: "Ethereum Classic Mainnet", symbol: "ETC" },
  };

  const { chainId, account, library, active, activate, deactivate } =
    useWeb3React();
  console.log(injected);

  const handdleConnect = () => {
    // 만약 이미 연결 돼있으면 연결 해제
    if (active) {
      deactivate();
      return;
    }

    // 메타마스크 계정
    activate(injected, (error) => {
      // 크롬 익스텐션 없을 경우 오류 핸들링
      if ("/No Ethereum provider was found on window.ethereum/".test(error)) {
        window.open("https://metamask.io/download.html");
      }
    });
  };

  useEffect(() => {
    // 계정 연결 됐으면
    if (account) {
      // 계정에 연결된 네트워크 코인 가져오기
      library?.getBalance(account).then((result) => {
        setBalance(result._hex / 10 ** 18); // 16진수로 보기 힘들게 나와서 바꿔주기
        console.log("result : ", result);
      });
      // TODO : 계정 연결 됐으면 서버에 요청 보내서 식별 ID 받아와야함
    }
  }, [account]);

  return (
    <div className="body">
      <div>
        <ToggleMenu />
      </div>
      <div style={{ float: "right" }}>
        <div style={{ float: "left" }}>
          <div style={{ float: "left" }}>
            <SearchBar />
          </div>
          <div style={{ float: "right" }}>
            <div>
              <div style={{ float: "left" }}>
                <button type="button" onClick={handdleConnect}>
                  {active ? "disconnect" : "connect"}
                </button>
              </div>
              <div style= {{float :"right"}}>
                <p>Account: {account}</p>
                {/* <p>ChainId: {chainIds[chainId]?.name}</p> */}
                <p>
                  Balance :{" "}
                  {active ? balance + " " + chainIds[chainId]?.symbol : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div style={{ float: "right" }}>
          <a href="/cart">Cart</a>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
