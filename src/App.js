import "./App.css";
import NavBar from "./components/NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductForm from "./pages/ProductForm";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import ChatbotBtn from "./components/fab/chatbotBtn";
import SearchResult from "./pages/SearchResult";
import CategoryResult from "./pages/CategoryResult";
import Payment from "./pages/Payment";
import UserOrder from "./pages/UserOrder";
import UserReview from "./pages/UserReview";
import SellerProduct from "./pages/SellerProduct";
import SellerOrder from "./pages/SellerOrder";
import Admin from "./pages/Admin";
import cookie from "react-cookies";
import AdminSpeedDial from "./components/AdminSpeedDial";
import { useEffect, useState } from "react";
import TestSend from "./pages/TestSend";

const ROLE_ADMIN = "ROLE_ADMIN";

function App() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (cookie.load("role") === ROLE_ADMIN) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 1) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        console.log(scrolled);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [scrolled]);

    return (
        <BrowserRouter>
            <div className="App">
                <div className={scrolled ? "NavBarFixed" : "NavBar"}>
                    <NavBar />
                </div>
                {isAdmin ? <AdminSpeedDial /> : <ChatbotBtn />}
                <div className={scrolled ? "bodyScrolled" : "body"}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/product/add" element={<ProductForm />} />
                        <Route path="/product/detail/:id" element={<ProductDetail />} />
                        <Route path="/category/:id" element={<CategoryResult />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/user/order" element={<UserOrder />} />
                        <Route path="/user/review" element={<UserReview />} />
                        <Route path="/seller/product" element={<SellerProduct />} />
                        <Route path="/seller/order" element={<SellerOrder />} />
                        <Route path="/search" element={<SearchResult />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/test" element={<TestSend />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
