import { Tooltip } from "@mui/material";
import style from "../../css/ChatBot.module.css";
import { useState } from "react";
import Chatbot from "../chatbot/Chatbot";
import ChatBotSVG from "../chatbot/chatbot.svg";

export default function ChatbotBtn() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className={style.btnBox}>
                {!isOpen && (
                    <Tooltip title="챗봇" arrow>
                        <img width={48} height={48} src={ChatBotSVG} onClick={() => setIsOpen(!isOpen)} />
                    </Tooltip>
                )}
            </div>
            {isOpen && <Chatbot setIsOpen={setIsOpen} isOpen={isOpen} />}
        </>
    );
}
