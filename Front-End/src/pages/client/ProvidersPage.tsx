import FilterSideBar from "@/components/client/FilterSideBar"
import ProviderList from "@/components/client/ProviderList"
import Nav from "@/components/common/layout/Nav"
import useFetchCategories from "@/hooks/useFetchCategories"

const ProvidersPage = () => {
    const {categories,loading} = useFetchCategories()
    
    return (
        <div>
            <Nav className='bg-nav-background text-nav-text ' />
            <main className="flex flex-col sm:flex-row pt-16 min-h-screen text-nav-text bg-nav-background">
                <FilterSideBar
                    className="border-r-1 hidden sm:block"
                    categories={categories} loading={loading}
                />
                <div className="flex-1">
                    <ProviderList />
                </div>
            </main> 
        </div>
    )
}

export default ProvidersPage