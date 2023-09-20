import { Link } from "react-router-dom";

export default function NavBar() {
    return (
        <div>
            <div>
                <Link to="/user/order">
                    <span>주문 상품 목록</span>
                </Link>
            </div>
            <div>
                <Link to="/user/review">
                    <span>작성한 리뷰 목록</span>
                </Link>
            </div>
        </div>
    );
}
