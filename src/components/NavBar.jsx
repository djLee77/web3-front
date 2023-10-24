import React from "react";
import ToggleMenu from "./ToggleMenu";
import style from "../css/NavBar.module.css";
import SearchBar from "../components/SearchBar";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../lib/connectors";
import { useEffect, useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CryptoJS from "crypto-js";
import cookie from "react-cookies";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const NavBar = () => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;
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

  const [balance, setBalance] = useState("");
  const { chainId, account, library, active, activate, deactivate } =
    useWeb3React();
  const [isLogin, setIsLogin] = useState(cookie.load("id")); // 로그인 했는지 확인
  const navigate = useNavigate();

  const handleConnect = () => {
    // 만약 이미 연결 돼있으면 연결 해제
    if (isLogin) {
      console.log("로그아웃");
      cookie.remove("accessToken", { path: "/" });
      cookie.remove("refreshToken", { path: "/" });
      cookie.remove("id", { path: "/" });
      cookie.remove("role", { path: "/" });
      setIsLogin(false);
      deactivate();
      return;
    }

    // 메타마스크 계정 연결
    activate(injected, (error) => {
      // 크롬 익스텐션 없을 경우 오류 핸들링
      if ("/No Ethereum provider was found on window.ethereum/".test(error)) {
        window.open("https://metamask.io/download.html");
      }
    });
  };

  const handleLogin = async (id, checkId) => {
    console.log("계정 : ", id, checkId);
    try {
      const res = await axios.post(
        `${serverUrl}/api/public/login/${id}`,
        {
          checkId: checkId,
        },
      );

      const mallId = res.data.data.userId; // 쇼핑몰에서 사용할 ID

      // 쿠키에 액세스 토큰 저장
      cookie.save("accessToken", res.data.data.accessToken, {
        path: "/",
      });

      // 쿠키에 리프레쉬 토큰 저장
      cookie.save("refreshToken", res.data.data.refreshToken, {
        path: "/",
      });

      const role = jwt_decode(res.data.data.refreshToken).roles;
      // 유저 권한 저장
      cookie.save("role", role);

      // 토큰에 쇼핑몰 ID 저장
      cookie.save("id", mallId, {
        path: "/",
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const OnClickAlert = () => {
    alert("로그인 후 이용해주십시오.");
  };

  const OnClickLink = (url) => {
    navigate(url);
  };

  // 계정 연결 됐으면
  useEffect(() => {
    if (account) {
      const key = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_SECRET_KEY);
      const iv = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_SECRET_IV);
      // AES256 암호화 ID 생성
      const encryptedId = CryptoJS.AES.encrypt(account, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();

      handleLogin(account, encryptedId); // 로그인 하기

      // 계정에 연결된 네트워크 코인 가져오기
      library?.getBalance(account).then((result) => {
        setBalance(result._hex / 10 ** 18); // 16진수로 보기 힘들게 나와서 바꿔주기
        console.log("result : ", result);
      });

      setIsLogin(true);
    }
  }, [account]);

  return (
    <div className={style.containerBg}>
      <div className={style.hamburger}>
        <ToggleMenu />
      </div>
      <div className={style.container}>
        <div className={style.item}>
          <a type="button" onClick={() => navigate("/")}>
            <img src="/imgs/logo4.png" style={{ width: "150px" }}></img>
          </a>
        </div>
        <div className={style.item}>
          <SearchBar />
        </div>
        <div className={style.item}>
          <div className={style.lilItem}>
            {cookie.load("role") == "ROLE_ADMIN" ||
            cookie.load("role" == "ROLE_SELLER") ? (
              <a type="button" onClick={() => navigate("/seller/order")}>
                <AdminPanelSettingsIcon color="primary" />
              </a>
            ) : (
              <a></a>
            )}
          </div>
          <div className={style.lilItem}>
            {cookie.load("refreshToken") ? (
              <a type="button" onClick={() => navigate("/user/order")}>
                <PersonOutlineRoundedIcon color="primary" />
              </a>
            ) : (
              <a type="button" onClick={OnClickAlert}>
                <PersonOutlineRoundedIcon color="primary" />
              </a>
            )}
          </div>
          <div className={style.lilItem}>
            {cookie.load("refreshToken") ? (
              <a type="button" onClick={() => navigate("/cart")}>
                <ShoppingCartIcon color="primary" />
              </a>
            ) : (
              <a type="button" onClick={OnClickAlert}>
                <ShoppingCartIcon color="primary" />
              </a>
            )}
          </div>
          <div className={style.lilItem}>
            <a type="button" onClick={handleConnect}>
              {cookie.load("refreshToken") ? "로그아웃" : "로그인"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
