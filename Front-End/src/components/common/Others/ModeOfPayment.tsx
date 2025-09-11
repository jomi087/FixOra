"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PaymentMode } from "@/shared/enums/Payment";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { fetchUserWalletInfo } from "@/store/user/walletSlice";

const FormSchema = z.object({
  type: z.enum(PaymentMode)
});

interface ModeOfPaymentProps {
  handlePayment: (paymentType: PaymentMode, balance?: number) => void
  isSubmitting: boolean
}

export const ModeOfPayment: React.FC<ModeOfPaymentProps> = ({ handlePayment, isSubmitting }) => {
  const { data : wallet } = useAppSelector((state) => state.wallet);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserWalletInfo());
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.type === PaymentMode.WALLET) {
      handlePayment(data.type, wallet?.balance );
    } else {
      handlePayment(data.type);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 p-5">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-lg font-bold font-mono underline underline-offset-4">Mode of Payment</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2 "
                >
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value={PaymentMode.WALLET} className="border-2 border-black" />
                    </FormControl>
                    <FormLabel className="font-serif text-lg ">
                      <p>{`Wallet ${wallet?.balance ? `(₹${wallet.balance})` : ""}`}</p>
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <RadioGroupItem value={PaymentMode.ONLINE} className="border-2 border-black" />
                    </FormControl>
                    <FormLabel className="font-serif text-lg">
                      Online
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant={"success"}
          disabled={isSubmitting}
        >
          { isSubmitting ? "Processing..." : "Submit" }
        </Button>
      </form>
    </Form>
  );
};