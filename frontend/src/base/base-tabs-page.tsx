import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Stack, Tab, Typography, alpha, styled } from '@mui/material';
import { useState } from 'react';

type TBaseTabsPageProps = {
  title: string;
  name: string;
  tabs: {
    label: string;
    Component: React.ReactNode;
  }[];
};

const BaseTabsPage = (props: TBaseTabsPageProps) => {
  const { title, tabs } = props;

  const [tab, setTab] = useState('0');

  return (
    <TabContext value={tab}>
      <StyledContentWrapper>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            px: 1,
            mt: 2.5,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={4}
            sx={{ mb: 0.8 }}
          >
            <Stack spacing={1}>
              <Typography variant="h5" component="h1">
                {title}
              </Typography>
            </Stack>
          </Stack>

          <Box
            sx={{
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '1px',
                width: '100%',
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.15),
              },
            }}
          >
            <TabList
              onChange={(_, value: string) => {
                setTab(value);
              }}
            >
              {tabs.map((tab, index) => (
                <Tab key={index} label={tab.label} value={index.toString()} />
              ))}
            </TabList>
          </Box>
        </Box>

        {tabs.map((tab, index) => (
          <TabPanel style={{ padding: 0 }} key={index} value={index.toString()}>
            {tab.Component}
          </TabPanel>
        ))}
      </StyledContentWrapper>
    </TabContext>
  );
};

const StyledContentWrapper = styled('main')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  flex: '1 1 auto',
  backgroundColor: theme.palette.grey[100],
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

export default BaseTabsPage;
