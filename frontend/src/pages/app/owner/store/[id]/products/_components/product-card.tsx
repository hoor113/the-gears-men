import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useStore } from '../../../_services/store.context';
import ownerProductsService from '../_services/product.service';
import OwnerBlockProducts from './block-products';

const OwnerProductCard = () => {
  const [storeState, _] = useStore();
  const storeId = useMemo(() => storeState.store?.id, [storeState.store?.id]);
  const { id } = useParams<{ id: string }>();
  const { data: getAllProducts } = useQuery<any>({
    queryKey: ['owner/products/getAll', storeId],
    queryFn: () =>
      ownerProductsService.getAll({
        maxResultCount: 1000,
        storeId: storeId,
      }),
  });

  return (
    <>
      <OwnerBlockProducts
        products={getAllProducts}
        title="Sản phẩm nổi bật"
        path={`/owner/store/${id}/products`}
      />
    </>
  );
};

export default OwnerProductCard;
