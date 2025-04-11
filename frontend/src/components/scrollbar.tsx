import { styled } from '@mui/material/styles';
import { MacScrollbar } from 'mac-scrollbar';
import { RefObject, createContext } from 'react';

/**
 * Main Layout
 */
export const MainScrollbarContext = createContext<{
  scrollableNodeRef: RefObject<HTMLElement>;
}>({ scrollableNodeRef: { current: null } });

const Scrollbar = styled(MacScrollbar)`
  position: relative;
`;

export default Scrollbar;
