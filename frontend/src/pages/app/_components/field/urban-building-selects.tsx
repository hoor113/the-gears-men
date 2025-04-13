import {
  Autocomplete,
  Box,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';

import useTranslation from '@/hooks/use-translation';
import useGetAllBuildings from '@/services/buildings/use-get-all-buildings';
import useGetAllUrbans from '@/services/urban/use-get-all-urbans';

type TUrbanBuildingSelectsProps = {
  urbanFieldProps?: TextFieldProps;
  buildingFieldProps?: TextFieldProps;
  value?: { urbanId?: number; buildingId?: number };
  onChange?: (_v?: { urbanId?: number; buildingId?: number }) => void;
};

const UrbanBuildingSelects = ({
  onChange,
  value,
  urbanFieldProps,
  buildingFieldProps,
}: TUrbanBuildingSelectsProps) => {
  const { t } = useTranslation();
  const urbansQuery = useGetAllUrbans({
    maxResultCount: 1000,
  });
  const buildingsQuery = useGetAllBuildings({
    pageSize: 1000,
  });
  const allUrbanData = urbansQuery?.data?.data || [];
  const allBuildingData = (buildingsQuery?.data?.data || []).filter((b) =>
    value?.urbanId ? b.urbanId === value?.urbanId : true,
  );
  const isUrbanHasNoBuilding = !!value?.urbanId && !allBuildingData?.length;

  const foundUrban = allUrbanData.find(
    (item) => !!value?.urbanId && item.id === value.urbanId,
  );
  const foundBuilding = allBuildingData.find(
    (item) => !!value?.buildingId && item.id === value.buildingId,
  );

  return (
    <Stack direction="row" spacing={2} mb={2}>
      <Autocomplete
        key={String(value?.urbanId) + 'urbanId'}
        options={allUrbanData}
        value={foundUrban}
        isOptionEqualToValue={(o, v) => o.id === v?.id}
        autoHighlight
        fullWidth
        getOptionLabel={(o) => o.displayName}
        onChange={(_e, o, reason) => {
          if (o?.id) onChange?.({ urbanId: o.id, buildingId: undefined });
          if (reason === 'clear')
            onChange?.({ urbanId: undefined, buildingId: undefined });
        }}
        disableClearable={false}
        renderInput={(params) => (
          <TextField {...params} label={t('Khu đô thị')} {...urbanFieldProps} />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={JSON.stringify(option)}>
            <Typography variant="caption" fontSize={16}>
              {option.displayName}
            </Typography>
          </Box>
        )}
      />

      <Autocomplete
        key={String(value?.buildingId) + 'buildingId'}
        options={allBuildingData}
        value={foundBuilding}
        isOptionEqualToValue={(o, v) => o.id === v?.id}
        autoHighlight
        fullWidth
        getOptionLabel={(o) => o.displayName}
        onChange={(_e, o, reason) => {
          if (o?.id) {
            if (!value?.urbanId) {
              onChange?.({ urbanId: o!.urbanId, buildingId: o.id });
            } else {
              onChange?.({ ...value, buildingId: o.id });
            }
          }
          if (reason === 'clear')
            onChange?.({ ...value, buildingId: undefined });
        }}
        disableClearable={false}
        disabled={isUrbanHasNoBuilding}
        renderInput={(params) => (
          <TextField
            {...params}
            variant={isUrbanHasNoBuilding ? 'filled' : 'outlined'}
            label={
              value?.urbanId
                ? allBuildingData.length
                  ? `Có ${allBuildingData.length} tòa nhà`
                  : `Không có tòa nhà`
                : t('Tòa nhà')
            }
            {...buildingFieldProps}
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={JSON.stringify(option)}>
            <Typography variant="caption" fontSize={16}>
              {option.displayName}
            </Typography>
          </Box>
        )}
      />
    </Stack>
  );
};

export default UrbanBuildingSelects;
