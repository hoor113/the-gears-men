import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import {
  IconButton,
  InputAdornment,
  Popover,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { TreeView } from '@mui/x-tree-view/TreeView';
import {
  ForwardRefRenderFunction,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import { useMeasure } from 'react-use';

import useTreeData, {
  BaseOptionType,
  DefaultOptionType,
  SimpleModeConfig,
} from './use-tree-data';
import { getParents } from './utils';

type TTreeSelectProps<
  ValueType = string,
  OptionType extends BaseOptionType = DefaultOptionType,
> = {
  treeData?: OptionType[];
  treeDataSimpleMode?: boolean | SimpleModeConfig;
  value?: ValueType;
  defaultValue?: ValueType;
  onChange?: (_value?: ValueType, _item?: OptionType) => void;
  getSelectedAndParents?: (_items?: OptionType[]) => void;
  split?: string;
} & Pick<
  TextFieldProps,
  | 'sx'
  | 'required'
  | 'label'
  | 'placeholder'
  | 'fullWidth'
  | 'autoComplete'
  | 'error'
  | 'helperText'
  | 'size'
  | 'disabled'
  | 'select'
>;

const TreeSelect: ForwardRefRenderFunction<
  HTMLInputElement,
  TTreeSelectProps
> = (
  {
    value,
    onChange,
    disabled,
    treeData = [],
    treeDataSimpleMode = { id: 'id', pId: 'pId' },
    split = ' > ',
    autoComplete,
    getSelectedAndParents,
    ...props
  },
  forwardedRef,
) => {
  const uid = useId();
  const [internalInputValue, setInternalInputValue] = useState<string>('');
  const [internalExpanded, setInternalExpanded] = useState<string[]>([]);

  const mergedTreeData = useTreeData(treeData, treeDataSimpleMode);
  const mergedTreeDataMemo = useMemo(() => mergedTreeData, [mergedTreeData]);

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [anchorRef, anchorSize] = useMeasure<HTMLDivElement>();

  const renderTree = useCallback(
    (nodes: DefaultOptionType) => {
      return (
        <StyledTreeItem
          key={nodes.id}
          nodeId={nodes.value}
          label={nodes.label}
          onClick={() => {
            if (!nodes.children?.length) {
              onChange?.(nodes.value, nodes);
              setAnchorEl(null);
            }
          }}
        >
          {Array.isArray(nodes.children)
            ? nodes.children.map((n) => renderTree(n))
            : null}
        </StyledTreeItem>
      );
    },
    [onChange],
  );

  useEffect(() => {
    if (value) {
      const selectedParents = getParents(mergedTreeDataMemo, value);
      getSelectedAndParents?.(selectedParents || []);
      if (selectedParents.length) {
        setInternalInputValue(
          selectedParents.map((item) => item.label).join(split),
        );
      }
      if (selectedParents.length > 1 && !internalExpanded?.length) {
        const headParents = selectedParents.slice(0, -1);
        setInternalExpanded(headParents.map((item) => item.value));
      }
    } else {
      getSelectedAndParents?.([]);
    }
  }, [
    value,
    split,
    internalExpanded,
    mergedTreeDataMemo,
    getSelectedAndParents,
  ]);

  return (
    <>
      <TextField
        ref={anchorRef}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
          } else {
            e.stopPropagation();
            setAnchorEl(e.currentTarget);
          }
        }}
        sx={{ mb: 2, opacity: disabled ? 0.5 : 1 }}
        // defaultValue={internalInputValue || ''}
        value={internalInputValue || ''}
        InputLabelProps={internalInputValue ? { shrink: true } : {}}
        inputRef={forwardedRef}
        inputProps={{
          readOnly: true,
          style: { cursor: 'pointer' },
        }}
        InputProps={{
          style: { paddingRight: 4 },
          endAdornment: (
            <InputAdornment position="end" disablePointerEvents={true}>
              {/* {value && (
                <IconButton
                  size={28}
                  color="inherit"
                  sx={{ mr: 0.2 }}
                  onClick={(e) => {
                    handleReset();
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )} */}
              <IconButton
                edge="end"
                size="small"
                color={anchorEl ? 'primary' : 'inherit'}
                disabled={disabled}
              >
                <ArrowDropDownIcon className="" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        autoComplete={autoComplete || 'off'}
        focused={Boolean(anchorEl)}
        {...props}
      />
      <Popover
        id={uid + 'Popover'}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            style: {
              maxWidth: anchorSize.width,
              width: '100%',
              marginTop: 2,
            },
            elevation: 1,
          },
        }}
      >
        <TreeView
          multiSelect={true}
          selected={value ? [value] : undefined}
          expanded={internalExpanded}
          onNodeToggle={(_e, nodeIds) => {
            setInternalExpanded(nodeIds);
          }}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          defaultEndIcon={
            <FiberManualRecordOutlinedIcon
              className="close"
              color="inherit"
              sx={{ width: 14, height: 14 }}
            />
          }
          sx={{
            height: 'fit-content',
            maxHeight: 240,
            flexGrow: 1,
            overflowY: 'auto',
            py: 1,
            px: 1,
          }}
        >
          {mergedTreeDataMemo.map((item) => {
            return renderTree(item);
          })}
        </TreeView>
      </Popover>
    </>
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
    backgroundColor: `${alpha(theme.palette.primary.main, 0.4)} !important`,
    [`& .${treeItemClasses.iconContainer} .close`]: {
      opacity: 1,
      color: theme.palette.text.primary,
    },
  },
  [`& .${treeItemClasses.focused}`]: {
    backgroundColor: `transparent`,
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 16,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

export default forwardRef(TreeSelect);
