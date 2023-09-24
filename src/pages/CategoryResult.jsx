import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from "../components/product/Card";

const CategoryResult = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);

  const findNodeAndPath = (categories, categoryId, path = []) => {
    for (let category of categories) {
      if (category.categoryId === categoryId) {
        return [...path, category.name];
      }
      const foundInChild = findNodeAndPath(category.child, categoryId, [
        ...path,
        category.name,
      ]);
      if (foundInChild) {
        return foundInChild;
      }
    }
    return null;
  };

  useEffect(() => {
    const getProudctList = async () => {
      try {
        const categoryRes = await axios.get("/api/public/categories", {
          headers: {
            "ngrok-skip-browser-warning": "1234",
          },
        });
        if (categoryRes.data.code === 200) {
          const pathNames = findNodeAndPath(
            categoryRes.data.data[0].child,
            parseInt(id)
          );
          setCategoryNames(pathNames || []);
          console.log(categoryRes.data.data[0].child);
        }

        const res = await axios.get(`/api/public/categories/${id}/items`, {
          headers: {
            "ngrok-skip-browser-warning": "1234",
          },
          params: {
            sortType: "n", // 기본값
            pageNum: 1, // 기본값
            pageSize: 6, // 기본값
          },
        });

        if (res.data.code === 200) {
          setProducts(res.data.data.items);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getProudctList();
  }, [id]);

  return (
    <div>
      {categoryNames.join("/")}
      <div className="card-list">
        {products.map((product) => (
          <Card key={product.itemId} product={product} />
        ))}
      </div>

      <style jsx>{`
        .card-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 20px;
          width: 960px;
        }
      `}</style>
    </div>
  );
};

export default CategoryResult;
