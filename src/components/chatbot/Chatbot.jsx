import { Avatar, Button, IconButton } from "@mui/material";
import style from "../../css/ChatBot.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client"; // Socket.io 클라이언트 라이브러리를 import합니다.
import { useRef } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SendIcon from "@mui/icons-material/Send";
import ChatBotSVG from "./chatbot.svg";
import SadChatBotSVG from "./sadChatbot.svg";

const chatbotURL = process.env.REACT_APP_CHATBOT_URL;
let socket;

export default function Chatbot({ setIsOpen, isOpen }) {
    const [inputValue, setInputValue] = useState(""); // 질문 입력칸
    const [faqs, setFaqs] = useState([]); // FAQ 목록
    const [messages, setMessages] = useState([]); // 채팅 목록 저장
    const [loading, setLoading] = useState(false); // 대답 할 때까지 로딩
    const [selectedImage, setSelectedImage] = useState(""); // 클릭한 이미지
    const [open, setOpen] = useState(false); // 이미지 크게 보기 위한 모달 창 열기
    const handleOpen = (image) => {
        setSelectedImage(image);
        setOpen(true);
    };
    // 모달창 열기
    const handleClose = () => setOpen(false); // 모달창 닫기

    const faqRef = useRef(null);
    const messageRef = useRef(null);

    //모달 스타일
    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600,
        bgcolor: "background.paper",
        border: "1px solid #000",
        p: 4,
        zIndex: 100,
    };

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

    // faq 질문 클릭했을때
    const onClickQuestion = (question) => {
        // 질문 전송
        socket.emit("faq-question", question);
        const message = {
            message: question,
            isBot: false,
        };
        setMessages([...messages, message]); // 유저가 선택한 질문 메세지에 저장
    };

    // 최상단으로 가는 버튼
    const onClickUpScroll = () => {
        console.log("클릭");
        faqRef.current?.scrollIntoView({ behavior: "smooth" }); // 부드럽게 해당 위치로 이동
    };

    // 첫 마운트 됐을때
    useEffect(() => {
        // 소켓 연결
        socket = io(`${chatbotURL}`);

        fetchQuestions(); // faq 가져오기

        // 챗봇 처음 인삿말
        socket.on("message", (greeting) => {
            const message = {
                message: greeting,
                isBot: true,
            };
            console.log("greeting : ", greeting);
            setMessages((prevMessages) => [...prevMessages, message]); // 챗봇이 말한거 메세지에 저장
        });

        // 질문에 대한 대답
        socket.on("response", (data) => {
            const message = {
                message: data.response.kwargs.content,
                isBot: true,
            };
            setMessages((prevMessages) => [...prevMessages, message]); //  챗봇 대답 메세지에 저장
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
            console.log("faq 대답 : ", data);
            setMessages((prevMessages) => [...prevMessages, message]); // 챗봇이 말한거 메세지에 저장
        });

        // 에러
        socket.on("error", (data) => {
            const message = {
                message: "죄송합니다. 질문에 대한 정보가 없습니다.",
                isBot: true,
            };
            setMessages((prevMessages) => [...prevMessages, message]); // 챗봇이 말한거 메세지에 저장
            setLoading(false);
            console.error(data);
        });

        //언마운트 될 때 소켓 연결 해제
        return () => {
            socket.disconnect();
        };
    }, []);

    // 메세지 배열 업데이트 될때마다 스크롤 아래로 이동
    useEffect(() => {
        messageRef.current?.scrollIntoView({ behavior: "smooth" }); // 부드럽게 해당 위치로 이동
    }, [messages]);

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
                    {faqs?.map((item, idx) => (
                        <div key={idx} className={style.faq} onClick={() => onClickQuestion(item.question)}>
                            {item.question}
                        </div>
                    ))}
                </div>
                <div className={style.messageBox}>
                    {messages.map((item, idx) => (
                        <div key={idx}>
                            <div className={style.message}>
                                {item.isBot && (
                                    <img
                                        className={style.botProfile}
                                        src={item.message.includes("죄송") ? SadChatBotSVG : ChatBotSVG}
                                        alt="ChatBot"
                                        width={38}
                                        height={38}
                                    />
                                )}
                                <div className={item.isBot ? style.botMessage : style.userMessage} ref={messageRef}>
                                    {item.message}
                                </div>
                            </div>
                            {item.images && (
                                <div className={style.imageBox}>
                                    {item.images?.map((image, idx) => (
                                        <img
                                            key={idx}
                                            src={image}
                                            onClick={() => handleOpen(image)}
                                            width={180}
                                            height={180}
                                        ></img>
                                    ))}
                                    <Modal open={open} onClose={handleClose}>
                                        <Box sx={modalStyle}>
                                            <img src={selectedImage} alt="FAQ 이미지" width={500} height={500}></img>
                                        </Box>
                                    </Modal>
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && <img src="/imgs/Walk.gif" width={80} height={80} className={style.loadingImg} />}
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
                    placeholder="제품에 관해 궁금한 점들을 물어보세요!"
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
