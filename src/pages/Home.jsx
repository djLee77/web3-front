import { useWeb3React } from "@web3-react/core";
import { injected } from "../lib/connectors";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import Card from "../components/product/Card";
import axios from "axios";
import cookie from "react-cookies";
import SlideImg from '../components/SildeImg';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/public/items', {
                    params: {
                        search: "",  // 추후 검색기능 구현시 여기에 검색 키워드 입력
                        sortType: "s",
                        pageNum: 1,
                        pageSize: 5
                    },
                    headers: {
                        "ngrok-skip-browser-warning": "1234",
                    },
                });

                if (response.data.code === 200) {
                    setProducts(response.data.data.items);
                } else {
                    console.error('Error fetching products:', response.data.message);
                }
            } catch (error) {
                console.error('API call error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }
        // 계정 연결 됐으면
        if (account) {
            const key = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_SECRET_KEY);
            const iv = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_SECRET_IV);
            // AES256 암호화 ID 생성
            const encryptedId = CryptoJS.AES.encrypt(account, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            }).toString();

            handleLogin(account, encryptedId); // 로그인 하기

            // 계정에 연결된 네트워크 코인 가져오기
            library?.getBalance(account).then((result) => {
                setBalance(result._hex / 10 ** 18); // 16진수로 보기 힘들게 나와서 바꿔주기
                console.log("result : ", result);
            });
            // TODO : 계정 연결 됐으면 서버에 요청 보내서 식별 ID 받아와야함
        }
    }, [account]);

    const testProductList = {
        code: 200,
        message: "",
        data: {
            items: [
                {
                    itemId: 100111,
                    name: "이쁜 옷1",
                    image1: "image1",
                    price: 100,
                    rate: 3.4,
                    reviewCount: 10,
                    remaining: 9,
                },
                {
                    itemId: 100112,
                    name: "이쁜 옷2",
                    image1: "image1",
                    price: 100,
                    rate: 3.4,
                    reviewCount: 10,
                    remaining: 9,
                },
                {
                    itemId: 100113,
                    name: "이쁜 옷3",
                    image1: "image1",
                    price: 100,
                    rate: 3.4,
                    reviewCount: 10,
                    remaining: 9,
                },
            ],
        },
    };

    return (
        <div className="container">
            <div className="item">
                <SlideImg />
            </div>
            <div className="card-list">
                {products.map((product) => (
                    <Card key={product.itemId} product={product} />
                ))}
            </div>

            <style jsx>{`
                .card-list {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    grid-gap: 20px;
                    width: 960px;
                }
            `}</style>
        </div>
    );
};

export default Home;
