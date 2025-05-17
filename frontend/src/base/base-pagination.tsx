import { Box, Button } from "@mui/material";

interface BasePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const BasePagination = ({ currentPage, totalPages, onPageChange }: BasePaginationProps) => {
    const getPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];

        if (totalPages <= 6) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push("...");
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push("...");
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handleClick = (value: number | string) => {
        if (value === "...") return;
        else onPageChange(Number(value));
    };

    return (
        <Box className="flex justify-center gap-1 mt-4 flex-wrap">
            {/* Previous button */}
            <Button
                size="small"
                variant="outlined"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                «
            </Button>

            {getPageNumbers().map((page, idx) => (
                <Button
                    key={idx}
                    size="small"
                    variant={page === currentPage ? "contained" : "outlined"}
                    onClick={() => handleClick(page)}
                    disabled={page === "..." || page === currentPage}
                >
                    {page}
                </Button>
            ))}

            {/* Next button */}
            <Button
                size="small"
                variant="outlined"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                »
            </Button>
        </Box>
    );
};

export default BasePagination;
