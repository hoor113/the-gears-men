import { Box, Typography, styled, Chip } from '@mui/material';
import { EShipmentStatus } from '@/services/shipment/shipment.model';
import useTranslation from '@/hooks/use-translation';
import ErrorIcon from '@mui/icons-material/Error';

interface ShipmentStatusGraphProps {
  status: EShipmentStatus;
}

const StatusContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: '450px', // Make it narrower
  margin: '0 auto', // Center it
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  position: 'relative',
}));

const StatusNode = styled(Box)<{ 
  active: boolean; 
  completed: boolean;
  failed: boolean;
}>(({ theme, active, completed, failed }) => ({
  width: 20, // Smaller nodes
  height: 20, // Smaller nodes
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  backgroundColor: failed 
    ? theme.palette.error.main 
    : (active || completed) 
      ? theme.palette.success.main 
      : theme.palette.grey[300],
  border: `2px solid ${failed 
    ? theme.palette.error.main 
    : (active || completed) 
      ? theme.palette.success.main 
      : theme.palette.grey[400]
  }`,
  zIndex: 2,
  fontSize: '0.6rem',
  color: (active || completed || failed) ? 'white' : theme.palette.text.secondary,
}));

const StatusLine = styled(Box)<{ 
  completed: boolean;
  failed: boolean;
}>(({ theme, completed, failed }) => ({
  height: 2,
  width: '100%', // Use fixed width to make it narrower
  maxWidth: '120px', // Limit width between nodes
  backgroundColor: failed
    ? theme.palette.error.main
    : completed
      ? theme.palette.success.main
      : theme.palette.grey[300],
  zIndex: 1,
}));

const StatusLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.65rem', // Smaller text
  marginTop: theme.spacing(0.5),
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  whiteSpace: 'nowrap',
  width: '70px', // Fixed width for labels
  textAlign: 'center',
}));

const FailureChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: '-24px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  fontSize: '0.75rem',
  height: '22px',
}));

export default function ShipmentStatusGraph({ status }: ShipmentStatusGraphProps) {
  const { t } = useTranslation();
  
  const isFailed = status === EShipmentStatus.Failed;
  
  const getNodeStatus = (nodeStatus: EShipmentStatus) => {
    const statuses = [
      EShipmentStatus.Pending,
      EShipmentStatus.Confirmed,
      EShipmentStatus.Stored,
      EShipmentStatus.Delivered
    ];
    
    const currentIndex = statuses.indexOf(status);
    const nodeIndex = statuses.indexOf(nodeStatus);
    
    if (isFailed) {
      return { active: false, completed: false, failed: true };
    }
    
    return {
      active: currentIndex === nodeIndex,
      completed: currentIndex > nodeIndex,
      failed: false
    };
  };

  const renderNode = (nodeStatus: EShipmentStatus, label: string) => {
    const { active, completed, failed } = getNodeStatus(nodeStatus);
    return (
      <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <StatusNode active={active} completed={completed} failed={failed}>
          {active && !failed ? '✓' : ''}
        </StatusNode>
        <StatusLabel color={active ? 'primary' : failed ? 'error' : 'textSecondary'}>
          {label}
        </StatusLabel>
      </Box>
    );
  };
  
  const renderLine = (fromStatus: EShipmentStatus, toStatus: EShipmentStatus) => {
    const fromIndex = [
      EShipmentStatus.Pending,
      EShipmentStatus.Confirmed,
      EShipmentStatus.Stored,
      EShipmentStatus.Delivered
    ].indexOf(fromStatus);
    
    const currentIndex = [
      EShipmentStatus.Pending,
      EShipmentStatus.Confirmed,
      EShipmentStatus.Stored,
      EShipmentStatus.Delivered
    ].indexOf(status);
    
    return (
      <StatusLine 
        completed={currentIndex > fromIndex} 
        failed={status === EShipmentStatus.Failed}
      />
    );
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
      {isFailed && (
        <FailureChip 
          icon={<ErrorIcon fontSize="small" />} 
          label={t('Giao hàng thất bại')}
          size="small" 
        />
      )}
      <StatusContainer>
        {renderNode(EShipmentStatus.Pending, t('Chờ xử lý'))}
        {renderLine(EShipmentStatus.Pending, EShipmentStatus.Confirmed)}
        {renderNode(EShipmentStatus.Confirmed, t('Đã xác nhận'))}
        {renderLine(EShipmentStatus.Confirmed, EShipmentStatus.Stored)}
        {renderNode(EShipmentStatus.Stored, t('Đang giao'))}
        {renderLine(EShipmentStatus.Stored, EShipmentStatus.Delivered)}
        {renderNode(EShipmentStatus.Delivered, t('Đã giao'))}
      </StatusContainer>
    </Box>
  );
}