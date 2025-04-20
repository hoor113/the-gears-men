import {
  DeleteTwoTone as DeleteIcon,
  EditTwoTone as EditIcon,
  VisibilityTwoTone as ViewIcon,
} from '@mui/icons-material';
import {
  ListItemIcon,
  MenuItem,
  MenuList,
  Popover,
  Typography,
} from '@mui/material';

import useTranslation from '@/hooks/use-translation';

export type TExtendRudAction = {
  title: string;
  icon?: JSX.Element;
  // hidden?: (_row: GridRowParams<any>) => boolean;
  onClick: () => void;
};
type TRudActionPopoverProps = {
  anchorEl: any;
  onClose: () => void;
  open: boolean;
  onClickViewBtn?: () => void;
  onClickEditBtn?: () => void;
  onClickDeleteBtn?: () => void;
  extendActions?: TExtendRudAction[];
};

const RudActionPopover = ({
  anchorEl,
  open,
  onClose,
  onClickViewBtn,
  onClickEditBtn,
  onClickDeleteBtn,
  extendActions,
}: TRudActionPopoverProps) => {
  const { t } = useTranslation();

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      onClose={onClose}
      open={open}
    >
      <MenuList dense>
        {extendActions?.map((action, key) => (
          <MenuItem key={key} onClick={() => action.onClick()}>
            <ListItemIcon>{action.icon}</ListItemIcon>
            <Typography variant="body2">{action.title}</Typography>
          </MenuItem>
        ))}
        {onClickViewBtn && (
          <MenuItem onClick={() => onClickViewBtn()}>
            <ViewIcon sx={{ mr: 1 }} color="info" fontSize="small" />
            <Typography variant="body1" fontSize={15}>
              {t('Xem chi tiết')}
            </Typography>
          </MenuItem>
        )}

        {onClickEditBtn && (
          <MenuItem onClick={() => onClickEditBtn()}>
            <EditIcon sx={{ mr: 1 }} color="warning" fontSize="small" />
            <Typography variant="body1" fontSize={15}>
              {t('Chỉnh sửa')}
            </Typography>
          </MenuItem>
        )}

        {onClickDeleteBtn && (
          <MenuItem onClick={() => onClickDeleteBtn()}>
            <DeleteIcon sx={{ mr: 1 }} color="error" fontSize="small" />
            <Typography variant="body1" fontSize={15}>
              {t('Xóa')}
            </Typography>
          </MenuItem>
        )}
      </MenuList>
    </Popover>
  );
};

export default RudActionPopover;
