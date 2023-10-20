import { Avatar, Button, IconButton } from "@mui/material";
import style from "../../css/ChatBot.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client"; // Socket.io 클라이언트 라이브러리를 import합니다.
import { useRef } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SendIcon from "@mui/icons-material/Send";

const chatbotURL = process.env.REACT_APP_CHATBOT_URL;

const socket = io(`${chatbotURL}/`);

export default function Chatbot({ setIsOpen, isOpen }) {
    const [inputValue, setInputValue] = useState(""); // 질문 입력칸
    const [faqs, setFaqs] = useState([]); // FAQ 목록
    const [messages, setMessages] = useState([]); // 채팅 목록 저장
    const [loading, setLoading] = useState(false); // 대답 할 때까지 로딩

    const faqRef = useRef(null);
    const messageRef = useRef(null);

    // FAQ 목록 가져오기
    const fetchQuestions = async () => {
        try {
            const response = await axios.get(`${chatbotURL}/faq/question`);
            setFaqs(response.data.questions);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    // 입력한 메시지 보내기
    const handleSubmit = () => {
        // 아무것도 안쓰면 보내지 않기
        if (inputValue.trim() === "") {
            return;
        }
        socket.emit("message", inputValue);
        setLoading(true); // 메시지 보내기 전에 로딩 상태를 true로 설정
        setInputValue(""); // 보냈으면 입력창 초기화

        const message = {
            message: inputValue,
            isBot: false,
        };
        setMessages([...messages, message]); //  유저가 질문한 내용 메세지에 저장
    };

    // 엔터 누르면 메시지 보내기
    const handleOnKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit(); // Enter 입력이 되면 클릭 이벤트 실행
        }
    };

    useEffect(() => {
        // 질문에 대한 대답
        socket.on("response", (data) => {
            const message = {
                message: data.response.kwargs.content,
                isBot: true,
            };
            setMessages([...messages, message]); //  챗봇 대답 메세지에 저장
            console.log("대답왔음!", data);
            setLoading(false);
        });

        // faq에 대한 대답
        socket.on("faq-answer", (data) => {
            const message = {
                message: data.answer,
                images: data.images,
                isBot: true,
            };
            console.log(data.images);
            setMessages([...messages, message]); // 챗봇이 말한거 메세지에 저장
        });

        // 에러
        socket.on("error", (data) => {
            const message = {
                message: data.error,
                isBot: true,
            };
            setMessages([...messages, message]); // 챗봇이 말한거 메세지에 저장
            setLoading(false);
            console.error(data);
        });

        messageRef.current?.scrollIntoView({ behavior: "smooth" }); // 부드럽게 해당 위치로 이동
    }, [messages]);

    // 첫 마운트 됐을때
    useEffect(() => {
        socket.on("connect", () => {
            console.log("connected to server");
        });

        fetchQuestions(); // faq 가져오기
    }, []);

    // faq 질문 클릭했을때
    const onClickQuestion = (question) => {
        socket.emit("faq-question", question);
        const message = {
            message: question,
            isBot: false,
        };
        setMessages([...messages, message]); // 유저가 선택한 질문 메세지에 저장
    };

    const onClickUpScroll = () => {
        console.log("클릭");
        faqRef.current?.scrollIntoView({ behavior: "smooth" }); // 부드럽게 해당 위치로 이동
    };

    return (
        <div className={style.box}>
            <div className={style.header}>
                <h4>Chat Bot </h4>
                <IconButton aria-label="delete" onClick={() => setIsOpen(!isOpen)}>
                    <ClearIcon />
                </IconButton>
            </div>
            <div className={style.contentBox}>
                <div className={style.faqBox} ref={faqRef}>
                    {faqs.map((item, idx) => (
                        <div key={idx} className={style.faq} onClick={() => onClickQuestion(item.question)}>
                            {item.question}
                        </div>
                    ))}
                </div>
                <div className={style.messageBox}>
                    {messages.map((item, idx) => (
                        <>
                            <div key={idx} style={{ display: "flex", marginLeft: "10px" }}>
                                {item.isBot && <Avatar alt="ChatBot" />}
                                <div className={item.isBot ? style.botMessage : style.userMessage} ref={messageRef}>
                                    {item.message}
                                </div>
                            </div>
                            {item.images && (
                                <div className={style.imageBox}>
                                    {item.images?.map((image, idx) => (
                                        <img src={image} key={idx} width={180} height={180}></img>
                                    ))}
                                </div>
                            )}
                        </>
                    ))}
                    {loading && <img src="./imgs/Walk.gif" width={80} height={80} className={style.loadingImg} />}
                </div>

                <div className={style.upScroll} onClick={onClickUpScroll}>
                    <IconButton aria-label="delete" size="large">
                        <KeyboardArrowUpIcon fontSize="inherit" />
                    </IconButton>
                </div>
            </div>
            <div className={style.inputBox}>
                <input
                    type="text"
                    placeholder="무엇이든 물어보세요"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleOnKeyPress}
                ></input>
                <Button size="small" onClick={handleSubmit}>
                    <SendIcon fontSize="small" />
                </Button>
            </div>
        </div>
    );
}
