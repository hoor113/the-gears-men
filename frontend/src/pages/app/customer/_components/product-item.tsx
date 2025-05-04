import React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import ProductModal from './product-modal'; // Đảm bảo rằng bạn import đúng đường dẫn của ProductModal
import { EProductCategory, Product } from '../_services/product.model';
import './product-item.scss'

type ProductProps = {
    product: Product;
};

const ProductItem: React.FC<ProductProps> = ({ product }) => {
    const showProductModal = () => {
        NiceModal.show(ProductModal, { product }); // Truyền product vào modal để hiển thị chi tiết sản phẩm
    };

    return (
        <div className="item-product">
            <div className="thumbnail">
                <img src={product.images[0]} alt={product.name} />
                <div className="overlay"></div>
                <div className='button-overlay'>
                    <div className='detail' onClick={showProductModal}>Chi tiết</div>
                    <div className='more' onClick={() => { console.log("Xem thêm") }}>Xem thêm</div>
                </div>
            </div>
            {product.priceAfterDiscount == undefined ?
                (<div className="content">
                    <div className='name'>{product.name}</div>
                    <div className='price'>{product.price} VNĐ</div>
                </div>)
                :
                (<div className="content-discount">
                    <div className='name'>{product.name}</div>
                    <div className='price'>{product.price} VNĐ</div>
                    <div className="discount-price">{product.priceAfterDiscount} VNĐ</div>
                </div>)
            }
        </div>
    );
};

export default ProductItem;
