import { useEffect, useState } from "react";
import Card from "../components/product/Card";
import axios from "axios";
import SlideImg from "../components/SildeImg";
import Loading from "../components/Loading";
import style from "../css/Home.module.css";

const Home = () => {
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/public/items`, {
          params: {
            search: "", // 추후 검색기능 구현시 여기에 검색 키워드 입력
            sort: "sales",
            sortType: "desc",
            pageNum: 0,
            pageSize: 6, // 카드로 보여줄 상품 수
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
    return <Loading content="상품을 불러오는 중입니다.." />;
  }

  return (
    <div className={style.container}>
      <div className={style.item} style={{ marginTop: "10px" }}>
        <SlideImg />
      </div>
      <div className={style.item}>
        <div
          style={{
            margin: "30px",
            marginTop: "20px",
            fontWeight: "bolder",
            borderBottom: "1px solid #dadce0",
          }}
        >
          <h5>인기 상품</h5>
        </div>
        <div className={style.cardList}>
          {products.map((product) => (
            <Card key={product.itemId} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
