import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollIndicator from '../components/ScrollIndicator';

export default function PublicLayout() {
    return (
        <>
            <ScrollIndicator />
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
