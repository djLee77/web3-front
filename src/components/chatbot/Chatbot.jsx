import { IconButton } from "@mui/material";
import style from "../../css/ChatBot.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import Message from "./Message";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Chatbot({ setIsOpen, isOpen }) {
    const [messageList, setMessageList] = useState([]); // 메시지 리스트 배열
    const [message, setMessage] = useState("");
    const [result, setResult] = useState([]);

    useEffect(() => {
        const source = new EventSource("/donggun");

        source.onmessage = function (event) {
            // 결과를 화면에 표시하거나 상태(state)를 업데이트하는 등의 작업 수행
            // 예: setResults(results => [...results, event.data]);
            console.log("Received data:", event.data);
            setResult((result) => [...result, event.data]);
        };

        // 컴포넌트가 언마운트될 때 EventSource 정리(clean-up)
        return () => {
            source.close();
        };
    }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행

    // gpt 테스트
    const onSendTest = async () => {
        console.log("message : ", message);
        setMessage("");
        try {
            const res = await axios.post(
                "/message",
                { message },
                {
                    headers: {
                        "ngrok-skip-browser-warning": "1234",
                    },
                }
            );
            console.log("res : ", res);
        } catch (error) {
            console.log("에러 : ", error);
        }
    };
    return (
        <div className={style.box}>
            <div className={style.header}>
                <h4>Chat Bot!</h4>
                <IconButton aria-label="delete" onClick={() => setIsOpen(!isOpen)}>
                    <ClearIcon />
                </IconButton>
            </div>
            <div className={style.contentBox}>
                <Message />
                {result}
            </div>
            <div className={style.inputBox}>
                <input
                    type="text"
                    placeholder="무엇이든 물어보세요"
                    onChange={(e) => setMessage(e.target.value)}
                ></input>
                <button onClick={onSendTest}>보내기</button>
            </div>
        </div>
    );
}
