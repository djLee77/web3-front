import "./App.css";
import NavBar from "./components/NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductForm from "./pages/ProductForm";

function App() {
  return (  
    <BrowserRouter>
      <div className="App">
      <NavBar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product-form" element={<ProductForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
