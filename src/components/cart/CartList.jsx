import axios from "axios";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Button } from "@mui/material";

export default function CartList() {
    const [cartList, setCartList] = useState([]);

    const getCartList = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/carts");
            console.log("장바구니 : ", res.data.data.carts);
            setCartList(res.data.data.carts);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCartList();
    }, []);

    return (
        <div>
            {cartList.length === 0 && <div>장바구니에 담은 상품이 없습니다.</div>}
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">상품 사진</TableCell>
                            <TableCell align="center">상품명</TableCell>
                            <TableCell align="center">수량</TableCell>
                            <TableCell align="center">가격</TableCell>
                            <TableCell align="center">삭제</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cartList.map((item) => (
                            <TableRow key={item.cartId}>
                                <TableCell align="center">
                                    <img src={item.image} />
                                </TableCell>
                                <TableCell align="center">{item.name}</TableCell>
                                <TableCell align="center">{item.count}</TableCell>
                                <TableCell align="center">{item.price}</TableCell>
                                <TableCell align="center">
                                    <Button>x</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
