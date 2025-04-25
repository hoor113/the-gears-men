import { useQuery } from '@tanstack/react-query';
import productsService from './_services/product.service';
import { EProductCategory } from './_services/product.model';

import { Container } from "@mui/material"
import BlockProducts from './_components/block-products';
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
            <Container maxWidth={"lg"}>
                <BlockProducts title={"Danh mục 1"}/>
            </Container>
        </>
    );
};

export default CustomerPage;
