import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { imageValidatorField } from "@/utils/validation/imageValidation";
import { ImageSize, longInputLength, Messages, shortInputLength } from "@/utils/constant";
import { toast } from "react-toastify";
import AuthService from "@/services/AuthService";
import { BookingStatus } from "@/shared/enums/BookingStatus";
import type { JobInfoDetails } from "@/shared/Types/booking";
import { useState } from "react";
import Lottie from "lottie-react";
import LoadingAnimation from "@/assets/animations/LoadingPaperplane.json";

const PartSchema = z.object({
  name: z.string().min(1, "Part name required"),
  cost: z
    .string()
    .min(1, "Price required")
    .refine((val) => !isNaN(Number(val)), { message: "Price must be a number" }),
});

const UploadWorkProofSchema = z.object({
  images: z
    .array(imageValidatorField(ImageSize, "workProofImage"))
    .min(1, "At least one image is required")
    .max(3, "You can upload up to 3 images"),
  diagnose: z.string().min(3, "Please provide a short diagnosis description"),
  parts: z.array(PartSchema).optional(),
});

type UploadWorkProofForm = z.infer<typeof UploadWorkProofSchema>;

interface UploadWorkProofDialogProps {
  bookingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setBookingInDetails: React.Dispatch<React.SetStateAction<JobInfoDetails | null>>;
}

const UploadWorkProofDialog: React.FC<UploadWorkProofDialogProps> = ({ bookingId, open, onOpenChange, setBookingInDetails, }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<UploadWorkProofForm>({
    resolver: zodResolver(UploadWorkProofSchema),
    defaultValues: {
      images: [],
      diagnose: "",
      parts: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "parts",
  });

  const onSubmit = async (data: UploadWorkProofForm) => {
    try {
      if (loading) return;

      const formData = new FormData();
      formData.append("bookingId", bookingId);
      formData.append("diagnose", data.diagnose);

      data.images.forEach((file) => formData.append("workProofImages", file));
      
      if (data.parts && data.parts.length > 0) {
        formData.append("parts", JSON.stringify(data.parts));
      }

      setLoading(true);
      const res = await AuthService.finalizeBookingApi(formData);
      toast.success(res.data.bookingStatus);

      if (res.data.bookingStatus === BookingStatus.COMPLETED) {
        setBookingInDetails((prev) =>
          prev
            ? {
              ...prev,
              status: res.data.bookingStatus,
              workProof: res.data.workProofUrls,
              diagnosed: res.data.diagnosis
            }
            : prev
        );
      }

      onOpenChange(false);
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || Messages.FAILED_TO_SUBMIT_KYC;
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-full overflow-auto">
        <DialogHeader>
          <DialogTitle className="font-bold font-roboto text-primary underline underline-offset-4">
            Upload Proof Of Work
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="text-sm space-y-2">
          <p>
            Please upload <strong>one or more clear images</strong> of the
            completed work. These images will serve as{" "}
            <strong>official proof of service completion</strong>.
          </p>
          <p>
            Ensure the photos are <strong>well-lit, in focus</strong>, and
            clearly show the work.
          </p>
          <p>
            You may upload <strong>up to 3 images</strong> (JPEG or PNG).
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 max-w-2xl"
          >
            {/* Work Proof Images */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Images</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files
                          ? Array.from(e.target.files)
                          : [];
                        field.onChange(files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Diagnose */}
            <FormField
              control={form.control}
              name="diagnose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnosis / Work Summary</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Describe the work done or issue diagnosed"
                      maxLength={longInputLength}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Extra Parts Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-primary underline underline-offset-4">
                  Extra Parts
                </h3>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => append({ name: "", cost: "" })}
                >
                  + Add Part
                </Button>
              </div>

              {fields.map((item, index) => (
                <div key={item.id} className="flex gap-2 items-end">
                  <FormField
                    control={form.control}
                    name={`parts.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Part Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Air Filter"
                            maxLength={shortInputLength}
                            {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`parts.${index}.cost`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 250" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between">
              <Button
                type="submit"
              >
                {loading ? (
                  <Lottie
                    animationData={LoadingAnimation}
                    loop={true}
                    className="w-40"
                  />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadWorkProofDialog;
