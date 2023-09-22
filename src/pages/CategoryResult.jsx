import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from "../components/product/Card";

const CategoryResult = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProudctList = async () => {
      try {
        const res = await axios.get(`/api/public/categories/${id}/items`, {
          headers: {
            "ngrok-skip-browser-warning": "1234",
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
  }, []);

  return (
    <div>
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
