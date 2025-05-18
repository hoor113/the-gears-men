// src/app/(dashboard)/owner/_components/select-store.tsx
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import appService from '@/services/app/app.service';

import { useStore } from '../store/_services/store.context';
import { IStore } from '../store/_services/store.model';
import storeService from '../store/_services/store.service';

interface SelectStoreProps {
  store?: IStore | null;
}

export default function SelectStore({ store }: SelectStoreProps) {
  const [storeState, storeDispatch] = useStore();
  const navigate = useNavigate();
  const { data: storeList = [], isLoading } = useQuery<any>({
    queryKey: ['stores/GetAll'],
    queryFn: () => storeService.getMyStore(),
  });

  useEffect(() => {
    if (isLoading) {
      appService.showLoadingModal;
    }
    if (!isLoading) {
      appService.hideLoadingModal();
    }
  }, [isLoading]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const storeId = event.target.value;
    const store =
      storeList.find((s: IStore | null) => s?.id === storeId) || null;
    storeDispatch({
      type: 'SET_STORE',
      payload: store,
    });
    navigate(`/owner/store/${storeId}`);
  };

  const selectedStore = store ?? storeState.store;

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel
        id="select-store-label"
        sx={{ color: 'black', fontWeight: 500 }}
      >
        Chọn cửa hàng
      </InputLabel>
      <Select
        labelId="select-store-label"
        value={selectedStore?.id || ''}
        label="Cửa hàng"
        onChange={handleChange}
        disabled={isLoading}
        sx={{
          backgroundColor: 'white',
          color: 'black',
          borderRadius: 1,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ccc',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#888',
          },
          '& .MuiSelect-icon': {
            color: 'black',
          },
          '& .MuiSelect-select': {
            paddingY: '6px',
          },
        }}
      >
        {storeList.map((store: IStore) => (
          <MenuItem key={store.id} value={store.id}>
            <div>
              <Typography fontWeight="bold">{store.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {store.location}
              </Typography>
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
