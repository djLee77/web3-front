import "./App.css";
import NavBar from "./components/NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductForm from "./pages/ProductForm";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import ChatbotBtn from "./components/fab/chatbotBtn";
import Payment from "./pages/Payment";
import UserOrder from "./pages/UserOrder";
import UserReview from "./pages/UserReview";
import SellerProduct from "./pages/SellerProduct";
import SellerOrder from "./pages/SellerOrder";
import SearchResult from "./pages/SearchResult";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <NavBar />
                <ChatbotBtn />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/product/add" element={<ProductForm />} />
                    <Route path="/product/detail/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/user/order" element={<UserOrder />} />
                    <Route path="/user/review" element={<UserReview />} />
                    <Route path="/seller/product" element={<SellerProduct />} />
                    <Route path="/seller/order" element={<SellerOrder />} />
                    <Route path="/search-result" element={<SearchResult />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
