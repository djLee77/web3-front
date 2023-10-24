import { Box, Button, Modal, TextField } from "@mui/material";
import { useState } from "react";
import reissueAccToken from "../../../lib/reissueAccToken";
import axios from "axios";
import cookie from "react-cookies";

const style = {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    height: 250,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export default function ChangeQuantityModal({ cartId, getCartList, count, stock }) {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const [quantity, setQuantity] = useState(count); // 상품 수량
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // 상품 개수 바꾸는 함수
    const onChangeQuantity = (e) => {
        let value = parseInt(e.target.value);

        if (isNaN(value)) {
            // 숫자가 아닌 경우 1로 설정
            value = 1;
        } else {
            // 숫자인 경우 범위 체크
            value = Math.min(Math.max(1, value), stock === 0 ? 1 : stock);
        }

        setQuantity(value);
    };

    // 상품 수량 변경 함수
    const handleCountChange = async (cartId) => {
        let isSuccess = false;
        try {
            const res = await axios.patch(
                `${serverUrl}/api/users/carts/${cartId}`,
                {
                    quantity: quantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookie.load("accessToken")}`,
                    },
                    credentials: true,
                }
            );

            console.log("수량 변경 : ", res);
            getCartList();
            isSuccess = true;
        } catch (error) {
            // 만약 401(인증) 에러가 나면
            if (error.response.status === 401) {
                await reissueAccToken(); // 토큰 재발급 함수 실행
                !isSuccess && handleCountChange(); // isSuccess가 false면은 장바구니 목록 함수 실행
            }
            console.log("에러:", error);
        }
    };

    return (
        <div>
            <Button onClick={handleOpen}>수량 변경</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h4>변경할 수량</h4>
                    <div>
                        <TextField
                            type="number"
                            inputProps={{
                                maxLength: 2,
                                min: 1,
                                max: 99,
                                style: { width: "40px", height: "24px" },
                            }}
                            value={quantity}
                            id="count_id"
                            size="small"
                            onChange={(e) => {
                                onChangeQuantity(e);
                            }}
                            sx={{ backgroundColor: "white" }}
                        />
                    </div>
                    <div>
                        <Button variant="outlined" onClick={() => handleCountChange(cartId)}>
                            변경
                        </Button>
                        <Button variant="outlined" color="error" onClick={handleClose}>
                            취소
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
