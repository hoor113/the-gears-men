import React from 'react';
import { Button, List, ListItem, Box, Popover } from '@mui/material';
import usePopover from '@/hooks/use-popover';

interface MenuButtonProps {
    title: string;
    data: any[]; // Danh sách dữ liệu là kiểu any[]
    renderItem: (item: any) => React.ReactNode; // Hàm để render mỗi item
}

const MenuButton: React.FC<MenuButtonProps> = ({ title, data, renderItem }) => {
    const { anchorRef, open, handleOpen, handleClose } = usePopover();

    return (
        <Box>
            <Button
                ref={anchorRef}
                id={`${title}-button`}
                aria-controls={open ? `${title}-list` : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleOpen}
            >
                {title}
            </Button>
            {data.length > 0 && (
                <Popover
                    id={`${title}-popover`}
                    anchorEl={anchorRef.current}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <List>
                        {data.map((item, index) => (
                            <ListItem key={index} button onClick={handleClose}>
                                {renderItem(item)}
                            </ListItem>
                        ))}
                    </List>
                </Popover>
            )}
        </Box>
    );
};

export default MenuButton;
