import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import DaumPostcodeEmbed from "react-daum-postcode";

export default function DaumPostCodeModal({ modalOpen, setModalOpen, setZipcode, setRoadAddress }) {
    const handleOpen = () => setModalOpen(true);
    const handleClose = () => {
        setModalOpen(false);
    };

    // 주소 클릭시 우편번호, 도로명 저장 함수
    const handleComplete = (data) => {
        console.log("주소 : ", data);
        setZipcode(data.zonecode);
        setRoadAddress(data.roadAddress);
        handleClose();
    };

    // 모달 창 스타일
    const style = {
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600,
        height: 500,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };

    return (
        <div>
            <Button variant="contained" sx={{ marginRight: "20px" }} onClick={handleOpen}>
                우편번호 검색
            </Button>
            <Modal
                open={modalOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <DaumPostcodeEmbed onComplete={handleComplete} />
                </Box>
            </Modal>
        </div>
    );
}
