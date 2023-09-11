import { IconButton } from "@mui/material";
import style from "../../css/ChatBot.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import Message from "./Message";
import { useState } from "react";

export default function Chatbot({ setIsOpen, isOpen }) {
    const [messageList, setMessageList] = useState([]); // 메시지 리스트 배열
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
                <input type="text" placeholder="무엇이든 물어보세요"></input>
                <button>보내기</button>
            </div>
        </div>
    );
}
