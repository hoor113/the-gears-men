import Slider from "react-slick"
import ProductItem from "./product-item";
import { Box } from "@mui/material";
import "slick-carousel/slick/slick.scss";
import "slick-carousel/slick/slick-theme.scss";
import "./block-products.scss"

type BlockProductsProps = {
    title: string;
  };

const BlockProducts = ({title}: BlockProductsProps) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,  // Hiện 4 sản phẩm mỗi lần
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
                        {[...Array(10)].map((_, index) => (
                            <Box key={index} px={1}>
                                <ProductItem />
                            </Box>
                        ))}
                    </Slider>
                </Box>
            </div>
        </div>
    );
};

export default BlockProducts;
