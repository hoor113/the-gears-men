import { useParams } from "next/navigation";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import ProductItem from "@/components/ProductItem"; // sửa lại đúng đường dẫn nếu cần

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
    <div className="flex">
      {/* Sidebar lọc */}
      <div className="w-1/4 p-4 bg-gray-100 space-y-4">
        <div>
          <h3 className="font-bold mb-2">THƯƠNG HIỆU</h3>
          {["DELL", "ASUS", "SAMSUNG", "Apple"].map((brand) => (
            <div key={brand}>
              <label>
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="mr-2"
                />
                {brand}
              </label>
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-bold mb-2">MÀU SẮC</h3>
          {["Vàng", "Tím", "Đỏ", "Xanh", "Hồng"].map((color) => (
            <div key={color}>
              <label>
                <input
                  type="checkbox"
                  checked={filters.colors.includes(color)}
                  onChange={() => handleColorToggle(color)}
                  className="mr-2"
                />
                {color}
              </label>
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-bold mb-2">MỨC GIÁ</h3>
          {[{ min: 0, max: 100000 }, { min: 100000, max: 200000 }, { min: 200000, max: 300000 }].map((range, i) => (
            <div key={i}>
              <label>
                <input
                  type="radio"
                  name="price"
                  checked={filters.priceRange.min === range.min && filters.priceRange.max === range.max}
                  onChange={() => handlePriceChange(range.min, range.max)}
                  className="mr-2"
                />
                {range.min.toLocaleString()}đ - {range.max.toLocaleString()}đ
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Kết quả */}
      <div className="w-3/4 p-4">
        <h2 className="text-xl font-semibold mb-4">Sản phẩm nổi bật</h2>
        {products && products.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {products.map((p: any) => (
              <ProductItem key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="bg-yellow-100 text-center p-4 rounded">Không có sản phẩm nào trong danh mục này.</div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;