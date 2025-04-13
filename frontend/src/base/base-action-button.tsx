import {
  MoreVertTwoTone as ActionIcon,
  DeleteTwoTone as DeleteIcon,
  EditTwoTone as EditIcon,
  VisibilityTwoTone as ViewIcon,
} from '@mui/icons-material';
import {
  IconButton,
  ListItemIcon,
  MenuItem,
  MenuList,
  Popover,
  Typography,
  styled,
} from '@mui/material';
import { GridRowParams } from '@mui/x-data-grid';
import * as R from 'rambda';
import { useMemo, useState } from 'react';

import useTranslation from '@/hooks/use-translation';

export type TBaseExtendAction = {
  title: string;
  icon?: JSX.Element;
  index?: number;
  hidden?: (_row: GridRowParams<any>) => boolean;
  onClick: (_row: GridRowParams<any>) => void;
};

type TBaseActionButtonProps = {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  hideViewAction?: boolean;
  hideEditAction?: boolean;
  hideDeleteAction?: boolean;
  extendActions?: TBaseExtendAction[];
  row: GridRowParams<any>;
};

const BaseActionButton = (props: TBaseActionButtonProps) => {
  const {
    onView,
    onEdit,
    onDelete,
    hideViewAction,
    hideEditAction,
    hideDeleteAction,
    extendActions,
    row,
  } = props;
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const listButtons = useMemo(() => {
    const commonButtons = [];
    if (!hideViewAction) {
      commonButtons.push(
        <StyledMenuItem key="view" onClick={onView}>
          <ListItemIcon>
            <ViewIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <Typography variant="body2">{t('Xem')}</Typography>
        </StyledMenuItem>,
      );
    }
    if (!hideEditAction) {
      commonButtons.push(
        <StyledMenuItem key="edit" onClick={onEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" color="info" />
          </ListItemIcon>
          <Typography variant="body2">{t('Sửa')}</Typography>
        </StyledMenuItem>,
      );
    }
    if (!hideDeleteAction) {
      commonButtons.push(
        <StyledMenuItem key="delete" onClick={onDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography variant="body2">{t('Xóa')}</Typography>
        </StyledMenuItem>,
      );
    }

    const extendButtons = R.filter(
      (action: TBaseExtendAction) => !action?.hidden?.(row),
    )(extendActions || [])?.map((action, key) => (
      <StyledMenuItem key={key} onClick={() => action.onClick(row)}>
        <ListItemIcon>{action.icon}</ListItemIcon>
        <Typography variant="body2">{action.title}</Typography>
      </StyledMenuItem>
    ));

    // merge commons and extends, then sort by index
    return R.sortBy(
      (btn: JSX.Element) => btn?.props?.index,
      R.concat(commonButtons, extendButtons),
    );
  }, [
    extendActions,
    hideDeleteAction,
    hideEditAction,
    hideViewAction,
    onDelete,
    onEdit,
    onView,
    row,
    t,
  ]);

  return (
    <div>
      <IconButton onClick={handleClick} color="primary">
        <ActionIcon />
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'center' }}
        slotProps={{ paper: { elevation: 1 } }}
      >
        <MenuList
          disablePadding
          dense
          sx={{
            p: 1,
            minWidth: '140px',
          }}
        >
          {listButtons.map((btn) => btn)}
        </MenuList>
      </Popover>
    </div>
  );
};

const StyledMenuItem = styled(MenuItem)(() => ({
  padding: `8px 16px`,
  borderRadius: `4px`,
}));

export default BaseActionButton;
