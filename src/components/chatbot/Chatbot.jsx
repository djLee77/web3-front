import { IconButton } from "@mui/material";
import style from "../../css/ChatBot.module.css";
import ClearIcon from "@mui/icons-material/Clear";

export default function Chatbot({ setIsOpen, isOpen }) {
    return (
        <div className={style.box}>
            <div className={style.header}>
                <h4>Chat Bot!</h4>
                <IconButton aria-label="delete" onClick={() => setIsOpen(!isOpen)}>
                    <ClearIcon />
                </IconButton>
            </div>
            <div className={style.contentBox}>
                <span>채팅 내용 보여줄 예정</span>
            </div>
            <div className={style.inputBox}>
                <input type="text" placeholder="무엇이든 물어보세요"></input>
                <button>보내기</button>
            </div>
        </div>
    );
}
