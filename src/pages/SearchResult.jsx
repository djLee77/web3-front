import React, { useState, useEffect } from "react";
import Card from "../components/product/Card";
import axios from "axios";
import { useLocation } from "react-router-dom";
import style from "../css/SearchResult.module.css";
import Pagination from "@mui/material/Pagination";
import Loading from "../components/Loading";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FormControl } from "@mui/material";

const SearchResult = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortTypes, setSortTypes] = useState(["createdAt", "desc"]);
  const [selectedType, setSelectedType] = useState("최신순");
  const typesObj = {
    "판매량순": ["sales", "desc"],
    "낮은가격순": ["price", "asc"],
    "높은가격순": ["price", "desc"],
    "최신순": ["createdAt", "desc"],
    "별점 높은순": ["avgRating", "desc"],
  };
  const handleSortType = (event) => {
    setSelectedType(event.target.value);
    setSortTypes(typesObj[event.target.value]);
    console.log(sortTypes);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/public/items", {
          params: {
            search: query,
            sort: sortTypes[0],
            sortType: sortTypes[1], // 기본값
            pageNum: pageNum - 1, // 기본값
            pageSize: 9, // 기본값
          },
        });
        if (res.data.code === 200) {
          setProducts(res.data.data.items);
          setTotalPages(res.data.data.totalPage);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching the products - Search:", error);
      }
    };

    fetchData();
  }, [query, pageNum, sortTypes]);

  const handlePageChange = (event, value) => {
    setPageNum(value);
  };

  if (products.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          fontSize: "24px",
          fontWeight: "bold",
          marginTop: "24px",
        }}
      >
        검색 상품이 없습니다
      </div>
    );
  }

  return loading ? (
    <Loading content={`${query}에 대한 검색 결과 가져오는 중입니다..`} />
  ) : (
    <div>
      <div className={style.header}>
        <div>"{query}"에 대한 검색 결과</div>
        <div>
          <FormControl sx={{ m: 1, minWidth: 120, height: 25 }} size="small">
            <Select
              sx={{ height: 28 }}
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={selectedType}
              onChange={handleSortType}
            >
              <MenuItem value={"판매량순"}>판매량순</MenuItem>
              <MenuItem value={"최신순"}>최신순</MenuItem>
              <MenuItem value={"별점 높은순"}>별점 높은순</MenuItem>
              <MenuItem value={"낮은가격순"}>낮은가격순</MenuItem>
              <MenuItem value={"높은가격순"}>높은가격순</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div className={style.containerBig}>
        <div className={style.containerSmall}>
          <div className={style.item}>
          </div>
          <div className={style.item}>
            {products?.map((product) => (
              <Card key={product.itemId} product={product} />
            ))}
          </div>
        </div>
        <div className={style.footer}>
          <Pagination
            count={totalPages}
            page={pageNum}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
