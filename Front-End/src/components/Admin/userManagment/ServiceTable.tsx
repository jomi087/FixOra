import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Category, Subcategory } from "@/shared/Types/category";
import EditCategoryDialoge from "./EditCategoryDialoge";

interface TableColumn {
  label: string;
  className?: string;
}

interface ServiceTableProps {
  tableColumns: TableColumn[];
  categories: Category[] | Subcategory[] ;
  selectedIndex?: number;
  onSelect?: (index: number) => void;
  showActions?: boolean; 
  emptyMessage?: string;
  onToggleStatus?: ( categoryId:string ) => void
}

const ServiceTable: React.FC<ServiceTableProps> = ({
  tableColumns,
  categories,
  selectedIndex,
  onSelect,
  showActions = true,
  emptyMessage = "No data found.",
  onToggleStatus
}) => {
  const isCategory = (item: Category | Subcategory): item is Category => {
    return (item as Category).categoryId !== undefined;
  }
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
                {emptyMessage}
              </div>
            </TableCell>
          </TableRow>
        ) : (
          categories.map((category, indx) => (
            <TableRow
              key={indx}
              onClick={() => onSelect?.(indx)}
              className={`cursor-pointer ${indx === selectedIndex ? "bg-muted" : ""}`}
            >
              <TableCell className="font-medium ">
                {category.name.toUpperCase()}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant= { isCategory(category) ?
                    (category.isActive ? "destructive" : "default") : (category.isActive ? "success" : "destructive" )
                  }
                  onClick={ (e) => {
                    e.stopPropagation()
                    const id = isCategory(category) ? category.categoryId : category.subCategoryId
                    onToggleStatus?.(id) 
                  }}
                >
                  { isCategory(category) ?
                    (category.isActive ? "Deactivate" : "Activate") : (category.isActive ? "Activated" : "Deactivated")
                  }
                  
                </Button>
              </TableCell>
              {showActions && (
                <TableCell className="text-center" >
                  <EditCategoryDialoge category={category as Category} />
                  {showActions && (
                    <span className={`relative top-1 left-3 inline-block h-4 w-4 rounded-full border-2 border-white 
                      ${ category.isActive ? "bg-green-500" : "bg-gray-400" } `}>
                    </span>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ServiceTable;
