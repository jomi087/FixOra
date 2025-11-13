import { useEffect, useMemo, useState } from "react";
import ManageFunds from "./ManageFunds";
import TransactionsTable from "./TransactionsTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserWalletInfo } from "@/store/common/walletSlice";
import { toast } from "react-toastify";
import { TLPP } from "@/utils/constant";

const Wallet = () => {
  const dispatch = useAppDispatch();
  const [ page, setPage ] = useState(1);
  const limit = TLPP || 10;

  const { data, total:totalTransactionCount, isLoading, error } = useAppSelector((state) => state.wallet);
  
  useEffect(() => {
    dispatch(fetchUserWalletInfo({ page, limit }));
  }, [dispatch, page]);


  const totalPages = useMemo(() =>
    Math.ceil(totalTransactionCount / limit)
  , [totalTransactionCount, limit]
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (isLoading) return <div>Loading wallet...</div>;

  return (
    <div className="w-full p-6 space-y-6">
      <h2 className="text-2xl font-bold underline underline-offset-4 text-foreground">
        Your Wallet
      </h2>
      <ManageFunds balance={data?.balance ?? 0} />
      <TransactionsTable
        transactions={data?.transactions ?? []}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default Wallet;
