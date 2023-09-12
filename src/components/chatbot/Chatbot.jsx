import { IconButton } from "@mui/material";
import style from "../../css/ChatBot.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import Message from "./Message";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Chatbot({ setIsOpen, isOpen }) {
    const [messageList, setMessageList] = useState([]); // 메시지 리스트 배열
    const [inputMessage, setInputMessage] = useState("");
    const [result, setResult] = useState([]);

    // gpt 테스트
    const sendMessage = async () => {
        try {
            // const res = await axios.post(
            //     "/message",
            //     { message: inputMessage },
            //     {
            //         headers: {
            //             "Content-Type": "application/json",
            //         },
            //     }
            // );
            const res = await fetch("/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: inputMessage }),
            });

            if (res.ok) {
                const eventSource = new EventSource("/message");
                eventSource.onmessage = function (event) {
                    if (event.data === "[DONE]") {
                        eventSource.close(); // 연결 종료
                    } else {
                        setResult((prevText) => prevText + event.data);
                    }
                };
            } else {
                console.error("Failed to send message");
            }
        } catch (error) {
            console.error("Error:", error);
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
                <span>{result}</span>
            </div>
            <div className={style.inputBox}>
                <input
                    type="text"
                    placeholder="무엇이든 물어보세요"
                    onChange={(e) => setInputMessage(e.target.value)}
                ></input>
                <button onClick={sendMessage}>보내기</button>
            </div>
        </div>
    );
}
