import { useQuery } from '@tanstack/react-query';
import productsService from './_services/product.service';
import { EProductCategory } from './_services/product.model';
const CustomerPage = () => {

    const { data: getAllProducts } = useQuery({
        queryKey: ['products/getAll'],
        queryFn: () => productsService.getAll({
            maxResultCount: 1000,
        }),
    })

    const { data: getAllAccessories } = useQuery({
        queryKey: ['products/getAll/accessories'],
        queryFn: () => productsService.getAll({
            maxResultCount: 1000,
            category: EProductCategory.Accessories,
        }),
    })
    console.log('getAllProducts', getAllProducts);
    console.log('getAllAccessories', getAllAccessories);
    return (
        <>
        Home Page            
        </>
    );
};

export default CustomerPage;
