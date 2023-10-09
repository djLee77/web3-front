import { useEffect, useState } from "react";
import Card from "../components/product/Card";
import axios from "axios";
import SlideImg from "../components/SildeImg";
import style from "../css/Home.module.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/public/items", {
          params: {
            search: "", // 추후 검색기능 구현시 여기에 검색 키워드 입력
            sortType: "desc",
            pageNum: 1,
            pageSize: 6, // 카드로 보여줄 상품 수
          },
          headers: {
            "ngrok-skip-browser-warning": "1234",
          },
        });

        if (response.data.code === 200) {
          setProducts(response.data.data.items);
        } else {
          console.error("Error fetching products:", response.data.message);
        }
      } catch (error) {
        console.error("API call error:", error);
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
    <div className={style.container}>
      <div className={style.item} style={{marginTop : "10px"}}>
        <SlideImg />
      </div>
      <div className={style.item}>
        <div>
            <p>인기 상품</p>
        </div>
        <div className="card-list">
          {products.map((product) => (
            <Card key={product.itemId} product={product} />
          ))}
        </div>
      </div>
      <style jsx>{`
        .container {
          width: 100%;
          max-width: 100vw; // viewport의 100%와 같음
          overflow-x: hidden; // 가로 스크롤 방지
        }

        .item {
          width: 100%;
        }

        .card-list {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-gap: 20px;
          width: 1212px;
          margin: 0 auto; // 중앙 정렬
        }
      `}</style>
    </div>
  );
};

export default Home;
