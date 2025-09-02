import { Link, useParams } from "react-router-dom";
import Nav from "@/components/common/layout/Nav";
import { useEffect } from "react";
import BookingProvidersInfo from "@/components/client/providersSection/BookingProvidersInfo";
import PageLoader from "@/components/common/Others/PageLoader";
import BookingInfo from "../../components/client/providersSection/BookingInfo";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProviderInfo } from "@/store/user/providerInfoSlice";

const ProviderBookingPage: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const dispatch = useAppDispatch();

  const { data, isLoading } = useAppSelector((state) => state.providerInfo);

  useEffect(() => {
    if (providerId) {
      dispatch(fetchProviderInfo(providerId));
    };
  }, [dispatch, providerId]);

  return (
    <div>
      <Nav className="bg-nav-background text-nav-text" />
      {isLoading ? (
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
                <Link to="/user/providers" className="hover:underline">Providers</Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-semibold">Booking Info</li>
            </ol>
          </nav>
          {data && data.service.subcategories.length > 0 ? (
            <>
              <BookingProvidersInfo />
              <BookingInfo />
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
