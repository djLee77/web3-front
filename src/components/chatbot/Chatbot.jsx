import { IconButton } from "@mui/material";
import style from "../../css/ChatBot.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import Message from "./Message";
import { useState } from "react";
import axios from "axios";

export default function Chatbot({ setIsOpen, isOpen }) {
    const [messageList, setMessageList] = useState([]); // 메시지 리스트 배열
    const [message, setMessage] = useState("");

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
            const sse = new EventSource(`/message`, { message });
            sse.onmessage = function (event) {
                console.log(event.data);
            };
            console.log("sse : ", sse);
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
