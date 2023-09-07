import { MenuItem, Select } from "@mui/material";
import { useRef, useState } from "react";
import "../css/ProductForm.module.css";
import AddProduct from "../components/product/AddProduct";

const ProductForm = () => {
    return (
        <div>
            <AddProduct />
        </div>
    );
};

export default ProductForm;
