import { Box, Button, MenuItem, Modal, Select, TextField } from "@mui/material";
import axios from "axios";
import { useRef, useState } from "react";
import cookie from "react-cookies";
import reissueAccToken from "../../lib/reissueAccToken";

export default function UserRoleModal({ setIsOpen, isOpen }) {
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const ROLE_ADMIN = "ROLE_ADMIN";
  const ROLE_SELLER = "ROLE_SELLER";
  const ROLE_USER = "ROLE_USER";

  const [userId, setUserId] = useState(""); // 유저 아이디
  const [isInput, setIsInput] = useState(false); // 유저 아이디 넣었는지
  const [role, setRole] = useState(ROLE_ADMIN); // 권한

  const userIdRef = useRef();

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const onClickRoleBtn = async () => {
    let isSuccess = false;
    console.log(userId, role);

    if (!userId) {
      userIdRef.current.focus();
      return setIsInput(true);
    }

    try {
      const res = await axios.patch(
        `${serverUrl}/api/admin/users/${userId}`,
        {
          role: role,
        },
        {
          headers: {
            Authorization: `Bearer ${cookie.load("accessToken")}`,
          },
        }
      );

      console.log(res);
      alert(userId + "님을 " + role + "로 변경하였습니다.");
      isSuccess = true;
    } catch (error) {
      console.log(error);
      // 만약 401(인증) 에러가 나면
      if (error.response.status === 401) {
        await reissueAccToken(); // 토큰 재발급 함수 실행
        !isSuccess && onClickRoleBtn(); // 함수 다시 실행
      }
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 420,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <h4>유저 권한 설정</h4>
        <hr />
        <div>
          <TextField
            size="small"
            placeholder="사용자 ID 입력"
            error={isInput}
            helperText={isInput && "사용자 ID 입력해주세요"}
            value={userId}
            inputRef={userIdRef}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={role}
            label="Age"
            onChange={handleChange}
            sx={{ height: "40px", marginLeft: "10px" }}
          >
            <MenuItem value={ROLE_ADMIN}>어드민</MenuItem>
            <MenuItem value={ROLE_SELLER}>판매자</MenuItem>
            <MenuItem value={ROLE_USER}>일반 유저</MenuItem>
          </Select>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "60px",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => onClickRoleBtn()}
            sx={{ marginRight: "10px" }}
          >
            변경
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setIsOpen(false)}
          >
            닫기
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
