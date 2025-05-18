// File là trang danh mục sản phẩm, nơi người dùng có thể lọc sản phẩm theo thương hiệu, màu sắc và mức giá.
// Dùng React Query để lấy dữ liệu sản phẩm từ API và hiển thị chúng theo dạng lưới.
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import ProductItem from "@/components/ProductItem"; // tôi đang chưa biết đường dẫn chính xác của component này Ông ạ cái file này trên main ko dùng nữa taimport { useParams } from "react-router-dom";
import productsService from "../../_services/product.service";

const CategoryPage = () => {                
  const params = useParams();
  const id = params?.id as string;
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    brands: [] as string[],
    colors: [] as string[],
    priceRange: { min: null as number | null, max: null as number | null },
  });

  const { data: products } = useQuery({
    queryKey: ["products", id, filters],
    queryFn: async () => {
      const queryParams: any = { categoryId: id };

      if (filters.priceRange.min !== null) queryParams.minPrice = filters.priceRange.min;
      if (filters.priceRange.max !== null) queryParams.maxPrice = filters.priceRange.max;
      if (filters.brands.length > 0) queryParams.brands = filters.brands.join(",");
      if (filters.colors.length > 0) queryParams.colors = filters.colors.join(",");

      const res = await axios.get("/api/products", { params: queryParams });
      return res.data;
    },
    keepPreviousData: true,
  });

  const handleBrandToggle = (brand: string) => {
    setFilters((prev) => {
      const exists = prev.brands.includes(brand);
      const brands = exists ? prev.brands.filter((b) => b !== brand) : [...prev.brands, brand];
      return { ...prev, brands };
    });
    queryClient.refetchQueries(["products", id]);
  };

  const handleColorToggle = (color: string) => {
    setFilters((prev) => {
      const exists = prev.colors.includes(color);
      const colors = exists ? prev.colors.filter((c) => c !== color) : [...prev.colors, color];
      return { ...prev, colors };
    });
    queryClient.refetchQueries(["products", id]);
  };

  const handlePriceChange = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: { min, max },
    }));
    queryClient.refetchQueries(["products", id]);
  };

  return (
  <div className="flex flex-col md:flex-row">
    {/* Sidebar lọc */}
    <div className="w-full md:w-1/4 p-4 bg-gray-100 space-y-4">
      {/* ... giữ nguyên phần lọc (brand, color, price) */}
    </div>

    {/* Kết quả */}
    <div className="w-full md:w-3/4 p-4">
      <h2 className="text-xl font-semibold mb-4">Sản phẩm nổi bật</h2>
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p: any) => (
            <ProductItem key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="bg-yellow-100 text-center p-4 rounded">
          Không có sản phẩm nào trong danh mục này.
        </div>
      )}
    </div>
  </div>
);
}

export default CategoryPage;