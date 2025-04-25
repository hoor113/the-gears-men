import React from 'react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import './product-modal.scss'
import img from '../../../../assets/images/iphoneXS.jpg'

const ProductModal = NiceModal.create(() => {
  const modal = useModal();

  if (!modal.visible) return null;

  return (
    <div className='modal-bgr'>
      <div className='modal-wraper'>
        <div className="left">
            <div className="image">
                <img src={img}/>
            </div>
        </div>

        <div className="right">
            <div className='content'>
                <div className='name'>Ai phôn XSMAX</div>
                <div className='price'>Giá: 5 triệu VNĐ</div>
                <div className='quantity'>
                    <span>-</span>
                    <input type='text' value={5} readOnly/>
                    <span>+</span>
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
