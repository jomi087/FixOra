import FilterSideBar from "@/components/client/providersSection/FilterSideBar"
import ProviderList from "@/components/client/providersSection/ProviderList"
import Nav from "@/components/common/layout/Nav"
import useFetchCategories from "@/hooks/useFetchCategories"

const ProvidersPage = () => {
  const { categories, loading } = useFetchCategories();

  return (
    <div>
      <Nav className="bg-nav-background text-nav-text" />

      <main className="pt-16 min-h-screen text-nav-text bg-nav-background flex">
        <div className="hidden sm:block w-[220px] fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto border-r border-border bg-nav-background z-30">
          <FilterSideBar className="h-full" categories={categories} loading={loading} />
        </div>

        <div className="flex-1 sm:ml-[220px]">
          <ProviderList />
        </div>
      </main>
    </div>
  );
};

export default ProvidersPage;
