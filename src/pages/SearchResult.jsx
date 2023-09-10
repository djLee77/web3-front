import React, { useState, useEffect } from 'react';
import Card from '../components/product/Card';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const SearchResult = () => {
    const [products, setProducts] = useState([]);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('http://localhost:4000/api/items', { query: query });
                
                if (response.data.code === 200) {
                    setProducts(response.data.data.items);
                }
            } catch (error) {
                console.error("Error fetching the products:", error);
            }
        };

        fetchData();
    }, [query]);

    return (
        <div>
            <div className="card-list">
                {products.map(product => (
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

export default SearchResult;
