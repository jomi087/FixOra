import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Category } from "@/shared/typess/category";
import EditCategoryDialoge from "./EditCategoryDialoge";

interface TableColumn {
  label: string;
  className?: string;
}

interface ServiceTableProps {
  tableColumns: TableColumn[];
  categories: Category[]
  selectedCategory: Category | null
  setSelectedCategory: (selectedCategory: Category | null) => void;
  onToggleStatus: (categoryId: string) => void
  onUpdateCategory: (updatedCategory: Category) => void;
}

const MainServiceTable: React.FC<ServiceTableProps> = ({
  tableColumns,
  categories,
  selectedCategory,
  setSelectedCategory,
  onToggleStatus,
  onUpdateCategory
}) => {

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {tableColumns.map((head) => (
            <TableHead key={head.label} className={head.className}>
              {head.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {categories.length === 0 ? (
          <TableRow>
            <TableCell colSpan={tableColumns.length}>
              <div className="flex justify-center items-center h-[64vh] text-xl font-extralight font-mono">
                No data found
              </div>
            </TableCell>
          </TableRow>
        ) : (
          categories.map((category) => (
            <TableRow
              key={category.categoryId}
              onClick={() => setSelectedCategory(category)}
              className={`cursor-pointer ${selectedCategory?.categoryId === category.categoryId ? "bg-gray-200 dark:bg-gray-800" : ""}`}
            >
              <TableCell className="font-medium ">
                {category.name.toUpperCase()}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant={category.isActive ? "destructive" : "success"}
                  onClick={() => {
                    onToggleStatus(category.categoryId);
                  }}
                  className="w-22 active:scale-95 cursor-pointer"
                >
                  {category.isActive ? "Deactivate" : "Activate"}

                </Button>
              </TableCell>
              <TableCell className="text-center" >
                <div className="flex justify-center items-center gap-2">
                  <EditCategoryDialoge category={category} onUpdateCategory={onUpdateCategory} />
                  <div className={`h-4 w-4 rounded-full border-2 border-white  
                  ${category.isActive ? "bg-green-500" : "bg-gray-400"} `}>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default MainServiceTable;
