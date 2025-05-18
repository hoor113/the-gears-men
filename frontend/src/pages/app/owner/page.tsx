import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import StorefrontIcon from "@mui/icons-material/Storefront";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useStore } from "./store/_services/store.context";
import storeService from "./store/_services/store.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import BasePagination from "@/base/base-pagination";
import appService from "@/services/app/app.service";
import { IStore } from "./store/_services/store.model";
import AddStoreModal from "./store/_components/add-store-modal";
import useAuth from "@/hooks/use-auth";
import NiceModal from "@ebay/nice-modal-react";
import EditStoreModal from "./store/_components/edit-store-modal";
import ConfirmModal from "@/components/confirm-modal";
import { enqueueSnackbar } from "notistack";

const OwnerPage = () => {
  const authQuery = useAuth();
  const queryClient = useQueryClient();
  const ownerId = useMemo(() => authQuery.data?.id, [authQuery.data]);
  const ownerName = useMemo(() => authQuery.data?.fullname, [authQuery.data]);
  const navigate = useNavigate();
  const [_, storeDispatch] = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;


  useEffect(() => {
    storeDispatch({ type: "CLEAR_STORE" });
  }, [storeDispatch]);

  const { data: stores = [], isLoading } = useQuery<any>({
    queryKey: ["owner/stores/GetAll"],
    queryFn: () => storeService.getMyStore(),
  });



  const { mutate, isLoading: deleteMutationLoading } = useMutation({
    mutationFn: (id: any) => storeService.delete(id),
    onSuccess: () => {
      appService.hideLoadingModal();
      enqueueSnackbar("Xóa cửa hàng thành công", {
        variant: "success",
      });
      queryClient.refetchQueries(["owner/stores/GetAll"]);
    },
    onError: (err: any) => {
      appService.hideLoadingModal();
      window.location.href = `/customer/payment/fail`;
      enqueueSnackbar(err.response.data.message || 'Đã có lỗi xảy ra', {
        variant: 'error',
      });
    },
  });

  useEffect(() => {
    if (isLoading || deleteMutationLoading) {
      appService.showLoadingModal();
    }
    if (!isLoading && !deleteMutationLoading) {
      appService.hideLoadingModal();
    }
  }, [isLoading, deleteMutationLoading]);

  const handleDeleteStore = (storeId: string) => {
    NiceModal.show(ConfirmModal, {
      title: "Bạn có chắc chắn muốn xóa cửa hàng này không?",
      btn2Click: () => mutate(storeId),
    });
  }


  const paginatedStores = stores.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleLoginStore = (store: IStore) => {
    storeDispatch({
      type: "SET_STORE",
      payload: store,
    });
    navigate(`/owner/store/${store.id}`);
  }

  return (
    <Box sx={{ backgroundColor: "#f0f0f0", minHeight: "100vh", p: 3 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Quản lý cửa hàng
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => NiceModal.show(AddStoreModal, { ownerId, ownerName })}
        >
          Thêm cửa hàng
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Danh sách cửa hàng
        </Typography>

        {paginatedStores.map((store: IStore) => (
          <Box
            key={store.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #ddd",
              py: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <StorefrontIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography fontWeight={600}>{store.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {store.location}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={() => NiceModal.show(EditStoreModal, { ownerId, ownerName, row: store })}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteStore(store.id)}>
                <DeleteIcon color="error" />
              </IconButton>
              <Button
                variant="contained"
                onClick={() => handleLoginStore(store)}
              >
                Truy cập
              </Button>
            </Box>
          </Box>
        ))}

        <Box mt={3} display="flex" justifyContent="center">
          <BasePagination
            currentPage={currentPage}
            totalPages={Math.ceil(stores.length / pageSize)}
            onPageChange={setCurrentPage}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default OwnerPage;
