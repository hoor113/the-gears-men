import {
    Drawer,
    Box,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { menuItems } from "../_services/product.model";
import { categoriesObject } from "../_services/product.model";

const LeftDrawer = ({ drawerOpen, toggleDrawer }: any) => {
    const navigate = useNavigate();

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
                                <ListItemText primary={item?.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Divider />

                {/* Danh mục sản phẩm */}
                <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
                    Danh mục sản phẩm
                </Typography>

                <List>
                    {categoriesObject.map((category: any) => (
                        <ListItem key={category.key} disablePadding>
                            <ListItemButton onClick={() => navigate(`/customer/category/${category.key}`)}>
                                <ListItemText primary={category.title} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default LeftDrawer;
