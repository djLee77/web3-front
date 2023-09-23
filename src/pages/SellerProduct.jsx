import { useEffect, useState } from "react";
import StarRating from "../components/StarRating";
import NavBar from "../components/seller/NavBar";
import style from "../css/SellerProduct.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import cookie from "react-cookies";
import { Button } from "@mui/material";

export default function SellerProduct() {
    const [productcs, setPproducts] = useState([]); // 판매중인 상품 목록
    const id = cookie.load("id"); // 사용자 ID

    // 판매 상품 목록 가져오는 상품
    const getProducts = async () => {
        try {
            const res = await axios.get(`/api/sellers/items/${id}`, {
                headers: {
                    Authorization: `Bearer ${cookie.load("accessToken")}`,
                    "ngrok-skip-browser-warning": "1234",
                },
            });

            console.log(res);

            setPproducts(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    // 첫 마운트 될 때 상품 목록 가져오기
    useEffect(() => {
        getProducts();
    }, []);

    const navigate = useNavigate();

    // 상품 등록 버튼 함수
    const onClickAddBtn = () => {
        navigate("/product/add");
    };

    // 상품 클릭하면 상세 페이지로 가는 함수
    const onClickProduct = (id) => {
        navigate(`/product/detail/${id}`);
    };

    // 상품 수정 버튼 함수
    const onClickModifyBtn = (id) => {
        navigate(`/product/add?id=${id}`);
    };

    // 상품 삭제 버튼 함수
    const onClickDeleteBtn = async (id) => {
        try {
            const res = await axios.delete(`/api/sellsers/items/${id}`, {
                headers: {
                    Authorization: `Bearer ${cookie.load("accessToken")}`,
                    "ngrok-skip-browser-warning": "1234",
                },
            });

            if (res.status === 200) {
                getProducts();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const data = {
        items: [
            {
                itemId: 100110,
                name: "이쁜 옷",
                image1: "image1",
                price: 100,
                rate: 3.4,
                reviewCount: 10,
                stock: 9,
                sellCnt: 10,
            },
            {
                itemId: 100111,
                name: "이쁜 옷2",
                image1: "image1",
                price: 300,
                rate: 4.5,
                reviewCount: 10,
                stock: 10,
                sellCnt: 10,
            },
        ],
    };

    return (
        <div className={style.box}>
            <NavBar />
            <div className={style.addBtnBox}>
                <Button variant="contained" onClick={onClickAddBtn}>
                    상품 등록하기
                </Button>
            </div>
            <div>
                {data.items.map((product) => (
                    <div className={style.productBox}>
                        <div className={style.imgBox}>
                            <img src="" alt="상품 이미지"></img>
                        </div>
                        <div
                            className={style.infoBox}
                            onClick={() => {
                                onClickProduct(product.itemId);
                            }}
                        >
                            <span>{product.name}</span>
                            <span>{product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</span>
                            <span>남은 수량 : {product.stock}</span>
                            <span>
                                <StarRating rate={product.rate} size={12} space={2} />
                                <span>({product.reviewCount})</span>
                            </span>
                        </div>
                        <div className={style.btnBox}>
                            <Button
                                variant="outlined"
                                onClick={() => onClickModifyBtn(product.itemId)}
                                sx={{ marginRight: "10px" }}
                            >
                                수정
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => {
                                    window.confirm("정말로 삭제하시겠습니까?") && onClickDeleteBtn(product.itemId);
                                }}
                            >
                                삭제
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
