const express = require("express");
const app = express();
const PORT = 4000;
const cors = require("cors");

app.use(cors());

const mockData = {
  code: 200,
  message: "",
  data: {
    categories: [
      {
        categoryId: 0,
        name: "ROOT",
        status: "ACTIVE",
        child: [
          {
            categoryId: 120239,
            name: "패션의류/잡화",
            status: "ACTIVE",
            child: [
              {
                categoryId: 1123313,
                name: "남성의류",
                status: "ACTIVE",
                child: [
                  {
                    categoryId: 1123313,
                    name: "의류",
                    status: "ACTIVE",
                    child: [],
                  },
                  {
                    categoryId: 1123314,
                    name: "속옷/잠옷",
                    status: "ACTIVE",
                    child: [],
                  },
                  {
                    categoryId: 1123315,
                    name: "신발",
                    status: "ACTIVE",
                    child: [],
                  },
                  {
                    categoryId: 1123315,
                    name: "가방/잡화",
                    status: "ACTIVE",
                    child: [],
                  },
                ],
              },
              {
                categoryId: 1123313,
                name: "여성의류",
                status: "ACTIVE",
                child: [
                  {
                    categoryId: 1123313,
                    name: "의류",
                    status: "ACTIVE",
                    child: [],
                  },
                  {
                    categoryId: 1123314,
                    name: "속옷/잠옷",
                    status: "ACTIVE",
                    child: [],
                  },
                  {
                    categoryId: 1123315,
                    name: "여성 신발",
                    status: "ACTIVE",
                    child: [],
                  },
                  {
                    categoryId: 1123315,
                    name: "가방/잡화",
                    status: "ACTIVE",
                    child: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

app.get("/api/categories", (req, res) => {
  res.json(mockData);
});

const cartData = {
  code: 200,
  message: "",
  data: {
    carts: [
      {
        cartId: 1000,
        itemId: 10010,
        name: "이쁜 옷1",
        count: 1,
        price: 30000,
        image: "imageUrl",
        remaining: "",
      },
      {
        cartId: 1001,
        itemId: 10011,
        name: "이쁜 옷2",
        count: 1,
        price: 50000,
        image: "imageUrl",
        remaining: "",
      },
      {
        cartId: 1002,
        itemId: 10012,
        name: "이쁜 옷3",
        count: 1,
        price: 40000,
        image: "imageUrl",
        remaining: "",
      },
    ],
    total: 120000,
  },
};

app.get("/api/carts", (req, res) => {
  res.json(cartData);
});

const allProducts = [
  {
    itemId: 100110,
    name: "이쁜옷",
    image1: "image1",
    price: 100,
    rate: 3.4,
    reviewCount: 10,
    remaining: 9,
  },
  {
    itemId: 100111,
    name: "이쁜옷1",
    image1: "image1",
    price: 100,
    rate: 3.4,
    reviewCount: 10,
    remaining: 8,
  },
  // ... 기타 상품들
];

app.use(express.json());

app.get("/api/items", (req, res) => {
  const searchTerm = req.query.query;

  if (!searchTerm) {
    return res
      .status(400)
      .send({ code: 400, message: "Search term is required.", data: {} });
  }

  // 상품 이름에 검색어가 포함된 상품만 필터링
  const matchedProducts = allProducts.filter((product) =>
    product.name.includes(searchTerm)
  );

  console.log(matchedProducts);
  res.send({
    code: 200,
    message: "",
    data: { items: matchedProducts },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
