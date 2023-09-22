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
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div style={{ position: "relative", zIndex: "2" }}>
          <NavBar />
        </div>
        <ChatbotBtn />
        <div style={{ position: "relative", zIndex: "1" }}>
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
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
