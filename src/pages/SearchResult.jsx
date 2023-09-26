import React, { useState, useEffect } from "react";
import Card from "../components/product/Card";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Loading from "../components/Loading";

const SearchResult = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("query");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/public/items", {
                    params: {
                        search: query,
                        sortType: "n", // 기본값
                        pageNum: 1, // 기본값
                        pageSize: 10, // 기본값
                    },
                    headers: {
                        "ngrok-skip-browser-warning": "1234",
                    },
                });

                console.log(response);
                if (response.data.code === 200) {
                    setProducts(response.data.data.items);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching the products - Search:", error);
            }
        };

        fetchData();
    }, [query]);

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

    return (
        <div>
            {loading ? (
                <Loading content={`${query}에 대한 검색 결과 가져오는 중입니다..`} />
            ) : (
                <div className="card-list">
                    {products?.map((product) => (
                        <Card key={product.itemId} product={product} />
                    ))}
                </div>
            )}

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

export default SearchResult;
