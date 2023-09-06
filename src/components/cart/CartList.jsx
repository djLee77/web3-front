import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Button } from "@mui/material";

export default function CartList({ cartList }) {
    // 삭제 버튼 함수
    const handleDelBtn = (id) => {
        console.log(id, " 삭제");
    };

    return (
        <div>
            {cartList.length === 0 ? (
                <div>장바구니에 담은 상품이 없습니다.</div>
            ) : (
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
                                        <img src={item.image} alt={item.name} />
                                    </TableCell>
                                    <TableCell align="left" sx={{ fontSize: "16px" }}>
                                        {item.name}
                                    </TableCell>
                                    <TableCell align="center">{item.count}</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                                        {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button onClick={() => handleDelBtn(item.cartId)}>x</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}
