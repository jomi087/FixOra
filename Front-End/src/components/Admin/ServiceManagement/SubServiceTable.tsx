import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Category, Subcategory } from "@/shared/types/category";
import EditSubcategoryDialog from "./EditSubcategoryDialog";

interface TableColumn {
  label: string;
  className?: string;
}

interface ServiceTableProps {
  tableColumns: TableColumn[];
  subcategories: Subcategory[];
  onUpdateCategory: (updatedCategory: Category) => void;
}

const SubServiceTable: React.FC<ServiceTableProps> = ({ tableColumns, subcategories, onUpdateCategory }) => {
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
        {subcategories.length === 0 ? (
          <TableRow>
            <TableCell colSpan={tableColumns.length}>
              <div className="flex justify-center items-center h-[64vh] text-xl font-extralight font-mono">
                "No data found."
              </div>
            </TableCell>
          </TableRow>
        ) : (
          subcategories.map((subCat) => (
            <TableRow
              key={subCat.subCategoryId}
              className={"cursor-pointer "}
            >
              <TableCell className="font-medium whitespace-normal break-words ">
                {subCat.name.toUpperCase()}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant={!subCat.isActive ? "destructive" : "success"}
                  className="w-22"

                >
                  {!subCat.isActive ? "Deactivated" : "Activated"}

                </Button>
              </TableCell>
              <TableCell className="text-center" >
                <div className="flex justify-center items-center gap-2">
                  <EditSubcategoryDialog subCategory={subCat} onUpdateCategory={onUpdateCategory} />
                  <div className={`h-4 w-4 rounded-full border-2 border-white  
                  ${subCat.isActive ? "bg-green-500" : "bg-gray-400"} `}>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table >
  );
};

export default SubServiceTable;
