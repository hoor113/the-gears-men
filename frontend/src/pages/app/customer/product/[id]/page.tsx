import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import productsService from "../../_services/product.service";

const SingleProductPage = () => {
    const { id } = useParams<{ id: string }>();

    const { data: getOneProduct } = useQuery({
        queryKey: ['products/getOne'],
        queryFn: () => productsService.getOne(id as string),
    });
    console.log('getOneProduct', getOneProduct);


    return (
        <>
            Product id: {id}
        </>
    )
}

export default SingleProductPage;