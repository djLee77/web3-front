import { useState, useEffect } from 'react';
import Card from '../components/product/Card';
import SlideImg from '../components/SildeImg';
import axios from 'axios';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/public/items', {
                    params: {
                        search: "",  // 추후 검색기능 구현시 여기에 검색 키워드 입력
                        sortType: "s",
                        pageNum: 1,
                        pageSize: 5
                    },
                    headers: {
                        "ngrok-skip-browser-warning": "1234",
                    },
                });

                if (response.data.code === 200) {
                    setProducts(response.data.data.items);
                } else {
                    console.error('Error fetching products:', response.data.message);
                }
            } catch (error) {
                console.error('API call error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="item">
                <SlideImg />
            </div>
            <div className="card-list">
                {products.map((product) => (
                    <Card key={product.itemId} product={product} />
                ))}
            </div>

            <style jsx>{`
                .card-list {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    grid-gap: 20px;
                    width: 960px;
                }
            `}</style>
        </div>
    );
};

export default Home;
