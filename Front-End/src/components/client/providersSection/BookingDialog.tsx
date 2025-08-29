
import { Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogClose } from "@/components/ui/dialog";
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { toPascalCase } from "@/utils/helper/utils";
import { useAppSelector } from "@/store/hooks";
import { useState } from "react";
import { longInputLength, placeHolder, validationMsg } from "@/utils/constant";



interface BookingDialogProps {
    isDialogOpen: boolean;
    setIsDialogOpen: ( isDialogOpen: boolean ) => void;
    selectedServiceId: string;
    setSelectedServiceId: (selectedServiceId: string) => void;
    description: string;
    setDescription: (description: string) => void;
    submitBooking : () => void;
}

const BookingDialog:React.FC<BookingDialogProps > = ({ isDialogOpen,setIsDialogOpen,selectedServiceId,setSelectedServiceId ,description,setDescription,submitBooking }) => {
    
  const { subCategories } = useAppSelector((state) => state.providerBooking);
  const [error, setError] = useState({
    serviceError: "",
    descriptionError :""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
        
    let hasError = false;
    const newError = { serviceError: "", descriptionError: "" };

    if (!selectedServiceId.trim()) {
      newError.serviceError = validationMsg.ISSUE_TYPE_REQUIRED;
      hasError = true;
    }

    if (description.trim().length === 0) {
      newError.descriptionError = validationMsg.ISSUE_DESCRIPTION_REQUIRED;
      hasError = true;
    }

    if (hasError) {
      setError(newError);
      return;
    }

    submitBooking();
    setSelectedServiceId("");
    setDescription("");
    setIsDialogOpen(false);
        
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Service Request Details</DialogTitle>
            <DialogDescription>Select the service and describe your issue so we can assist you better.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
          >
            <div className="mb-4">
              <Label className="my-2 ml-1">Issue Type</Label>
              <Select
                value={selectedServiceId}
                onValueChange={(value) => {
                  setSelectedServiceId(value);
                  if (value) {
                    setError((prev) => ({ ...prev, serviceError: "" }));
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={placeHolder.ISSUE_TYPE} />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((sub) => (
                    <SelectItem
                      key={sub.subCategoryId}
                      value={sub.subCategoryId}
                    >
                      {toPascalCase(sub.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error.serviceError && <p className="text-sm text-red-500">{error.serviceError}</p>} 
            </div>

            <div className="mb-4">
              <Label htmlFor="description" className="my-2 ml-1">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => {
                  const val = e.target.value;
                  setDescription(val);
                  if (val.trim().length > 0) {
                    setError((prev) => ({ ...prev, descriptionError: "" }));        
                  }
                }}
                maxLength={longInputLength}
                placeholder= { placeHolder.ISSUE_DESCRIPTION }
              />
              {error.descriptionError && ( <p className="text-sm text-red-500">{error.descriptionError}</p>)} 
            </div>

            <DialogFooter className="pt-4 !justify-between">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setSelectedServiceId("");
                  setDescription("");
                  setError({
                    serviceError: "",
                    descriptionError: ""
                  });
                }}
              >
                                Clear
              </Button>
              <div>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setError({
                        serviceError: "",
                        descriptionError: ""
                      });
                    }}
                  >
                                        Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">done</Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookingDialog;