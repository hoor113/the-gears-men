import { Chip } from "@mui/material";
import { EShipmentStatus } from "../_services/shipment.model";

const statusColorMap: Record<
    EShipmentStatus,
    "default" | "info" | "warning" | "success" | "error"
> = {
    [EShipmentStatus.Pending]: "default",
    [EShipmentStatus.Confirmed]: "info",
    [EShipmentStatus.Stored]: "warning",
    [EShipmentStatus.Delivered]: "success",
    [EShipmentStatus.Failed]: "error",
};

const statusLabelMap: Record<EShipmentStatus, string> = {
    [EShipmentStatus.Pending]: "Chờ duyệt",
    [EShipmentStatus.Confirmed]: "Đã xác nhận",
    [EShipmentStatus.Stored]: "Đang giao",
    [EShipmentStatus.Delivered]: "Đã giao",
    [EShipmentStatus.Failed]: "Đã hủy",
};

export const ShipmentStatusChip = ({ status }: { status: EShipmentStatus }) => {
    return (
        <Chip
            label={statusLabelMap[status] || status}
            color={statusColorMap[status]}
            variant="outlined"
            size="small"
            sx={{
                fontWeight: 500,
                px: 1.5,
                borderRadius: 1.5,
            }}
        />
    );
};
