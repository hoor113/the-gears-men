import './product-item.scss'
import img from '../../../../assets/images/iphoneXS.jpg'
import ProductModal from './product-model'
import NiceModal from '@ebay/nice-modal-react'
const ProductItem = () => {
    const showProductModel = () => {
        // console.log("nịt");
        
        NiceModal.show(ProductModal)
    }
    return <>
        <div className="item-product">
            <div className="thumbnail">
                <img src={img} />
                <div className="overlay"></div>
                <div className='detail' onClick={showProductModel}>Chi tiết</div>
            </div>
            <div className="content">
                <div className='name'>Iphone XS MAX</div>
                <div className='price'>1,999,999đ</div>
            </div>
        </div>
    </>
}

export default ProductItem