import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { alpha, styled } from '@mui/material';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { sort } from 'rambda';
import {
  createContext,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';

import CheckboxLabel from '../field/checkbox-label';
import useTreeData, {
  BaseOptionType,
  DefaultOptionType,
  SimpleModeConfig,
} from './use-tree-data';
import { recursiveChildren } from './utils';

type TTreeProps<OptionType extends BaseOptionType = DefaultOptionType> = {
  treeData?: OptionType[];
  treeDataSimpleMode?: SimpleModeConfig;
  value?: string[];
  onChange?: (_v?: string[]) => void;
  readonly?: boolean;
};

const mappedToArray = (obj?: Record<string, boolean | undefined>) => {
  const internalMapped = Object.entries(obj || {})
    .map(([key, value]) => (value ? key : ''))
    .filter((i) => !!i);
  return internalMapped;
};

export const TreeStateContext = createContext<
  [
    Record<string, boolean | undefined>,
    React.Dispatch<React.SetStateAction<Record<string, boolean | undefined>>>,
  ]
>([{}, () => null]);

const Tree = ({
  treeData = [],
  treeDataSimpleMode = { id: 'id', pId: 'pId' },
  value,
  onChange,
  readonly,
}: TTreeProps) => {
  const uid = useId();

  const [internalSelectedObj, setInternalSelectedObj] = useState<
    Record<string, boolean | undefined>
  >({});

  const [internalExpanded, setInternalExpanded] = useState<string[]>([]);

  const mergedTreeData = useTreeData(treeData, treeDataSimpleMode);
  const sortedTreeData = useMemo(
    () =>
      sort(
        (a, b) => String(a.label).localeCompare(String(b.label)),
        mergedTreeData,
      ),
    [mergedTreeData],
  );

  const handleChangeNode = useCallback(
    (node: DefaultOptionType, checked: boolean) => {
      const newObj = node.children?.length
        ? {
            ...internalSelectedObj,
            ...recursiveChildren(node, checked),
            [node.value]: checked,
          }
        : { ...internalSelectedObj, [node.value]: checked };
      const mapped = mappedToArray(newObj);
      setInternalSelectedObj(newObj);
      onChange?.(mapped);
    },
    [internalSelectedObj, onChange],
  );

  const renderTree = useCallback(
    (nodes: DefaultOptionType) => {
      const allChildren = nodes.children?.length
        ? Object.keys(recursiveChildren(nodes))
        : [];
      const selectedChildren = nodes.children?.length
        ? allChildren?.filter((c) => !!internalSelectedObj[c])
        : [];
      const isIndeterminate =
        !!nodes.children?.length &&
        !!selectedChildren.length &&
        selectedChildren.length < allChildren.length;

      const isChecked = nodes.children?.length
        ? !!internalSelectedObj[nodes.value] ||
          (!!selectedChildren.length &&
            selectedChildren.length === allChildren.length)
        : !!internalSelectedObj[nodes.value];

      return (
        <StyledTreeItem
          key={uid + nodes.value}
          nodeId={nodes.value}
          disabled={nodes.disabled}
          label={
            <CheckboxLabel
              value={nodes.value}
              label={nodes.label}
              checked={isChecked}
              disabled={nodes.disabled}
              indeterminate={isIndeterminate}
              onChange={(_e, checked) => {
                if (nodes.disabled) return;
                if (readonly) return;
                return handleChangeNode(nodes, checked);
              }}
            />
          }
        >
          {Array.isArray(nodes.children)
            ? nodes.children.map((n) => renderTree(n))
            : null}
        </StyledTreeItem>
      );
    },
    [internalSelectedObj, uid, readonly, handleChangeNode],
  );

  useEffect(() => {
    if (!!value?.length && !Object.keys(internalSelectedObj).length) {
      const mapped = value.reduce(
        (prev, curr) => ({ ...prev, [curr]: true }),
        {} as Record<string, boolean>,
      );
      setInternalSelectedObj(mapped);
    }
  }, [value, internalSelectedObj]);

  return (
    <TreeStateContext.Provider
      value={[internalSelectedObj, setInternalSelectedObj]}
    >
      <TreeView
        multiSelect={true}
        selected={mappedToArray(internalSelectedObj)}
        expanded={internalExpanded}
        onNodeToggle={(_e, nodeIds) => {
          setInternalExpanded(nodeIds);
        }}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        // defaultEndIcon={
        //   <RemoveRoundedIcon className="close" fontSize="small" color="inherit" />
        // }
        sx={{
          height: 'fit-content',
          maxHeight: 'auto',
          flexGrow: 1,
          overflowY: 'auto',
          py: 1,
          px: 1,
        }}
      >
        {sortedTreeData.map((item) => {
          return renderTree(item);
        })}
      </TreeView>
    </TreeStateContext.Provider>
  );
};

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer} .close`]: {
    opacity: 0.3,
  },
  [`& .${treeItemClasses.content}`]: {
    padding: '6px 8px',
  },
  [`& .${treeItemClasses.selected}`]: {
    backgroundColor: `${alpha(theme.palette.primary.main, 0.1)} !important`,
    [`& .${treeItemClasses.iconContainer} .close`]: {
      opacity: 1,
      color: theme.palette.text.primary,
    },
  },
  [`& .${treeItemClasses.expanded}.${treeItemClasses.selected}`]: {
    backgroundColor: `${alpha(theme.palette.primary.main, 0.1)} !important`,
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 9,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

export default Tree;
