import React, { useState, useEffect } from "react";
import Card from "../components/product/Card";
import axios from "axios";
import { useLocation } from "react-router-dom";
import style from "../css/SearchResult.module.css";
import Pagination from "@mui/material/Pagination";

const SearchResult = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/public/items", {
          params: {
            search: query,
            sortType: "desc", // 기본값
            pageNum: pageNum-1, // 기본값
            pageSize: 6, // 기본값
          },
        });
        if (res.data.code === 200) {
          setProducts(res.data.data.items);
          setTotalPages(res.data.data.totalPage);
        }
      } catch (error) {
        console.error("Error fetching the products - Search:", error);
      }
    };

    fetchData();
  }, [query, pageNum]);

  const handlePageChange = (event, value) => {
    setPageNum(value);
  };

  return (
    <div className={style.container}>
      <div className="card-list">
        {products.map((product) => (
          <Card key={product.itemId} product={product} />
        ))}
      </div>
      <div className={style.item}>
        <Pagination
          count={totalPages}
          page={pageNum}
          onChange={handlePageChange}
        />
      </div>
      <style jsx>{`
        .card-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 20px;
          width: 660px;
        }
      `}</style>
    </div>
  );
};

export default SearchResult;
