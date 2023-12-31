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
import { Tooltip } from "@mui/material";

const NavBar = () => {
    const serverUrl = process.env.REACT_APP_SERVER_URL;

    /*
    connector: 현재 dapp에 연결된 월렛의 connector 값
    library: web3 provider 제공
    chainId: dapp에 연결된 account의 chainId
    account: dapp에 연결된 account address
    active: dapp 유저가 로그인 된 상태인지 체크
    activate: dapp 월렛 연결 기능 수행함수
    deactivate: dapp 월렛 해제 수행함수
    */

    const { chainId, account, library, active, activate, deactivate } = useWeb3React();
    const [isLogin, setIsLogin] = useState(cookie.load("id")); // 로그인 했는지 확인
    const navigate = useNavigate();

    // 메타마스크 연동 성공시 account 가져옴
    const handleConnect = () => {
        // 만약 이미 연결 돼있으면 연결 해제
        if (isLogin) {
            console.log("로그아웃");
            cookie.remove("accessToken", { path: "/" });
            cookie.remove("refreshToken", { path: "/" });
            cookie.remove("id", { path: "/" });
            cookie.remove("role", { path: "/" });
            cookie.remove("address", { path: "/" });
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
            const res = await axios.post(`${serverUrl}/api/public/login/${id}`, {
                checkId: checkId,
            });

            const mallId = res.data.data.userId; // 쇼핑몰에서 사용할 암호화된 ID

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

            // 토큰에 메타마스크 지갑 계정 저장
            cookie.save("address", account, {
                path: "/",
            });
            console.log(res);
        } catch (error) {
            console.log(error);
        }
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
                    {(cookie.load("role") === "ROLE_ADMIN" || cookie.load("role") === "ROLE_SELLER") && (
                        <div className={style.lilItem}>
                            <a type="button" onClick={() => navigate("/seller/product")}>
                                <Tooltip title="상품 관리" arrow>
                                    <AdminPanelSettingsIcon color="primary" />
                                </Tooltip>
                            </a>
                        </div>
                    )}

                    <div className={style.lilItem}>
                        <a
                            type="button"
                            onClick={() => (isLogin ? navigate("/user/order") : alert("로그인 후 이용해주십시오."))}
                        >
                            <Tooltip title="마이페이지" arrow>
                                <PersonOutlineRoundedIcon color="primary" />
                            </Tooltip>
                        </a>
                    </div>
                    <div className={style.lilItem}>
                        <a
                            type="button"
                            onClick={() => (isLogin ? navigate("/cart") : alert("로그인 후 이용해주십시오."))}
                        >
                            <Tooltip title="장바구니" arrow>
                                <ShoppingCartIcon color="primary" />
                            </Tooltip>
                        </a>
                    </div>
                    <div className={style.lilItem}>
                        <a type="button" onClick={handleConnect}>
                            {isLogin ? "로그아웃" : "로그인"}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
