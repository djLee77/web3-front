import axios from "axios";
import cookie from "react-cookies";

const reissueAccToken = async () => {
    const response = await axios.get("/api/users/refresh", {
        headers: {
            Authorization: `Bearer ${cookie.load("refreshToken")}`,
            "ngrok-skip-browser-warning": "1234",
        },
    });

    cookie.save("accessToken", response.data.data.accessToken, {
        path: "/",
        secure: true,
    });

    cookie.save("refreshToken", response.data.data.refreshToken, {
        path: "/",
        secure: true,
    });

    console.log("토큰 재발급 완료!!");
};

export default reissueAccToken;
