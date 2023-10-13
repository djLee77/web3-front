import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from "../components/product/Card";
import Pagination from "@mui/material/Pagination";
import style from "../css/CategoryResult.module.css";
import Loading from "../components/Loading";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FormControl } from "@mui/material";

const CategoryResult = () => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortTypes, setSortTypes] = useState(["createdAt", "desc"]);
  const [selectedType, setSelectedType] = useState("최신순");
  const typesObj = {
    판매량순: ["sales", "desc"],
    낮은가격순: ["price", "asc"],
    높은가격순: ["price", "desc"],
    최신순: ["createdAt", "desc"],
    "별점 높은순": ["avgRating", "desc"],
  };
  const handleSortType = (event) => {
    setSelectedType(event.target.value);
    setSortTypes(typesObj[event.target.value]);
    console.log(sortTypes);
  };

  const findNodeAndPath = (categories, categoryId, path = []) => {
    for (let category of categories) {
      if (category.categoryId === categoryId) {
        return [...path, category.name];
      }

      if (category.child) {
        const foundInChild = findNodeAndPath(category.child, categoryId, [
          ...path,
          category.name,
        ]);
        if (foundInChild) {
          return foundInChild;
        }
      }
    }
    return null;
  };

  useEffect(() => {
    const getProudctList = async () => {
      try {
        const categoryRes = await axios.get(
          `${serverUrl}/api/public/categories`,
          { credentials: true }
        );
        if (categoryRes.data.code === 200) {
          const pathNames = findNodeAndPath(
            categoryRes.data.data[0].child,
            parseInt(id)
          );
          setCategoryNames(pathNames || []);
        }

        const res = await axios.get(`${serverUrl}/api/public/categories/${id}/items`, {
          params: {
            sort: sortTypes[0],
            sortType: sortTypes[1], // 기본값
            pageNum: pageNum - 1, // 기본값
            pageSize: 9, // 기본값
          },
          credentials: true,
        });

        if (res.data.code === 200) {
          setProducts(res.data.data.items);
          setTotalPages(res.data.data.totalPage);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getProudctList();
  }, [id, pageNum, sortTypes]);

  const handlePageChange = (event, value) => {
    setPageNum(value);
  };

  return loading ? (
    <Loading content="카테고리 목록을 불러오는 중입니다." />
  ) : (
    <div>
      <div className={style.header}>
        <div>{categoryNames.join("/")}</div>
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
      <div className={style.container}>
        <div className={style.item}>
          <p>카테고리</p>
        </div>
        <div className={style.item}>
          {products.map((product) => (
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
  );
};

export default CategoryResult;
