import { TopNav } from '../_components/top-nav';

const CustomerPage = () => {
    return (
        <>
            <TopNav openNavLg={false} onNavOpen={() => console.log('')} />
            <div className="h-full bg-gray-300">Customer</div>
        </>
    );
};

export default CustomerPage;
