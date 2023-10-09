import { useState } from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Chatbot from "./chatbot/Chatbot";
import UserRoleModal from "./admin/UserRoleModal";

export default function AdminSpeedDial() {
    const [open, setOpen] = useState(false);
    const [chatbotOpen, setChatbotOpen] = useState(false);
    const [userRoleOpen, setUserRoleOpen] = useState(false);

    const CHATBOT = "챗봇";
    const USER_ROLE = "유저 권한 설정";

    const actions = [
        { icon: <SmartToyIcon />, name: CHATBOT },
        { icon: <ManageAccountsIcon />, name: USER_ROLE },
    ];
    const handleOpen = () => setOpen(true);

    const onClickIcon = (name) => {
        if (name === CHATBOT) {
            setChatbotOpen(true);
        } else if (name === USER_ROLE) {
            setUserRoleOpen(true);
        }
        setOpen(false);
    };

    return (
        <>
            <Box>
                <SpeedDial
                    ariaLabel="SpeedDial controlled open example"
                    sx={{ position: "fixed", bottom: "5%", right: "5%" }}
                    icon={<SpeedDialIcon />}
                    onClose={onClickIcon}
                    onOpen={handleOpen}
                    open={open}
                >
                    {actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={() => onClickIcon(action.name)}
                        />
                    ))}
                </SpeedDial>
            </Box>
            {chatbotOpen && <Chatbot setIsOpen={setChatbotOpen} isOpen={chatbotOpen} />}
            {userRoleOpen && <UserRoleModal setIsOpen={setUserRoleOpen} isOpen={userRoleOpen} />}
        </>
    );
}
