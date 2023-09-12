import "./App.css";
import NavBar from "./components/NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductForm from "./pages/ProductForm";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import ChatbotBtn from "./components/fab/chatbotBtn";
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
          <Route path="/search-result" element={<SearchResult />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
