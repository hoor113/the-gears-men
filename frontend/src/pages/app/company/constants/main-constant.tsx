
import InfoIcon from "@mui/icons-material/Info";
import { User2Icon } from "lucide-react";

export default function CompanyMenuItems() {

    const menuItems = [
        {
            label: "Tài khoản",
            path: `/settings/my-account`,
            icon: <User2Icon fontSize="small" />,
        },
        {
            label: "Về chúng tôi",
            path: `/company/aboutus`,
            icon: <InfoIcon fontSize="small" />,
        },
    ];

    return menuItems; // hoặc return JSX nếu bạn render
}
