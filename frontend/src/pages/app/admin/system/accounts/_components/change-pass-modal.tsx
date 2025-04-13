import NiceModal, { muiDialogV5, useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useUpdateEffect } from 'react-use';
import * as yup from 'yup';

import BaseCrudFormContainer from '@/base/base-crud-form-container';
import DialogExtend from '@/components/dialog-extend';
import useTranslation from '@/hooks/use-translation';
import appService from '@/services/app/app.service';

import accountsService from '../_services/accounts.service';

const ChangePassModal = NiceModal.create(
  ({ row, title }: { row: any; mode: any; title: string }) => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const formRef = useRef<HTMLFormElement>(null);
    const modal = useModal();
    const schema = useMemo(
      () =>
        yup.object().shape({
          adminPassword: yup.string().required(t('field-required')),
          newPassword: yup.string().required(t('field-required')),
          repassword: yup
            .string()
            .required(t('field-required'))
            .oneOf(
              [yup.ref('newPassword'), ''],
              t('Mật khẩu nhập lại không đúng'),
            ),
        }),
      [t],
    );

    const form = useForm({
      mode: 'onChange',
      resolver: schema ? yupResolver(schema) : undefined,
    });
    const { handleSubmit, formState } = form;

    useEffect(() => {}, [row]);

    useUpdateEffect(() => {}, [row]);

    const changePassMutation = useMutation({
      mutationFn: (data: any) => accountsService.resetPassword(data),
      onMutate: () => {
        appService.showLoadingModal();
      },
      onSettled: () => {
        appService.hideLoadingModal();
      },
      onSuccess: () => {
        enqueueSnackbar(t('Đổi mật khẩu thành công'), {
          variant: 'success',
        });
        modal.hide();
      },
      onError: () => {
        enqueueSnackbar(t('Đổi mật khẩu thất bại'), {
          variant: 'error',
        });
      },
    });
    const onSubmit = useCallback(
      (data: any) => {
        data.userId = row?.id;
        changePassMutation.mutate(data);
      },
      [changePassMutation, row?.id],
    );
    return (
      <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
        <DialogExtend {...muiDialogV5(modal)} maxWidth="sm">
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <FormProvider {...form}>
              <BaseCrudFormContainer
                fields={[
                  {
                    label: t('accounts_adminPassword'),
                    name: 'adminPassword',
                    type: 'text',
                    required: true,
                    colSpan: 12,
                    props: {
                      type: 'password',
                    },
                  },
                  {
                    label: t('accounts_newPassword'),
                    name: 'newPassword',
                    type: 'text',
                    required: true,
                    colSpan: 12,
                    props: {
                      type: 'password',
                    },
                  },
                  {
                    label: t('accounts_repassword'),
                    name: 'repassword',
                    type: 'text',
                    required: true,
                    colSpan: 12,
                    props: {
                      type: 'password',
                    },
                  },
                ]}
              />
            </FormProvider>
          </DialogContent>

          <DialogActions>
            <Button
              disabled={formState.isSubmitting || !formState.isValid}
              variant="contained"
              type="submit"
              onClick={() => {
                formRef.current?.dispatchEvent(
                  new Event('submit', { cancelable: true, bubbles: true }),
                );
              }}
            >
              {t('Lưu')}
            </Button>
            <Button
              variant="text"
              color="inherit"
              type="button"
              onClick={() => modal.hide()}
            >
              {t('Hủy')}
            </Button>
          </DialogActions>
        </DialogExtend>
      </form>
    );
  },
);

export default ChangePassModal;
