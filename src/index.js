import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

// web3 react 설치할 때 npm install @web3-react/core@6.1.9로 버전 낮춰야함 현재 버전(8)은 베타 버전이라 자료가 거의 없음

// web3-react가 사용할 web3 provider를 제공하는 역할
const getLibrary = (provider) => {
    console.log("[getLibrary] provider", provider);
    return new Web3Provider(provider);
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <Web3ReactProvider getLibrary={getLibrary}>
        <App />
    </Web3ReactProvider>
);
