import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import productsService from "../../_services/product.service";

const SingleProductPage = () => {
    const { id } = useParams<{ id: string }>();

    const { data: product } = useQuery({
        queryKey: ['products/getOne', id],
        queryFn: () => productsService.getOne(id as string),
        enabled: !!id,
<<<<<<< HEAD
    });

    console.log('product', product);

    if (!product) return <div>Đang tải sản phẩm</div>;

    return (
        <div className="flex flex-col lg:flex-row items-start gap-8 p-8">
           //Ảnh chính sản phẩm
            <div className="flex flex-col items-center">
                <div className="border-4 border-yellow-400 p-2 relative">
                    <img
                        src={product.image || "/placeholder.png"} //thya product.image bằng lưu trong backend   
                        alt={product.name} //thay product.name bằng tên sản phẩm trong backend
=======
    }) as any;

    console.log('product', product);

    // if (!product) return <div>Đang tải sản phẩm...</div>;

    return (
        <div className="flex flex-col lg:flex-row items-start gap-8 p-8">
            {/* Hình ảnh sản phẩm */}
            <div className="flex flex-col items-center">
                <div className="border-4 border-yellow-400 p-2 relative">
                    <img
                        src={product?.image || "/placeholder.png"} //thya product.image bằng lưu trong backend   
                        alt={product?.name} //thay product.name bằng tên sản phẩm trong backend
>>>>>>> bf65217a05eb98c5454a1834052969877dd3060e
                        className="w-80 h-60 object-contain"
                    />
                    <span className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 text-sm font-bold rounded">
                        SIÊU SALE
                    </span>
                </div>

<<<<<<< HEAD
                //ảnh nhỏ hơn
                <div className="flex gap-4 mt-4">
                    {product.images?.map((img: string, index: number) => (
=======
                {/* Hình ảnh nhỏ */}
                <div className="flex gap-4 mt-4">
                    {product?.images?.map((img: string, index: number) => (
>>>>>>> bf65217a05eb98c5454a1834052969877dd3060e
                        <img
                            key={index}
                            src={img}
                            alt={`Ảnh phụ ${index + 1}`}
                            className="w-16 h-12 object-contain border hover:border-orange-500 cursor-pointer"
                        />
                    ))}
                </div>
            </div>

<<<<<<< HEAD
            //Thông tin sản phẩm
=======
            {/* Thông tin sản phẩm */}
>>>>>>> bf65217a05eb98c5454a1834052969877dd3060e
            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
                <p className="mb-2">
                    <span className="font-semibold">Tình trạng: </span>
<<<<<<< HEAD
                    <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                        {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                    </span>
                </p>

                //Số lượng
=======
                    <span className={product?.stock > 0 ? "text-green-600" : "text-red-600"}>
                        {product?.stock > 0 ? "Còn hàng" : "Hết hàng"}
                    </span>
                </p>

                {/* Chọn số lượng */}
>>>>>>> bf65217a05eb98c5454a1834052969877dd3060e
                <div className="flex items-center gap-4 mb-4">
                    <span className="font-semibold">Số lượng:</span>
                    <div className="flex items-center border rounded overflow-hidden">
                        <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300">-</button>
                        <input
                            type="number"
                            min={1}
                            defaultValue={1}
                            className="w-12 text-center outline-none"
                        />
                        <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300">+</button>
                    </div>
                </div>

<<<<<<< HEAD
                //THêm giỏ hàng
=======
                {/* Nút thêm vào giỏ */}
>>>>>>> bf65217a05eb98c5454a1834052969877dd3060e
                <button
                    className="bg-orange-500 text-white px-6 py-2 font-bold rounded hover:bg-orange-600"
                >
                    THÊM VÀO GIỎ HÀNG
                </button>
            </div>
        </div>
    );
};

export default SingleProductPage;
