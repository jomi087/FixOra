import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useFetchCategories from "@/hooks/useFetchCategories";
import AuthService from "@/services/AuthService";
import { Gender } from "@/shared/enums/Gender";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import { maxYear, Messages, minYear } from "@/utils/constant";
import { providerKYCSchema, type ProviderKYCType } from "@/utils/validation/providerKYCValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";


interface VerifictionFormProps {
  toggle: (editMode: boolean) => void;
}

const VerifictionForm: React.FC<VerifictionFormProps> = ({ toggle }) => {

  const { categories, loading: isLoading } = useFetchCategories();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const genderOptions = Object.values(Gender);
  const form = useForm<ProviderKYCType>({ // a custom hook  which return several an object that gives you full control over your form — register, validation, error, handleSubmit, and more.
    resolver: zodResolver(providerKYCSchema),
    defaultValues: {
      service: "",
      specialization: [],
      serviceCharge: "",
      dob: "",
      gender: undefined,
      profileImage: undefined,
      idCard: undefined,
      educationCertificate: undefined,
      experienceCertificate: undefined
    }
  });

  const onSubmit = async (data: ProviderKYCType) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("service", data.service);
      formData.append("specialization", JSON.stringify(data.specialization)); //array of specialization id
      formData.append("serviceCharge", data.serviceCharge);
      formData.append("dob", data.dob);
      formData.append("gender", data.gender);
      formData.append("profileImage", data.profileImage);
      formData.append("idCard", data.idCard);
      formData.append("educationCertificate", data.educationCertificate);
      if (data.experienceCertificate) {
        formData.append("experienceCertificate", data.experienceCertificate);
      }

      const res = await AuthService.providerKYCApi(formData);
      if (res.status === HttpStatusCode.OK) {
        toast.success(res.data.message || Messages.KYC_SUBMITTED_SUCCESS);
        navigate(-1);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMsg = err?.response?.data?.message || Messages.FAILED_TO_SUBMIT_KYC;
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }

  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
        {/* Service */}
        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="">Main Service</FormLabel>
              <FormControl>
                <Select
                  isClearable
                  isLoading={isLoading}
                  options={categories.map(cat => ({
                    label: cat.name, value: cat.categoryId
                  }))}
                  value={
                    categories
                      .map((cat) => ({
                        label: cat.name,
                        value: cat.categoryId,
                      }))
                      .find((opt) => opt.value === field.value) || null
                  }
                  onChange={(selected) => field.onChange(selected?.value)}
                  className="basic-single text-black"
                  classNamePrefix="select"
                  placeholder="Select a service"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Specialization */}
        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => {
            const selectedServiceId = form.watch("service");
            const selectedCategory = categories.find((cat) => cat.categoryId === selectedServiceId);
            const specializationOptions = selectedCategory?.subcategories.map((sub) => ({
              label: sub.name,
              value: sub.subCategoryId,
            })) || [];
            return (
              <FormItem>
                <FormLabel className="">Specialization</FormLabel>
                <FormControl>
                  <Select
                    isMulti
                    isLoading={isLoading}
                    options={specializationOptions}
                    value={specializationOptions.filter((opt) => field.value.includes(opt.value))}
                    onChange={(selectedOptions) => {
                      field.onChange(selectedOptions.map(opt => opt.value));
                    }}
                    className="basic-multi-select text-black"
                    classNamePrefix="select"
                    placeholder={
                      selectedCategory ? "Select specializations" : "Select a service first"
                    }
                    isDisabled={!selectedCategory}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service Charge */}
          <FormField
            control={form.control}
            name="serviceCharge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Charge</FormLabel>
                <FormDescription className="text-[12px] font-extralight before:content-['*'] before:text-red-500 before:mr-1 before:text-sm before:font-extrabold">20₹ Commision will deductud of on your every service</FormDescription>
                <FormControl>
                  <Input
                    placeholder="300Rs - 500Rs"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* DOB */}
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormDescription
                  className="text-[12px] font-extralight before:content-['*'] before:text-red-500 before:mr-1 before:text-sm before:font-extrabold"
                >
                  Date of Birth must match with your valid Document's
                </FormDescription>
                <FormControl>
                  <Input
                    type="date"
                    min={minYear}
                    max={maxYear}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Gender */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem >
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <RadioGroup
                  className="flex flex-wrap justify-between border-2 rounded-md p-2"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {genderOptions.map((gender) => (
                    <FormItem key={gender} className="flex items-center gap-2">
                      <FormControl>
                        <RadioGroupItem value={gender} />
                      </FormControl>
                      <FormLabel className="font-normal">{gender}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Profile Image */}
        <FormField
          control={form.control}
          name="profileImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ID Card */}
        <FormField
          control={form.control}
          name="idCard"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Card</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Education Certificate */}
        <FormField
          control={form.control}
          name="educationCertificate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Education Certificate</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Experience Certificate */}
        <FormField
          control={form.control}
          name="experienceCertificate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience Certificate</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <Button variant="outline" type="button"
            onClick={() => toggle(false)}
          >
            Go Back
          </Button>
          <Button type="submit" disabled={loading}>Submit KYC</Button>
        </div>
      </form>
    </Form>
  );
};

export default VerifictionForm;


/*
  react-hook-form is not provided by React or ShadCN.
  It is a separate open-source library created by the React community to manage form state and validation efficiently.
  ShadCN UI does not create react-hook-form, but it provides components and patterns that work well with it.
*/