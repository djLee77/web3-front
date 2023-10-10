import { useEffect, useState } from "react";
import StarRating from "../components/StarRating";
import NavBar from "../components/seller/NavBar";
import style from "../css/SellerProduct.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import cookie from "react-cookies";
import { Button, Pagination } from "@mui/material";
import Loading from "../components/Loading";
import reissueAccToken from "../lib/reissueAccToken";
import numberComma from "../lib/numberComma";

export default function SellerProduct() {
    const [productcs, setProducts] = useState([]); // 판매중인 상품 목록
    const [page, setPage] = useState(1); // 페이지
    const [totalPage, setTotalPage] = useState(10); // 전체 페이지
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    const id = cookie.load("id"); // 로그인한 ID
    const navigate = useNavigate();

    //페이지 이동하는 함수
    const handleChange = (e, value) => {
        setPage(value);
        navigate(`/seller/product?page=${value}`);
    };

    // 판매 상품 목록 가져오는 상품
    const getProducts = async () => {
        let isSuccess = false;
        const urlPage = searchParams.get("page");
        const pageNum = urlPage ? parseInt(urlPage) : 1;
        setPage(pageNum);
        try {
            const res = await axios.get(`/api/sellers/items/${id}`, {
                params: {
                    pageNum: page - 1, // 백엔드 페이징은 0부터 시작해서 -1
                    pageSize: 10,
                },
                headers: {
                    Authorization: `Bearer ${cookie.load("accessToken")}`,
                    "ngrok-skip-browser-warning": "1234",
                },
            });

            console.log(res);
            setProducts(res.data.data.items);
            setTotalPage(res.data.totalPage);
            setLoading(false);
            isSuccess = true;
        } catch (error) {
            // 만약 401(인증) 에러가 나면
            if (error.response.status === 401) {
                await reissueAccToken(); // 토큰 재발급 함수 실행
                !isSuccess && getProducts(); // 함수 다시 실행
            }
        }
    };

    // 첫 마운트 될 때 상품 목록 가져오기
    useEffect(() => {
        getProducts();
    }, []);

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
        let isSuccess = false;
        try {
            const res = await axios.delete(`/api/sellers/items/${id}`, {
                headers: {
                    Authorization: `Bearer ${cookie.load("accessToken")}`,
                    "ngrok-skip-browser-warning": "1234",
                },
            });

            console.log("삭제", res);

            if (res.status === 200) {
                getProducts();
                isSuccess = true;
            }
        } catch (error) {
            // 만약 401(인증) 에러가 나면
            if (error.response.status === 401) {
                await reissueAccToken(); // 토큰 재발급 함수 실행
                !isSuccess && onClickDeleteBtn(); // 함수 다시 실행
            }
        }
    };

    return (
        <>
            {loading ? (
                <Loading content="등록 상품 목록을 불러오는 중입니다.." />
            ) : (
                <div className={style.box}>
                    <NavBar />
                    <div className={style.addBtnBox}>
                        <Button variant="contained" onClick={onClickAddBtn}>
                            상품 등록하기
                        </Button>
                    </div>
                    <div>
                        {productcs.map((product, idx) => (
                            <div key={idx} className={style.productBox}>
                                <div className={style.imgBox}>
                                    <img src={product.image1} alt="상품 이미지" width={140} height={140}></img>
                                </div>
                                <div
                                    className={style.infoBox}
                                    onClick={() => {
                                        onClickProduct(product.itemId);
                                    }}
                                >
                                    <span>{product.name}</span>
                                    <span>{numberComma(product.price)}원</span>
                                    <span>남은 수량 {product.stock}개</span>
                                    <span>
                                        <StarRating rate={product.avgRating} size={12} space={2} />
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
                                            window.confirm("정말로 삭제하시겠습니까?") &&
                                                onClickDeleteBtn(product.itemId);
                                        }}
                                    >
                                        삭제
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Pagination count={totalPage} page={page} onChange={handleChange} />
                    </div>
                </div>
            )}
        </>
    );
}
