import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, GridProps, Tab } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

// import { RhfDevTool } from '@/components/custom-rhf-devtool';

import BaseBeautyViewField from './base-beauty-view-field';
import BaseFormInput from './base-form-input';
import { TBaseFormMode } from './base.model';
import { TCrudFormField } from './crud-form-field.type';

type TBaseCrudFormContainerProps = {
  fields?: TCrudFormField[];
  mode?: TBaseFormMode;
  beautyView?: boolean;
  tabFields?: {
    label: string;
    fields: TCrudFormField[];
  }[];
} & GridProps;

const BaseCrudFormContainer = (props: TBaseCrudFormContainerProps) => {
  const { fields, mode, beautyView, tabFields, ...rest } = props;

  const [selectedTab, setSelectedTab] = useState('0');

  const { control, watch } = useFormContext();

  return (
    <>
      {!tabFields || !tabFields.length ? (
        <Grid container spacing={2} {...rest}>
          {fields
            ?.filter((field) => !field.hidden)
            ?.map((field, index) => (
              <Grid
                key={`${field.name}-${index}-${field.type}`}
                xs={field.colSpan || 12}
                sx={{ display: field.noRender ? 'none' : '' }}
              >
                {mode === 'view' && beautyView ? (
                  <BaseBeautyViewField field={field} watch={watch} />
                ) : (
                  <BaseFormInput field={field} control={control} />
                )}
              </Grid>
            ))}
        </Grid>
      ) : (
        <TabContext value={selectedTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={(_e, newValue) => setSelectedTab(newValue)}>
              {tabFields.map((tab, index) => (
                <Tab key={index} label={tab.label} value={index.toString()} />
              ))}
            </TabList>
          </Box>

          {tabFields.map((tab, index) => (
            <TabPanel key={index} value={index.toString()}>
              <Grid container spacing={2} {...rest}>
                {tab.fields
                  ?.filter((field) => !field.hidden)
                  ?.map((field, index) => (
                    <Grid
                      key={`${field.name}-${index}-${field.type}`}
                      xs={field.colSpan || 12}
                      sx={{ display: field.noRender ? 'none' : '' }}
                    >
                      {mode === 'view' && beautyView ? (
                        <BaseBeautyViewField field={field} watch={watch} />
                      ) : (
                        <BaseFormInput field={field} control={control} />
                      )}
                    </Grid>
                  ))}
              </Grid>
            </TabPanel>
          ))}
        </TabContext>
      )}

      {/* <RhfDevTool control={control} /> */}
    </>
  );
};

export default BaseCrudFormContainer;
