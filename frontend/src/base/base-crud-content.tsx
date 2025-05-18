import NiceModal from '@ebay/nice-modal-react';
import {
  AddCircleRounded as AddCircleRoundedIcon,
  ArrowDropDownRounded as ArrowDropDownRoundedIcon,
  DeleteSweepTwoTone as DeleteMultipleIcon,
  OutboxRounded as ExportIcon,
  FilterAltTwoTone as FilterIcon,
  MoveToInboxRounded as ImportIcon,
  SearchTwoTone as SearchIcon,
} from '@mui/icons-material';
import {
  Box,
  Breakpoint,
  Button,
  IconButton,
  InputAdornment,
  Pagination,
  Stack,
  SxProps,
  TextField,
  Typography,
  TypographyProps,
  styled,
} from '@mui/material';
import { GridPagination, GridRowParams, useGridApiRef } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import * as R from 'rambda';
import { useCallback, useEffect, useState } from 'react';
import { useUpdateEffect } from 'react-use';

import ConfirmModal from '@/components/confirm-modal';
// import { useCheckPermission } from '@/hooks/use-check-permission';
import useLoading from '@/hooks/use-loading';
import usePopover from '@/hooks/use-popover';
import useTranslation from '@/hooks/use-translation';
import { convertFieldsToValues, removeEmptyKeys } from '@/services/utils';

import BaseActionButton, { TBaseExtendAction } from './base-action-button';
import BaseCrudFilterPopover from './base-crud-filter-form';
import BaseCrudFormModal, {
  TBaseCrudFormModalProps,
} from './base-crud-form-modal';
import { BaseCrudService } from './base-crud-service';
import BaseImportExcelModal from './base-import-excel-modal';
import BaseSort from './base-sort';
import {
  StyledPaginationCard,
  StyledPaginationWrapper,
} from './base-styled-components';
import BaseStyledTable from './base-styled-table';
import { ILVPair, IPaginatedItems, TBaseCrudCol } from './base.model';
import {
  ESortBy,
  TCrudFormField,
  TCrudFormSchema,
} from './crud-form-field.type';

export type TBaseCrudContentProps = {
  title: string;
  name: string;
  unitName: string;
  service: BaseCrudService;
  mode?: 'table' | 'card';
  columns?: TBaseCrudCol[];
  CardContainerComp?: React.FC<any>;
  cardContainerProps?: {
    [key: string]: any;
  };
  CardItemComp?: React.FC<any>;
  cardItemProps?: {
    [key: string]: any;
  };
  defaultGetAllParams?: any;
  noPagination?: boolean;
  filterFields?: TCrudFormField[];
  sortFields?: ILVPair<string | number>[];
  hasCustomActions?: boolean;
  hideAddBtn?: boolean;
  hideDeleteManyBtn?: boolean;
  hideSelectRowCheckbox?: boolean;
  hideImportExcelBtn?: boolean;
  hideExportExcelBtn?: boolean;
  hideSearchInput?: boolean;
  viewFields?: TCrudFormField[];
  viewTabFields?: {
    label: string;
    fields: TCrudFormField[];
  }[];
  beautyView?: boolean;
  createFields?: TCrudFormField[];
  createTabFields?: {
    label: string;
    fields: TCrudFormField[];
  }[];
  updateFields?: TCrudFormField[];
  updateTabFields?: {
    label: string;
    fields: TCrudFormField[];
  }[];
  createSchema?: TCrudFormSchema;
  updateSchema?: TCrudFormSchema;
  getAllPath?: string;
  getOnePath?: string;
  createPath?: string;
  updatePath?: string;
  deletePath?: string;
  deleteManyPath?: string;
  importExcelPath?: string;
  templateImportExcelUrl?: string;
  importExcelData?: any;
  exportExcelPath?: string;
  formWidth?: Breakpoint | false;
  beautyViewFormWidth?: Breakpoint | false;
  hideViewAction?: ((_row: GridRowParams) => boolean) | boolean;
  hideEditAction?: ((_row: GridRowParams) => boolean) | boolean;
  hideDeleteAction?: ((_row: GridRowParams) => boolean) | boolean;
  extendActions?:
    | ((_row: GridRowParams) => TBaseExtendAction[])
    | TBaseExtendAction[];
  onClickAddBtn?: () => void;
  onClickImportExcelBtn?: () => void;
  onClickExportExcelBtn?: () => void;
  onClickViewBtn?: (_row: GridRowParams) => void;
  onClickEditBtn?: (_row: GridRowParams) => void;
  onClickDeleteBtn?: (_row: GridRowParams) => void;
  isRowSelectable?: (_row: GridRowParams) => boolean;
  FormActionButtons?: JSX.Element;
  rowKey?: string;
  onCloseForm?: () => void;
  onCloseFilter?: () => void;
  onClearFilter?: () => void;
  onSubmitFilter?: () => void;
  setFetchedData?: (_data?: IPaginatedItems<any>) => void;
  setRefetchData?: (_refetchData: () => void) => void;
  titleProps?: Pick<TypographyProps, 'sx' | 'variant'>;
  extraSelectedActions?: (
    _selectedRows?: any[],
    _setSelectedRows?: (_selectedRows: any[]) => void,
    _setSelectedRowIds?: (_selectedRowIds: any[]) => void,
  ) => React.ReactNode;
  headerContents?: () => React.ReactNode;
  stickyLastCol?: boolean;
  sx?: SxProps;
  permissionName?: string;
};

