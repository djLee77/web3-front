import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <div>
            <div>
                <Link to="/seller/product">
                    <span>등록 상품 목록</span>
                </Link>
            </div>
            <div>
                <Link to="/seller/order">
                    <span>주문 관리 목록</span>
                </Link>
            </div>
        </div>
    );
}
