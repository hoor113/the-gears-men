"use client";

import { useQuery } from "@tanstack/react-query";
import { Paper, Typography, Box } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useTheme } from "@mui/material/styles";
import storeService from "../_services/store.service";
import appService from "@/services/app/app.service";
import { useEffect } from "react";
import StoreDescription from "./store-description";

interface StoreInfoProps {
    id: string;
}

export const StoreInfo = ({ id }: StoreInfoProps) => {
    const theme = useTheme();

    const { data: storeInfo, isLoading } = useQuery({
        queryKey: ["stores/getById", id],
        queryFn: () => storeService.getOne(id),
        enabled: !!id,
    }) as any;

    useEffect(() => {
        if (isLoading) {
            appService.showLoadingModal();
        } else {
            appService.hideLoadingModal();
        }
    }, [isLoading]);

    return (
        <Paper elevation={1} className="p-4 mb-4">
            {/* Icon + Tên + Địa chỉ */}
            <Box className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <StorefrontIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />

                <Box className="flex-1">
                    <Typography variant="h5" className="font-bold leading-tight">
                        {storeInfo?.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Địa chỉ: {storeInfo?.location}
                    </Typography>
                </Box>
            </Box>

            {/* Tiêu đề "Thông tin cửa hàng" */}
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 500, color: "text.primary" }}>
                    Thông tin cửa hàng
                </Typography>

                {storeInfo?.description && (
                    <StoreDescription html={storeInfo.description} />
                )}
            </Box>
        </Paper>
    );
};

