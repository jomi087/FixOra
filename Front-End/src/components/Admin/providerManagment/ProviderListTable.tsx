import { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ProviderList } from "@/shared/typess/user";
import ProviderKYCDialog from "./ProviderKYCDialog";

interface ProviderListTableProps {
  data: ProviderList[]
  setData: (data:ProviderList[])=>void
}

const ProviderListTable: React.FC<ProviderListTableProps> = ({ data ,setData }) => {
  const [selectedProvider, setSelectedProvider] = useState<ProviderList | null>(null);

  const handleRowClick = (provider: ProviderList) => {
    setSelectedProvider(provider);
  };

  const statusUpdatedData = (id: string) => {
    const newData = data.filter((d) => d.id !== id);
    setData(newData);
  };

  return (
    <div className="w-full">
      {/* Mobile View: Cards */}
      <div className="md:hidden">
        {data.map((list, idx) => (
          <div 
            key={list.user.email} 
            className="border rounded-lg p-4 mb-4 shadow-sm cursor-pointer"
            onClick={() => handleRowClick(list)}
          >
            <p className="font-semibold">{idx + 1}. {list.user.fname} {list.user.lname}</p>
            <p className="text-sm text-gray-500">{list.user.email}</p>
            <p className="text-sm">Service: <span className="font-medium">{list.service.name}</span></p>
            <p className={`text-sm font-medium ${list.status === "Pending" ? "text-yellow-500" : "text-destructive"}`}>
              {list.status}
            </p>
          </div>
        ))}
      </div>

      {/* Desktop View: Scrollable Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="mt-10 min-w-[600px]">
          <TableCaption>Provider Applications</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">Sr.No</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Service</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((list, idx) => (
              <TableRow
                key={list.user.email}
                className="text-center cursor-pointer"
                onClick={() => handleRowClick(list)}
              >
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{`${list.user.fname.toUpperCase()} ${list.user.lname.toUpperCase()}`}</TableCell>
                <TableCell>{list.user.email}</TableCell>
                <TableCell>{list.service.name}</TableCell>
                <TableCell className={`${list.status === "Pending" ? "text-yellow-500" : "text-destructive"}`}>
                  {list.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog */}
      <ProviderKYCDialog selectedProvider={selectedProvider} setSelectedProvider={setSelectedProvider} updateData={ statusUpdatedData } />
    </div>

  );
};

export default ProviderListTable;
