import Nav from "@/components/common/layout/Nav";
import SideBar from "@/components/common/others/SideBar";
import { adminSideBarOptions, Messages } from "@/utils/constant";
import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import SearchInput from "@/components/common/others/SearchInput";
import FilterSelect from "@/components/common/others/FilterSelect";
import AddCategoryDialoge from "@/components/admin/userManagment/AddCategoryDialoge";
import ServiceTable from "@/components/admin/userManagment/ServiceTable";
import Pagination from "@/components/common/others/Pagination";
import { useServiceManagement } from "@/hooks/useServiceManagement";
import AuthService from "@/services/AuthService";
import { toast } from "react-toastify";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import type { AxiosError } from "axios";


const ServiceManagement: React.FC = () => {

  const [refreshFlag, setRefreshFlag] = useState(false);
  const { categories, loading, setSearchQuery, setFilter, totalPages, searchQuery, filter, currentPage, setCurrentPage, setCategories } = useServiceManagement(refreshFlag);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedCategory = categories[selectedIndex];
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleToggleStatus = async (categoryId: string) => {
    try {
      const res = await AuthService.toggleCategoryStatusApi(categoryId);
      if (res.status === HttpStatusCode.OK) {
        setCategories(prev =>
          prev.map((cat) => cat.categoryId === categoryId ? {
            ...cat,
            isActive: !cat.isActive,
            subcategories: cat.subcategories.map((sub) => ({
              ...sub,
              isActive: !cat.isActive,
            })),
          } : cat)
        );
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.log(error);
      const errorMsg = error?.response?.data?.message || Messages.FAILED_TO_UPDATE_STATUS;
      toast.error(errorMsg);
    }
  };

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Active", value: "Active" },
    { label: "Un-Active", value: "Un-Active" },
  ];

  return (
    <>
      <Nav className="bg-nav-background text-nav-text fixed top-0 left-0 right-0 z-50" />
      <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background">
        <SideBar SideBar={adminSideBarOptions} className="border-r-1 my-8" />
        <div className="flex-1 bg-footer-background text-body-text">
          <div className="w-full h-full">
            <ResizablePanelGroup
              direction="horizontal"
              className="w-full rounded-lg border h-full flex-col md:flex-row"
            >
              <ResizablePanel defaultSize={60} className="overflow-auto md:max-h-full">
                <div className="m-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between ">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center w-full md:w-[480px]">
                      <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search Provider" />
                      <FilterSelect filter={filter} onChange={setFilter} options={filterOptions} />
                    </div>
                    <div className="w-full md:w-auto">
                      <AddCategoryDialoge
                        open={isDialogOpen}
                        setOpen={setIsDialogOpen}
                        triggerRefresh={() => setRefreshFlag(prev => !prev)}
                      />
                    </div>
                  </div>
                  {loading ? (
                    <div className="flex justify-center items-center h-[84vh] text-xl font-semibold">
                      Loading...
                    </div>
                  ) : (
                    <>
                      <ServiceTable
                        tableColumns={[
                          { label: "Service", className: "text-center" },
                          { label: "Status", className: "w-50 text-center" },
                          { label: "Action", className: " w-50 text-center" },
                        ]}
                        categories={categories}
                        selectedIndex={selectedIndex}
                        onSelect={setSelectedIndex}
                        showActions={true}
                        emptyMessage="Service Category Is Empty."
                        onToggleStatus={handleToggleStatus}
                      />
                      {totalPages > 1 && (
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPage={setCurrentPage}
                        />
                      )}
                    </>
                  )}

                </div>
              </ResizablePanel>

              <ResizableHandle className="hidden md:flex" />

              <ResizablePanel defaultSize={40} className="overflow-auto max-h-[70vh] md:max-h-full">
                <div className="m-4">
                  {selectedCategory && (
                    <div className="flex justify-center items-center w-full mb-4">
                      <div className="flex flex-col items-center text-center w-full max-w-sm">
                        <img
                          src={selectedCategory.image}
                          alt={selectedCategory.name}
                          className="w-full md:w-[200%] max-w-[150px] object-contain rounded-md shadow-md"
                        />
                        <h2 className="font-semibold mt-2 font-serif text-lg">{selectedCategory.name}</h2>
                        <p className="text-sm"> {selectedCategory.description}</p>
                      </div>
                    </div>
                  )}
                  <hr />
                  <h2 className="font-medium font-serif my-2 text-center">Sub-Category</h2>
                  <ServiceTable
                    tableColumns={[
                      { label: "Service" },
                      { label: "Status" },
                    ]}
                    categories={selectedCategory?.subcategories ?? []}
                    showActions={false}
                    emptyMessage="No subcategories available."
                    //onToggleStatus={handleToggleStatus}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceManagement;

