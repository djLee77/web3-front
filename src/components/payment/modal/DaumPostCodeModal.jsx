import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import DaumPostcodeEmbed from "react-daum-postcode";

export default function DaumPostCodeModal({ setZipcode, setRoadAddress }) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    };

    const handleComplete = (data) => {
        console.log("주소 : ", data);
        setZipcode(data.zonecode);
        setRoadAddress(data.roadAddress);
        handleClose();
    };

    const style = {
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600,
        height: 450,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };

    return (
        <div>
            <button onClick={handleOpen}>우편번호 검색</button>
            <Modal
                open={open}
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
