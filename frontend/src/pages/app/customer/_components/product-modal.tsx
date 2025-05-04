import React, { useState } from 'react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import './product-modal.scss'
import img from '../../../../assets/images/iphoneXS.jpg'
import { EProductCategory, Product } from "../_services/product.model";

const ProductModal = NiceModal.create((props: { product: Product }) => {

  const [quantity, setQuantity] = useState(1)



  const modal = useModal();
  const { product } = props
  if (!modal.visible) return null;

  return (
    <div className='modal-bgr'>
      <div className='modal-wraper'>
        <div className="left">
          <div className="image">
            <img src={product.images[0]} />
          </div>
        </div>

        <div className="right">
          <div className='content'>
            <div className='name'>{product.name}</div>
            {product.priceAfterDiscount ?
              (
                <>
                  <div className='price dc'>Giá: {product.price} VNĐ</div>
                  <div className="discounted-price">Giá: {product.priceAfterDiscount} VNĐ</div>
                </>
              )
              : (<div className='price'>Giá: {product.price} VNĐ</div>)
            }
            <div className='quantity'>
              <span onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>-</span>
              <input type='text' value={quantity} readOnly />
              <span onClick={() => setQuantity((prev) => prev + 1)}>+</span>
            </div> 
            <div className='add-to-cart'>Thêm vào giỏ hàng</div>
          </div>
        </div>

        <div className='close-button' onClick={modal.hide}></div>
      </div>
    </div>
  );
});

export default ProductModal;
