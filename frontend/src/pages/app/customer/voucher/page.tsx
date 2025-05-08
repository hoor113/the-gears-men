import { useQuery } from '@tanstack/react-query';



const VoucherPage = () => {

  


  return (
    <>
      Voucher page
    </>
  );
};

export default VoucherPage;


// const { data: getAllProducts } = useQuery({
//     queryKey: ['products/getAll'],
//     queryFn: () => productsService.getAll({
//         maxResultCount: 1000,
//     }),
// })

// const { data: getAllAccessories } = useQuery({
//     queryKey: ['products/getAll/accessories'],
//     queryFn: () => productsService.getAll({
//         maxResultCount: 1000,
//         category: EProductCategory.Accessories,
//     }),
// })

// console.log('getAllProducts', getAllProducts);
// console.log('getAllAccessories', getAllAccessories);