const BaseCrudContent = (props: TBaseCrudContentProps) => {
  const {
    title,
    name,
    unitName,
    service,
    mode = 'table',
    CardContainerComp,
    cardContainerProps,
    CardItemComp,
    cardItemProps,
    defaultGetAllParams,
    noPagination,
    sortFields,
    filterFields,
    hideAddBtn,
    hideSelectRowCheckbox,
    hideDeleteManyBtn,
    hideImportExcelBtn,
    hideExportExcelBtn,
    hideSearchInput,
    hasCustomActions,
    viewFields,
    viewTabFields,
    beautyView,
    createFields,
    createTabFields,
    updateFields,
    updateTabFields,
    createSchema,
    updateSchema,
    formWidth,
    beautyViewFormWidth,
    FormActionButtons,
    getAllPath,
    getOnePath,
    deleteManyPath,
    createPath,
    updatePath,
    deletePath,
    templateImportExcelUrl,
    importExcelPath,
    importExcelData,
    exportExcelPath,
    hideViewAction,
    hideEditAction,
    hideDeleteAction,
    extendActions,
    rowKey,
    setFetchedData,
    setRefetchData,
    titleProps,
    extraSelectedActions,
    headerContents,
    isRowSelectable,
    stickyLastCol,
    sx,
    // permissionName,
  } = props;

  const columns = R.filter(
    (col: TBaseCrudCol) => !col.hide,
    props.columns || [],
  );
  const apiRef = useGridApiRef();

  const { t } = useTranslation();

  // const {
  //   hasPermissionDelete,
  //   hasPermissionCreate,
  //   hasPermissionEdit,
  //   hasPermissionGetDetail,
  // } = useCheckPermission(permissionName);

  const [params, setParams] = useState({
    page: defaultGetAllParams?.page || 0,
    pageSize: defaultGetAllParams?.pageSize || 10,
    ...convertFieldsToValues(filterFields || []),
  });
  let { page, pageSize, ...filter } = params;
  page = +page || 0;
  pageSize = +pageSize || 10;
  filter = filter || convertFieldsToValues(filterFields || []);

  const [search, setSearch] = useState<string>(params?.keyWord || '');
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedRowModels, setSelectedRowModels] = useState<any[]>([]);
  useEffect(() => {
    if (selectedRows.length) {
      const models = Array.from(apiRef.current?.getSelectedRows()).flatMap(
        ([_GridRowId, GridValidRowModel]) => GridValidRowModel,
      );
      setSelectedRowModels(models);
    } else {
      setSelectedRowModels([]);
    }
  }, [selectedRows, apiRef]);

  const [uploadedExcelFile, setUploadedExcelFile] = useState<File | null>(null);
  const [openUploadExcelModal, setOpenUploadExcelModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number>();
  const [count, setCount] = useState(0);

  const [formProps, setFormProps] = useState<Partial<TBaseCrudFormModalProps>>({
    open: false,
    onClose: () => setFormProps((old) => ({ ...old, open: false })),
  });

  const filterPopover = usePopover();

  const getAllQuery = useQuery({
    queryKey: [
      `${name}/getAll`,
      { ...defaultGetAllParams, page, pageSize, ...filter },
    ],
    queryFn: () =>
      service.getAll<any>(
        removeEmptyKeys({
          ...defaultGetAllParams,
          page: noPagination ? undefined : page,
          pageSize: noPagination ? undefined : pageSize,
          ...filter,
        }),
        getAllPath,
      ),
    keepPreviousData: true,
    staleTime: Infinity,
  });

  const getOneQuery = useQuery({
    queryKey: [`${name}/getOne`, selectedItemId],
    queryFn: () => service.getOne<any>(selectedItemId as number, getOnePath),
    enabled:
      !!getOnePath &&
      !!selectedItemId &&
      (formProps.mode === 'view' || formProps.mode === 'edit'),
    staleTime: Infinity,
    select(data) {
      return data?.data;
    },
  });

  const refetchGetOne = useCallback(() => {
    if (!!getOnePath && !!selectedItemId) {
      getOneQuery.refetch();
    }
  }, [getOnePath, getOneQuery, selectedItemId]);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => service.delete(id, deletePath),
    onSuccess: () => {
      enqueueSnackbar(t('Xóa thành công'), { variant: 'success' });
      getAllQuery.refetch();
    },
    onError: () => {
      enqueueSnackbar(t('Xóa thất bại'), { variant: 'error' });
    },
  });

  const deleteManyMutation = useMutation({
    mutationFn: (ids: any[]) => service.deleteMany(ids, deleteManyPath),
    onSuccess: () => {
      setSelectedRows([]);
      setSelectedRowModels([]);
      enqueueSnackbar(t('Xóa thành công'), { variant: 'success' });
      getAllQuery.refetch();
    },
    onError: () => {
      enqueueSnackbar(t('Xóa thất bại'), { variant: 'error' });
    },
  });

  const importExcelMutation = useMutation({
    mutationFn: (file: File) =>
      service.importExcel(file, importExcelData, importExcelPath),
    onError: () => enqueueSnackbar(t('Đã có lỗi xảy ra'), { variant: 'error' }),
    onSuccess: async () => {
      enqueueSnackbar(t('Nhập excel thành công'), {
        variant: 'success',
      });
      setOpenUploadExcelModal(false);
      setUploadedExcelFile(null);
      await getAllQuery.refetch();
    },
  });

  const onSubmitSearch = useCallback(() => {
    setParams({
      ...params,
      keyWord: search,
    });
  }, [params, search, setParams]);

  const onCloseFormModal = useCallback(() => {
    setFormProps((old) => ({ ...old, open: false }));
    props.onCloseForm && props.onCloseForm();
  }, [props]);

  const onClickAddBtn = useCallback(() => {
    props?.onClickAddBtn
      ? props?.onClickAddBtn()
      : setFormProps({
          open: true,
          onClose: onCloseFormModal,
          name,
          mode: 'create',
          title: `${t('Thêm')} ${unitName}`,
          fields: createFields,
          tabFields: createTabFields,
          service,
          schema: createSchema,
          maxWidth: formWidth,
          ActionButtons: FormActionButtons,
          createPath,
          refetchData: () => getAllQuery.refetch(),
        });
  }, [
    props,
    onCloseFormModal,
    name,
    t,
    unitName,
    createFields,
    createTabFields,
    service,
    createSchema,
    formWidth,
    FormActionButtons,
    createPath,
    getAllQuery,
  ]);

  const convertItemToGridRow = useCallback(
    (item: any) => {
      return {
        ...item,
        id: item[rowKey || 'id'],
      };
    },
    [rowKey],
  );

  const onClickViewBtn = useCallback(
    (row: GridRowParams) => {
      const id = row.id as number;

      setSelectedItemId(id);
      setCount((old) => old + 1);

      props?.onClickViewBtn
        ? props?.onClickViewBtn(row)
        : setFormProps({
            open: true,
            onClose: onCloseFormModal,
            name,
            mode: 'view',
            title: `${t('Xem')} ${unitName}`,
            service,
            fields: viewFields,
            tabFields: viewTabFields,
            defaultValues: !getOnePath
              ? getAllQuery?.data?.data?.find((item: any) => item.id === id) ||
                getAllQuery?.data?.items?.find((item: any) => item.id === id)
              : {},
            maxWidth:
              beautyView && !!beautyViewFormWidth
                ? beautyViewFormWidth
                : formWidth,
            ActionButtons: FormActionButtons,
          });
    },
    [
      props,
      onCloseFormModal,
      name,
      t,
      unitName,
      service,
      viewFields,
      viewTabFields,
      getOnePath,
      getAllQuery?.data?.data,
      getAllQuery?.data?.items,
      beautyView,
      beautyViewFormWidth,
      formWidth,
      FormActionButtons,
    ],
  );

  const onClickEditBtn = useCallback(
    (row: GridRowParams) => {
      const id = row.id as number;

      setSelectedItemId(id);
      setCount((old) => old + 1);

      props?.onClickEditBtn
        ? props?.onClickEditBtn(row)
        : setFormProps({
            open: true,
            onClose: onCloseFormModal,
            name,
            mode: 'edit',
            title: `${t('Sửa')} ${unitName}`,
            fields: updateFields,
            tabFields: updateTabFields,
            service,
            schema: updateSchema,
            defaultValues: !getOnePath
              ? getAllQuery?.data?.data?.find((item: any) => item.id === id) ||
                getAllQuery?.data?.items?.find((item: any) => item.id === id)
              : {},
            maxWidth: formWidth,
            ActionButtons: FormActionButtons,
            createPath,
            updatePath,
            refetchData: () => getAllQuery.refetch(),
            refetchOne: () => refetchGetOne(),
          });
    },
    [
      props,
      onCloseFormModal,
      name,
      t,
      unitName,
      updateFields,
      updateTabFields,
      service,
      updateSchema,
      getOnePath,
      getAllQuery,
      formWidth,
      FormActionButtons,
      createPath,
      updatePath,
      refetchGetOne,
    ],
  );

  const onClickDeleteBtn = useCallback(
    (row: GridRowParams) => {
      const id = row.id as number;

      props?.onClickDeleteBtn
        ? props?.onClickDeleteBtn(row)
        : NiceModal.show(ConfirmModal, {
            title: t('Bạn có chắc muốn xóa'),
            btn2Variant: 'contained',
            btn2Click: () => deleteMutation.mutate(id),
            children: <></>,
          });
    },
    [props, t, deleteMutation],
  );

  const onClickImportExcelBtn = useCallback(() => {
    props?.onClickImportExcelBtn
      ? props?.onClickImportExcelBtn()
      : setOpenUploadExcelModal(true);
  }, [props]);

  const onSubmitImportExcel = useCallback(async () => {
    if (uploadedExcelFile) {
      importExcelMutation.mutate(uploadedExcelFile);
    }
  }, [importExcelMutation, uploadedExcelFile]);

  const onClickExportExcelBtn = useCallback(async () => {
    props?.onClickExportExcelBtn
      ? props?.onClickExportExcelBtn()
      : service.exportExcel(filter, exportExcelPath, selectedRows || []);
  }, [exportExcelPath, filter, props, selectedRows, service]);

  useLoading({
    showConditionsSome: [
      getAllQuery.isFetching,
      getOneQuery.isFetching,
      deleteMutation.isLoading,
      deleteManyMutation.isLoading,
    ],
    hideConditionsEvery: [
      !getAllQuery.isFetching,
      !getOneQuery.isFetching,
      !deleteMutation.isLoading,
      !deleteManyMutation.isLoading,
    ],
  });

  useEffect(() => {
    setFetchedData && setFetchedData(getAllQuery.data);
  }, [getAllQuery.data, setFetchedData]);

  useEffect(() => {
    setRefetchData && setRefetchData(() => getAllQuery.refetch);
  }, [getAllQuery.refetch, setRefetchData]);

  useEffect(() => {
    if (getOneQuery.data?.id) {
      setFormProps((old) => ({
        ...old,
        defaultValues: getOneQuery.data,
      }));
    }
  }, [getOneQuery.data, count]);

  useUpdateEffect(() => {
    setFormProps((old) => ({
      ...old,
      fields:
        old.mode === 'create'
          ? createFields
          : old.mode === 'view'
            ? viewFields
            : updateFields,
      tabFields:
        old.mode === 'create'
          ? createTabFields
          : old.mode === 'view'
            ? viewTabFields
            : updateTabFields,
    }));
  }, [
    formProps.mode,
    createFields,
    updateFields,
    viewFields,
    createTabFields,
    updateTabFields,
    viewTabFields,
  ]);

  return (
    <Stack sx={{ mb: 2, minHeight: `calc(100dvh - 80px)`, ...sx }}>
      <StyledPageHeader>
        <div
          className="top-wrapper"
          style={{
            marginBottom: !title && hideSearchInput ? 0 : 16,
          }}
        >
          {!!title && (
            <Typography variant="h5" component="h1" {...titleProps}>
              {title}
            </Typography>
          )}

          {hideSearchInput ? null : (
            <TextField
              size="small"
              placeholder={t('Tìm kiếm')}
              sx={{
                width: 400,
                '.MuiInputBase-root': {
                  bgcolor: 'grey.100',
                },
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSubmitSearch();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() => onSubmitSearch()}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="start"
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        </div>

        <div className="bottom-wrapper">
          <div className="left-wrapper">
            {!hideAddBtn && (
              <Button
                startIcon={<AddCircleRoundedIcon />}
                variant="contained"
                onClick={onClickAddBtn}
                sx={{
                  pl: 2.2,
                  mr: 1,
                }}
              >
                {t('Thêm')}
              </Button>
            )}

            <Stack direction="row" spacing={1}>
              {!hideDeleteManyBtn && (
                <Button
                  color="error"
                  variant="soft"
                  startIcon={<DeleteMultipleIcon />}
                  style={{
                    display: !selectedRows?.length ? 'none' : undefined,
                  }}
                  onClick={() => {
                    NiceModal.show(ConfirmModal, {
                      title: t('Bạn có chắc muốn xóa'),
                      btn2Variant: 'contained',
                      btn2Click: () => deleteManyMutation.mutate(selectedRows),
                      children: <></>,
                    });
                  }}
                >
                  {t('Xóa đã chọn')}
                </Button>
              )}
              {extraSelectedActions?.(
                selectedRowModels,
                setSelectedRowModels,
                setSelectedRows,
              ) || <></>}
            </Stack>
          </div>

          <Box
            className="right-wrapper"
            // divider={<Divider orientation="vertical" flexItem />}
          >
            <>
              {hideImportExcelBtn ? null : (
                <Button
                  variant="soft"
                  startIcon={<ImportIcon />}
                  onClick={onClickImportExcelBtn}
                  color="primary"
                >
                  {t('Nhập Excel')}
                </Button>
              )}
              {hideExportExcelBtn ? null : (
                <Button
                  variant="soft"
                  startIcon={<ExportIcon />}
                  onClick={onClickExportExcelBtn}
                  color="primary"
                >
                  {t('Xuất Excel')}
                </Button>
              )}
            </>

            {filterFields && (
              <>
                <Button
                  ref={filterPopover.anchorRef}
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  endIcon={
                    <ArrowDropDownRoundedIcon sx={{ width: 26, height: 26 }} />
                  }
                  onClick={filterPopover.handleOpen}
                  sx={{
                    fontSize: 15,
                    height: 42.5,
                    justifyContent: 'stretch',
                    width: 122,
                    '.MuiButton-endIcon': {
                      ml: 'auto',
                      mr: -1.6,
                    },
                  }}
                >
                  {t('Lọc')}
                </Button>

                <BaseCrudFilterPopover
                  anchorEl={filterPopover.anchorRef.current}
                  open={filterPopover.open}
                  onClose={() => {
                    filterPopover.handleClose();
                    props.onCloseFilter && props.onCloseFilter();
                  }}
                  fields={filterFields}
                  filter={filter}
                  onSubmit={(result) => {
                    setParams({
                      ...params,
                      ...result,
                    });
                    props.onSubmitFilter && props.onSubmitFilter();
                  }}
                  onClearFilter={() => {
                    setParams({
                      page,
                      pageSize,
                      keyWord: filter.keyWord,
                      orderBy: filter.orderBy,
                      tab: params?.tab,
                    });
                    props.onClearFilter && props.onClearFilter();
                  }}
                />
              </>
            )}

            {sortFields && (
              <BaseSort
                options={
                  sortFields.flatMap((item) => [
                    {
                      ...item,
                      label: `🔼 ${item.label} (${t('tăng dần')})`,
                      value: JSON.stringify({
                        orderBy: item.value,
                        sortBy: ESortBy.ASC,
                      }),
                    },
                    {
                      ...item,
                      label: `🔽 ${item.label} (${t('giảm dần')})`,
                      value: JSON.stringify({
                        orderBy: item.value,
                        sortBy: ESortBy.DESC,
                      }),
                    },
                  ]) || []
                }
                placeholder={t('Sắp xếp')}
                onChange={(data) => {
                  if (data?.value) {
                    setParams({
                      ...params,
                      orderBy: JSON.parse(data.value).orderBy,
                      sortBy: JSON.parse(data.value).sortBy,
                    });
                  } else {
                    setParams({
                      ...params,
                      orderBy: undefined,
                      sortBy: undefined,
                    });
                  }
                }}
              />
            )}
          </Box>
        </div>
        <div className="bottom-wrapper">
          <Stack direction="row" spacing={1}>
            {headerContents?.() || <></>}
          </Stack>
        </div>
      </StyledPageHeader>

      {mode === 'table' && columns && (
        <StyledTableWrapper>
          <BaseStyledTable
            apiRef={apiRef}
            columns={
              hasCustomActions
                ? columns
                : [
                    ...columns,
                    {
                      field: 'actions',
                      type: 'actions',
                      headerName: t('Hành động'),
                      flex: 1,
                      width: 100,
                      minWidth: 100,
                      maxWidth: 100,
                      getActions: (row) => {
                        const mappedExtendActions =
                          typeof extendActions === 'function'
                            ? extendActions(row)
                            : extendActions;
                        return [
                          // hasPermissionCreate ||
                          // hasPermissionEdit ||
                          // hasPermissionDelete ||
                          <BaseActionButton
                            key={row.id}
                            onView={() => onClickViewBtn(row)}
                            onEdit={() => onClickEditBtn(row)}
                            onDelete={() => onClickDeleteBtn(row)}
                            hideViewAction={
                              typeof hideViewAction === 'function'
                                ? hideViewAction(row)
                                : hideViewAction
                            }
                            hideEditAction={
                              typeof hideEditAction === 'function'
                                ? hideEditAction(row)
                                : hideEditAction
                            }
                            hideDeleteAction={
                              typeof hideDeleteAction === 'function'
                                ? hideDeleteAction(row)
                                : hideDeleteAction
                            }
                            extendActions={mappedExtendActions}
                            row={row}
                          />,
                        ];
                      },
                    },
                  ]
            }
            rows={getAllQuery?.data?.data || getAllQuery?.data?.items || []}
            rowCount={
              getAllQuery?.data?.totalRecords ||
              getAllQuery?.data?.totalCount ||
              0
            }
            initialState={{
              pagination: {
                paginationModel: {
                  page: 0,
                  pageSize: 10,
                },
              },
            }}
            paginationModel={{
              page,
              pageSize,
            }}
            onPaginationModelChange={(model) => {
              setParams({
                ...params,
                page: model.page,
                pageSize: model.pageSize,
              });
            }}
            checkboxSelection={!hideSelectRowCheckbox}
            onRowSelectionModelChange={(model) => {
              setSelectedRows(model);
            }}
            isRowSelectable={
              typeof isRowSelectable === 'function'
                ? ({ row }) => isRowSelectable(row)
                : undefined
            }
            pageSizeOptions={[10, 25, 50, 100]}
            keepNonExistentRowsSelected
            disableRowSelectionOnClick
            pagination
            paginationMode="server"
            slots={{
              pagination: (paginationProps) => (
                <GridPagination
                  {...paginationProps}
                  ActionsComponent={({
                    page,
                    onPageChange: _onChangePage,
                    className,
                  }) => (
                    <Pagination
                      className={className}
                      count={
                        getAllQuery?.data?.totalRecords
                          ? Math.ceil(
                              getAllQuery?.data?.totalRecords / pageSize,
                            )
                          : getAllQuery?.data?.totalCount
                            ? Math.ceil(
                                getAllQuery?.data?.totalCount / pageSize,
                              )
                            : 0
                      }
                      page={page + 1}
                      onChange={(_event, newPage) => {
                        setParams({
                          ...params,
                          page: newPage - 1,
                        });
                      }}
                      showFirstButton
                      showLastButton
                      siblingCount={2}
                      boundaryCount={2}
                      color="primary"
                    />
                  )}
                />
              ),
            }}
            getRowId={(row) => (rowKey ? row[rowKey] : row.id)}
            getRowHeight={() => 'auto'}
            columnHeaderHeight={48}
            stickyLastCol={stickyLastCol}
          />
        </StyledTableWrapper>
      )}

      {mode === 'card' && CardContainerComp && CardItemComp && (
        <>
          <CardContainerComp {...cardContainerProps}>
            {getAllQuery?.data?.data?.map((item: any) => (
              <CardItemComp
                key={item[rowKey || 'id']}
                item={item}
                onClickViewBtn={() =>
                  onClickViewBtn(convertItemToGridRow(item))
                }
                onClickEditBtn={() =>
                  onClickEditBtn(convertItemToGridRow(item))
                }
                onClickDeleteBtn={() =>
                  onClickDeleteBtn(convertItemToGridRow(item))
                }
                refetchData={() => getAllQuery.refetch()}
                {...cardItemProps}
              />
            ))}
          </CardContainerComp>

          {!noPagination && (
            <StyledPaginationWrapper>
              <StyledPaginationCard>
                <Pagination
                  shape="rounded"
                  color="primary"
                  count={
                    getAllQuery?.data?.totalRecords
                      ? Math.ceil(getAllQuery?.data?.totalRecords / pageSize)
                      : 0
                  }
                  page={page + 1}
                  onChange={(_, page) =>
                    setParams({
                      ...params,
                      page: page - 1,
                    })
                  }
                  showFirstButton
                  showLastButton
                  siblingCount={2}
                  boundaryCount={2}
                />
              </StyledPaginationCard>
            </StyledPaginationWrapper>
          )}
        </>
      )}

      <BaseCrudFormModal
        {...(formProps as any)}
        rowKey={rowKey}
        beautyView={beautyView}
      />

      {!props?.onClickImportExcelBtn && (
        <BaseImportExcelModal
          open={openUploadExcelModal}
          onClose={() => setOpenUploadExcelModal(false)}
          file={uploadedExcelFile}
          templateFileUrl={templateImportExcelUrl}
          onImport={(file) => {
            setUploadedExcelFile(file);
          }}
          onSubmit={onSubmitImportExcel}
        />
      )}
    </Stack>
  );
};

export const StyledPageHeader = styled(Box)`
  background-color: ${({ theme }) => theme.palette.common.white};
  padding: 16px;
  margin-top: 16px;
  margin-bottom: 16px;
  border-radius: 16px;
  flex: 0 0 auto;
  min-height: 0px;
  & > .top-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }
  & > .bottom-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    overflow: hidden;
    & > .left-wrapper {
      display: flex;
      align-items: center;
    }
    & > .right-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
`;

const StyledTableWrapper = styled(Box)`
  background-color: ${({ theme }) => theme.palette.common.white};
  padding: 16px;
  border-radius: 16px;
  flex: 1 1 auto;
  min-height: auto;
  display: flex;
  flex-direction: column;
  & .simplebar-wrapper {
    height: 100%;
  }
  & .simplebar-content {
    height: 100%;
  }
`;

export default BaseCrudContent;
