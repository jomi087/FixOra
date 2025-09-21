import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, } from "@/components/ui/card";
import { useEffect ,useState } from "react";
import { Messages } from "@/utils/constant";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import AuthService from "@/services/AuthService";
import { loadStripe } from "@stripe/stripe-js";
import socket from "@/services/soket";


const ManageFunds: React.FC<{ balance: number }> = ({ balance }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handlePaymentSuccess = () => {
      toast.success("Payment successFull");
    };

    const handlePaymentFailed = (reason: string) => {
      toast.error(reason);
    };

    socket.on("payment:success", handlePaymentSuccess);
    socket.on("payment:failure", handlePaymentFailed);

    return () => {
      socket.off("payment:success", handlePaymentSuccess );
      socket.off("payment:failure", handlePaymentFailed );
    };
  }, []);

  const handleAddFund = async () => {
    try {
      const numAmount = Number(amount);
      if (!amount || isNaN(numAmount)) {
        setError("Please enter a valid amount.");
        return;
      }
      if (numAmount <= 0) {
        setError("Amount must be greater than 0.");
        return;
      }
      if (numAmount > 50000) {
        setError("Amount cannot exceed ₹50,000.");
        return;
      }

      const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

      const res = await AuthService.addFundApi(numAmount);
      const sessionId = res.data;
      const stripe = await stripePromise;

      if (!stripe) throw new Error(Messages.STRIPE_FAILED);
      await stripe.redirectToCheckout({ sessionId: sessionId });

      //dispatch(addFund(res.data.))
      setAmount("");
      setOpen(false);

    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMsg = err.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
      toast.error(errorMsg);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-3xl font-semibold text-green-600">₹{balance}</h2>
      </CardContent>
      <CardFooter>

        {/* Dialog trigger wraps the button */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              Add Money
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Money to Wallet</DialogTitle>
              <DialogDescription>
                Enter the amount you would like to add to your wallet.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => {
                  let value = e.target.value;
                  setAmount(value);
                  setError("");
                }}
              />
              {error && <p className="m-2 text-sm text-destructive">{error}</p>}
            </div>

            <DialogFooter>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleAddFund}
              >
                Add Funds
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setError("");
                  setAmount("");
                }}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>

        </Dialog>

      </CardFooter>
    </Card>
  );
};

export default ManageFunds;