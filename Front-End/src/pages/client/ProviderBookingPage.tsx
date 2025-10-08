import { Link, useParams } from "react-router-dom";
import Nav from "@/components/common/layout/Nav";
import { useEffect } from "react";
import ProviderInfo from "@/components/client/providersSection/ProviderInfo";
import PageLoader from "@/components/common/Others/PageLoader";
import BookingSlots from "../../components/client/providersSection/BookingSlots";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProviderInfo } from "@/store/user/providerInfoSlice";
import Review from "@/components/client/providersSection/Review";

const ProviderBookingPage: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const dispatch = useAppDispatch();

  const { data, isLoadingProvider } = useAppSelector((state) => state.providerInfo);

  useEffect(() => {
    if (!providerId) return;
    dispatch(fetchProviderInfo(providerId));
  }, [providerId]);

  return (
    <div>
      <Nav className="bg-nav-background text-nav-text" />
      {isLoadingProvider ? (
        <PageLoader />
      ) : (
        <main className="pt-16 min-h-screen text-nav-text bg-background px-6 lg:px-10 py-6">
          {/* BreadCrumbs */}
          <nav className=" pt-4 sm:px-6 lg:px-10 text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center space-x-2">
              <li>
                <Link to="/" className="hover:underline">Home</Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/customer/providers" className="hover:underline">Providers</Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-semibold">Booking Info</li>
            </ol>
          </nav>
          {data && data.service.subcategories.length > 0 ? (
            <>
              <ProviderInfo />
              <BookingSlots />
              <Review providerId={providerId!} />
            </>
          ) : (
            <div className="flex justify-center h-[78vh] items-center text-sm text-muted-foreground ">
              No Data found.
            </div>
          )}

        </main>
      )}
    </div>
  );
};

export default ProviderBookingPage;
