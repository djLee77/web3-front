import { Fab } from "@mui/material";
import style from "../../css/ChatBot.module.css";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useState } from "react";
import Chatbot from "../chatbot/Chatbot";

export default function ChatbotBtn() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <div className={style.btnBox}>
                {!isOpen && (
                    <Fab color="primary" aria-label="chatbot" onClick={() => setIsOpen(!isOpen)}>
                        <SmartToyIcon />
                    </Fab>
                )}
            </div>
            {isOpen && <Chatbot setIsOpen={setIsOpen} isOpen={isOpen} />}
        </>
    );
}
