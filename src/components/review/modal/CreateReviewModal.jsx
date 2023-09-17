import { Box, Button, Modal, TextField } from "@mui/material";
import axios from "axios";
import { useRef, useState } from "react";
import StarRatings from "react-star-ratings";

export default function CreateReviewModal({ product }) {
    const [open, setOpen] = useState(false);
    const [rate, setRate] = useState(1); // 별점
    const [imgURL, setImgURL] = useState("/imgs/defaultAddImg.png"); // 이미지
    const [content, setContent] = useState(""); // 내용
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const imgRef = useRef(null); // 이미지 인풋 ref
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };

    // 별점 변경 함수
    const handleRatingChange = (newRating) => {
        setRate(newRating); // rating 업데이트
    };

    // 이미지 업로드 버튼 함수
    const onClickImgBtn = (idx) => {
        imgRef.current.click();
    };

    // 이미지 업로드 함수
    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file); // 폼 데이터에 저장
            console.log("imgFile : ", file);
            try {
                const res = await axios.post("/server/api/uploads/images", formData);
                setImgURL(res.data);
            } catch (error) {
                console.log(error);
            }
        }
    };

    // 리뷰 작성 버튼 함수
    const onClickCreateReviewBtn = async () => {
        try {
            const res = await axios.post("/api/users/reviews", {
                itemId: product.itemId,
                userId: "userId",
                content: content,
                rate: rate,
                image: imgURL,
            });

            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Button onClick={handleOpen}>리뷰 작성하기</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h4>리뷰 작성</h4>
                    <div>
                        <span>구매 상품</span>
                        <div>
                            <img src={product.img} alt="상품 이미지" />
                            <span>{product.name}</span>
                        </div>
                        <hr />
                    </div>
                    <div>
                        <span>상품 평가</span>
                        <StarRatings
                            rating={rate} // 현재 별점 값
                            starRatedColor="#FFB800" // 별점 색상 설정
                            changeRating={handleRatingChange}
                            numberOfStars={5} // 별점의 총 개수 설정
                            name="rating" // 이름 설정
                            starDimension="24px" // 별 크기
                            starSpacing="2px" // 별들의 간격
                            //뚠뚠이 귀여운 별 svg
                            svgIconPath="M5.35626 0.399536L3.89159 3.36925L0.614589 3.84701C0.0269265 3.93224 -0.208587 4.65673 0.21758 5.07168L2.58842 7.38195L2.02767 10.6455C1.92674 11.2354 2.54804 11.6773 3.06842 11.4014L6 9.86045L8.93159 11.4014C9.45196 11.675 10.0733 11.2354 9.97233 10.6455L9.41158 7.38195L11.7824 5.07168C12.2086 4.65673 11.9731 3.93224 11.3854 3.84701L8.10841 3.36925L6.64374 0.399536C6.38131 -0.129809 5.62094 -0.136538 5.35626 0.399536Z"
                            svgIconViewBox="0 0 12 12"
                        />
                        <span>{rate}점</span>
                        <hr />
                    </div>
                    <div>
                        <span>사진 등록</span>
                        <input
                            type="file"
                            style={{ display: "none" }}
                            ref={imgRef}
                            onChange={(e) => handleImageUpload(e)}
                        />
                        <button className={style.imgBtn} type="button" onClick={() => onClickImgBtn()}>
                            <img src={imgURL} width={100} height={100} alt="이미지" />
                        </button>
                        <hr />
                    </div>
                    <div>
                        <span>내용</span>
                        <TextField
                            id="outlined-multiline-static"
                            multiline
                            rows={4}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div>
                        <Button onClick={onClickCreateReviewBtn}>작성</Button>
                        <Button onClick={() => setOpen(false)}>취소</Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
