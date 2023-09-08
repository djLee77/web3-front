import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/product/detail/Header";
import Content from "../components/product/detail/Content";

export default function () {
    const { id } = useParams();

    useEffect(() => {
        console.log(id);
    }, []);
    return (
        <div>
            <Header />
            <Content />
        </div>
    );
}
