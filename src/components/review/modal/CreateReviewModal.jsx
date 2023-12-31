import { Box, Button, Modal, TextField } from "@mui/material";
import axios from "axios";
import { useRef, useState } from "react";
import StarRatings from "react-star-ratings";
import cookie from "react-cookies";
import style from "../../../css/ReviewModal.module.css";
import reissueAccToken from "../../../lib/reissueAccToken";

export default function CreateReviewModal({ product, getMyReviews }) {
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const [open, setOpen] = useState(false);
  const [rate, setRate] = useState(5); // 별점
  const [imgURL, setImgURL] = useState("/imgs/defaultAddImg.png"); // 이미지
  const [content, setContent] = useState(""); // 내용
  const [isContentInput, setIsContentInput] = useState(false); // 내용 입력했는지 확인

  const contentRef = useRef();
  const id = cookie.load("id");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const imgRef = useRef(null); // 이미지 인풋 ref
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 480,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 3,
  };

  // 별점 변경 함수
  const handleRatingChange = (newRating) => {
    setRate(newRating); // rating 업데이트
  };

  // 이미지 업로드 버튼 함수
  const onClickImgBtn = () => {
    imgRef.current.click();
  };

  // 이미지 업로드 함수
  const handleImageUpload = async (event) => {
    let isSuccess = false;
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file); // 폼 데이터에 저장
      console.log("imgFile : ", file);
      try {
        const res = await axios.post(
          `${serverUrl}/api/users/uploads/images`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${cookie.load("accessToken")}`,
            },
          }
        );
        setImgURL(res.data.data);
        isSuccess = true;
      } catch (error) {
        // 만약 401(인증) 에러가 나면
        if (error.response.status === 401) {
          await reissueAccToken(); // 토큰 재발급 함수 실행
          !isSuccess && handleImageUpload(event); // 함수 다시 실행
        }
      }
    }
  };

  // 리뷰 작성 버튼 함수
  const onClickCreateReviewBtn = async () => {
    let isSuccess = false;

    // 내용 작성 안 했으면 작성하라고 하기
    if (content === "") {
      contentRef.current.focus();
      return setIsContentInput(true);
    }

    try {
      const res = await axios.post(
        `${serverUrl}/api/users/reviews/${id}`,
        {
          itemId: product.itemId,
          content: content,
          rate: rate,
          image: imgURL,
        },
        {
          headers: {
            Authorization: `Bearer ${cookie.load("accessToken")}`,
          },
        }
      );

      console.log(res);

      if (res.data.code === 201) {
        alert("리뷰 작성 완료!");
        getMyReviews();
        setOpen(false);
        isSuccess = true;
      }
    } catch (error) {
      // 만약 401(인증) 에러가 나면
      if (error.response.status === 401) {
        await reissueAccToken(); // 토큰 재발급 함수 실행
        !isSuccess && onClickCreateReviewBtn(); // 함수 다시 실행
      }
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        리뷰 작성하기
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <span className={style.label}>구매 상품</span>
          <div className={style.productBox}>
            <img
              src={product.image}
              alt="상품 이미지"
              width={100}
              height={100}
            />
            <span>{product.itemName}</span>
          </div>
          <hr />
          <span className={style.label}>별을 클릭하여 별점을 남기세요!</span>
          <div className={style.rateBox}>
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
          </div>
          <hr />
          <span className={style.label}>
            예쁘게 찍은 리뷰 사진을 등록해보세요!
          </span>
          <div className={style.imgBox}>
            <input
              type="file"
              style={{ display: "none" }}
              ref={imgRef}
              onChange={(e) => handleImageUpload(e)}
            />
            <button
              className={style.imgBtn}
              type="button"
              onClick={() => onClickImgBtn()}
            >
              <img src={imgURL} width={100} height={100} alt="이미지" />
            </button>
          </div>
          <hr />
          <span className={style.label}>상품 평가 내용을 작성해보세요!</span>
          <TextField
            id="outlined-multiline-static"
            error={isContentInput}
            helperText={isContentInput && "리뷰 내용을 작성해주세요"}
            inputRef={contentRef}
            multiline
            rows={3}
            onChange={(e) => setContent(e.target.value)}
            sx={{ width: "100%" }}
          />

          <div className={style.btnBox}>
            <Button
              variant="outlined"
              onClick={onClickCreateReviewBtn}
              sx={{ marginRight: "14px" }}
            >
              작성
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpen(false)}
            >
              취소
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
