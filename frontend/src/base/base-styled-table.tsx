import { alpha, styled } from '@mui/material';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import { ForwardRefRenderFunction, forwardRef } from 'react';

import { cssScrollbarStyled } from './base-styled-components';

type TBaseStyledTableProps = DataGridProps<any> & {
  stickyLastCol?: boolean;
};

const BaseStyledTable: ForwardRefRenderFunction<
  HTMLDivElement,
  TBaseStyledTableProps
> = ({ stickyLastCol, ...props }, forwardedRef) => {
  return (
    <StyledDataGrid
      ref={forwardedRef}
      showColumnVerticalBorder
      showCellVerticalBorder
      scrollbarSize={8}
      className={stickyLastCol ? 'stickyLastCol' : undefined}
      {...props}
    />
  );
};

const StyledDataGrid = styled(DataGrid)`
  .MuiDataGrid-columnHeaders {
    z-index: 0;
    background-color: ${({ theme }) => theme.palette.primary.main};
    .MuiDataGrid-iconSeparator {
      display: none;
    }
    .MuiDataGrid-columnHeader {
      z-index: 0;
      border-right: 1px solid ${({ theme }) => theme.palette.grey[100]};
      color: ${({ theme }) => theme.palette.grey[100]};
      & .MuiDataGrid-columnHeaderTitle {
        font-weight: 600;
      }
      & .MuiCheckbox-root {
        color: ${({ theme }) => theme.palette.grey[100]};
      }
      & .MuiDataGrid-iconButtonContainer .MuiSvgIcon-root {
        color: ${({ theme }) => theme.palette.grey[50]};
      }
      & .MuiDataGrid-menuIcon .MuiSvgIcon-root {
        color: ${({ theme }) => theme.palette.grey[50]};
      }
      &:last-of-type {
        border-right: none;
      }
    }
  }

  .MuiDataGrid-virtualScroller {
    ${cssScrollbarStyled}
    .MuiDataGrid-row {
      .MuiDataGrid-cell:last-of-type {
        border-color: transparent;
        padding: 0 !important;
      }
      .MuiDataGrid-cell[data-colindex] {
        border-color: #e0e0e0;
        min-height: 50px !important;
      }
      .MuiDataGrid-cell:first-of-type {
        border-left: 1px solid #e0e0e0;
      }
      .MuiDataGrid-booleanCell[data-value='false'] {
        color: ${({ theme }) => theme.palette.error.main};
      }
      .MuiDataGrid-booleanCell[data-value='true'] {
        color: ${({ theme }) => theme.palette.info.main};
      }
    }
    .MuiDataGrid-row:last-of-type {
      .MuiDataGrid-cell:first-of-type {
        border-radius: 0 0 0 8px;
      }
      .MuiDataGrid-cell:last-of-type {
        border-radius: 0 0 8px 0;
      }
    }
  }

  .MuiDataGrid-main {
    margin-bottom: 16px;
  }
  .MuiDataGrid-virtualScrollerContent--overflowed
    .MuiDataGrid-row--lastVisible
    .MuiDataGrid-cell {
    border-bottom: 1px solid #e0e0e0;
  }
  .MuiDataGrid-footerContainer {
    position: sticky;
    bottom: 16px;
    margin-top: auto;
    min-height: 44px;
    height: 46px;
    background-color: ${({ theme }) => theme.palette.grey[100]};
    /* background-color: ${({ theme }) =>
      alpha(theme.palette.primary.main, 0.1)}; */
    backdrop-filter: blur(8px);
    border-radius: 8px;
    z-index: 1;
    .MuiToolbar-root {
      z-index: 1;
      min-height: 0;
    }
    &::before {
      content: '';
      position: absolute;
      top: -16px;
      left: -16px;
      height: calc(100% + 32px);
      width: calc(100% + 32px);
      z-index: 0;
      background-color: ${({ theme }) =>
        alpha(theme.palette.common.white, 0.95)};
      backdrop-filter: blur(8px);
      border-radius: inherit;
    }
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: calc(100%);
      width: calc(100%);
      z-index: 0;
      border: 1px solid
        ${({ theme }) => alpha(theme.palette.primary.main, 0.05)};
      background-color: ${({ theme }) => theme.palette.grey[100]};
      border-radius: inherit;
    }
  }
  &.stickyLastCol {
    .MuiDataGrid-columnHeaders {
      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 100px;
        height: 48px;
        width: 1px;
        z-index: 0;
        background-color: ${({ theme }) => theme.palette.grey[100]};
      }
      &::after {
        content: '';
        background-color: ${({ theme }) => theme.palette.primary.main};
        position: absolute;
        top: 0;
        right: 0;
        height: 48px;
        width: 100px;
        z-index: 1;
      }
    }

    .MuiDataGrid-virtualScroller {
      .MuiDataGrid-row {
        .MuiDataGrid-cell:last-of-type {
          position: sticky;
          right: 0;
          background-color: ${({ theme }) => theme.palette.common.white};
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -1px;
            height: 100%;
            width: 1px;
            z-index: 0;
            background-color: #e0e0e0;
          }
        }
      }
    }
  }
`;

export default forwardRef(BaseStyledTable);
