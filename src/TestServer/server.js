const express = require('express');
const app = express();
const PORT = 4000;

const mockData = {
  "code": 200,
  "message": "",
  "data": {
    "categories": [
      {
        "categoryId": 0,
        "name": "ROOT",
        "status": "ACTIVE",
        "child": [
          {
            "categoryId": 120239,
            "name": "패션의류/잡화",
            "status": "ACTIVE",
            "child": [
              {
                "categoryId": 1123313,
                "name": "남성의류",
                "status": "ACTIVE",
                "child": [
                  {
                    "categoryId": 1123313,
                    "name": "속옷/잠",
                    "status": "ACTIVE",
                    "child": []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}

app.get('/api/categories', (req, res) => {
  res.json(mockData);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
