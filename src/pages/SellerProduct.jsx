import StarRating from "../components/StarRating";
import NavBar from "../components/seller/NavBar";
import style from "../css/SellerProduct.module.css";
import { useNavigate, userNavigate } from "react-router-dom";

export default function SellerProduct() {
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
            },
            {
                itemId: 100111,
                name: "이쁜 옷2",
                image1: "image1",
                price: 300,
                rate: 4.5,
                reviewCount: 10,
                stock: 10,
            },
        ],
    };

    const navigate = useNavigate();

    const onClickProduct = (id) => {
        navigate(`/product/detail/${id}`);
    };
    return (
        <div>
            <NavBar />
            <h4>등록 상품 목록</h4>
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
                            <span>수량 : {product.stock}</span>
                            <span>
                                <StarRating rate={product.rate} size={12} space={2} />
                                <span>({product.reviewCount})</span>
                            </span>
                        </div>
                        <div className={style.btnBox}>
                            <button
                                onClick={() => {
                                    console.log("버튼");
                                }}
                            >
                                수정
                            </button>
                            <button>삭제</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
