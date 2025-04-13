import { useEffect } from 'react';

import appService from '@/services/app/app.service';

type TUseLoadingProps = {
  showConditionsSome?: boolean[];
  showConditionsEvery?: boolean[];
  hideConditionsSome?: boolean[];
  hideConditionsEvery?: boolean[];
};

const useLoading = (props: TUseLoadingProps) => {
  const {
    showConditionsSome,
    showConditionsEvery,
    hideConditionsSome,
    hideConditionsEvery,
  } = props;

  useEffect(() => {
    if (
      showConditionsSome?.some((condition) => condition) ||
      showConditionsEvery?.every((condition) => condition)
    ) {
      appService.showLoadingModal();
    } else if (
      hideConditionsSome?.some((condition) => condition) ||
      hideConditionsEvery?.every((condition) => condition)
    ) {
      appService.hideLoadingModal();
    } else {
      appService.hideLoadingModal();
    }
  }, [
    showConditionsSome,
    showConditionsEvery,
    hideConditionsSome,
    hideConditionsEvery,
  ]);
};

export default useLoading;
