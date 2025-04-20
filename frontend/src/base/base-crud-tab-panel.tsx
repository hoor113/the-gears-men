import BaseCrudContent, { TBaseCrudContentProps } from './base-crud-content';

type TBaseCrudPageProps = TBaseCrudContentProps;

const BaseCrudTabPanel = (props: TBaseCrudPageProps) => {
  return <BaseCrudContent {...props} />;
};

export default BaseCrudTabPanel;
