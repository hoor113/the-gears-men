import Slider from "react-slick"
import ProductItem from "./product-item";
import { Box } from "@mui/material";
import "slick-carousel/slick/slick.scss";
import "slick-carousel/slick/slick-theme.scss";
import "./block-products.scss"
import { fake_products } from "./test_product";
import { EProductCategory, Product } from "../_services/product.model";

type BlockProductsProps = {
    title: string;
    products: Product[]
};

const BlockProducts = ({ title, products }: BlockProductsProps) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,  // Hiện 4 sản phẩm mỗi lần
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 960, // dưới 960px
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 600, // dưới 600px
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };



    return (
        <div className="block">
            <div className="block-name">{title}</div>
            <div className="products">
                <Box sx={{ px: 2 }}>
                    <Slider {...settings}>
                        {products.map((item, index) => (
                            <Box key={item.id} px={1}>
                                <ProductItem product={item} />
                            </Box>
                        ))}
                    </Slider>
                </Box>
            </div>
            <div className="view-all">
                <button>Xem tất cả</button>
            </div>
        </div>
    );
};

export default BlockProducts;
