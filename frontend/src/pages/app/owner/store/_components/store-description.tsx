import { Collapse, Button, Typography } from "@mui/material";
import { useState, useMemo } from "react";
import parse from "html-react-parser";

const OwnerStoreDescription = ({ html }: { html: string }) => {
    const [expanded, setExpanded] = useState(false);

    // Lấy text thuần không chứa tag HTML để đo độ dài
    const plainText = useMemo(() => {
        const div = document.createElement("div");
        div.innerHTML = html || "";
        return div.textContent || div.innerText || "";
    }, [html]);

    const isExpandable = plainText.length > 150; // chỉ hiển thị nút nếu dài hơn 150 ký tự

    return (
        <>
            <Collapse in={expanded} collapsedSize={60}>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    className="overflow-hidden text-sm prose max-w-full"
                >
                    {parse(html || "")}
                </Typography>
            </Collapse>

            {isExpandable && (
                <Button
                    size="small"
                    onClick={() => setExpanded(!expanded)}
                    sx={{ mt: 1, textTransform: "none" }}
                >
                    {expanded ? "Thu gọn" : "Xem thêm"}
                </Button>
            )}
        </>
    );
};

export default OwnerStoreDescription;
