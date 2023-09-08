import Card from "../components/product/Card";

const Home = () => {
    const testProductList = {
        code: 200,
        message: "",
        data: {
            items: [
                {
                    itemId: 100111,
                    name: "이쁜 옷1",
                    image1: "image1",
                    price: 100,
                    rate: 3.4,
                    reviewCount: 10,
                    remaining: 9,
                },
                {
                    itemId: 100112,
                    name: "이쁜 옷2",
                    image1: "image1",
                    price: 100,
                    rate: 3.4,
                    reviewCount: 10,
                    remaining: 9,
                },
                {
                    itemId: 100113,
                    name: "이쁜 옷3",
                    image1: "image1",
                    price: 100,
                    rate: 3.4,
                    reviewCount: 10,
                    remaining: 9,
                },
                {
                    itemId: 100114,
                    name: "이쁜 옷3",
                    image1: "image1",
                    price: 100,
                    rate: 3.4,
                    reviewCount: 10,
                    remaining: 9,
                },
                {
                    itemId: 200115,
                    name: "이쁜 옷3",
                    image1: "image1",
                    price: 100,
                    rate: 3.4,
                    reviewCount: 10,
                    remaining: 9,
                },
                {
                    itemId: 300110,
                    name: "이쁜 옷3",
                    image1: "image1",
                    price: 100,
                    rate: 3.4,
                    reviewCount: 10,
                    remaining: 9,
                },
            ],
        },
    };

    return (
        <div>
            <div className="card-list">
                {testProductList.data.items.map((product) => (
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
