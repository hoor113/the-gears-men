import {
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import CompanyMenuItems from '../constants/main-constant';

const CompanyLeftDrawer = ({ drawerOpen, toggleDrawer }: any) => {
    const navigate = useNavigate();
    const menuItems = CompanyMenuItems();
    return (
        <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
            <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={() => toggleDrawer(false)}
                onKeyDown={() => toggleDrawer(false)}
            >
                {/* App title */}
                <Typography variant="h6" sx={{ p: 2 }}>
                    The Gear Men
                </Typography>
                <Divider />

                {/* Mục điều hướng tĩnh */}
                <List>
                    {menuItems.map((item: any) => (
                        <ListItem key={item?.path} disablePadding>
                            <ListItemButton onClick={() => navigate(item?.path)}>
                                {item?.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                                <ListItemText primary={item?.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default CompanyLeftDrawer;
