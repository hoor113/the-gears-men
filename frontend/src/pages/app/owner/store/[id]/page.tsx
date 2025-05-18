// import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const OwnerSingleStorePage = () => {
    const { id } = useParams<{ id: string }>();


    return (
        <>
            {id}
        </>
    )
};

export default OwnerSingleStorePage;