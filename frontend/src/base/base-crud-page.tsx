import { styled } from '@mui/material';

import BaseCrudContent, { TBaseCrudContentProps } from './base-crud-content';

type TBaseCrudPageProps = TBaseCrudContentProps;

const BaseCrudPage = (props: TBaseCrudPageProps) => {
  return (
    <StyledContentWrapper>
      <BaseCrudContent {...props} />
    </StyledContentWrapper>
  );
};

const StyledContentWrapper = styled('main')(({ theme }) => ({
  flex: '1 1 auto',
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

export default BaseCrudPage;
