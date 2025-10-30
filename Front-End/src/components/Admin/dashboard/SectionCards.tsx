import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SectionCards = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 px-4 ">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            <span className="underline underline-offset-4 pr-3">
              Total Revenue
            </span>
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-center mt-2">
            $1,250
          </CardTitle>
          <CardAction></CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription
          >
            <span className="underline underline-offset-4 pr-2">
              Customers
            </span>
            ( <span className="no-underline text-red-400">
               3 blocked 
            </span> )
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-center mt-2">
            7
          </CardTitle>
          <CardAction></CardAction>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            <span className="underline underline-offset-4 pr-2">
              Provider
            </span>
            ( <span className="no-underline text-red-400">
              3 Blocked
            </span> )
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-center mt-2">
            15
          </CardTitle>
          <CardAction></CardAction>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader className="">
          <CardDescription>
            <span className="underline underline-offset-4 pr-2">
              Services
            </span>
            ( <span className="no-underline text-red-400">
               3 In-Active 
            </span> )
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-center mt-2 ">
            8
          </CardTitle>
          <CardAction></CardAction>
        </CardHeader>
      </Card>

      {/* <Card className="@container/card">
        <CardHeader>
          <CardDescription className="underline underline-offset-4">Dispute</CardDescription>
          <CardTitle className="text-4xl font-semibold tabular-nums text-center mt-2">
            3
          </CardTitle>
          <CardAction></CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-center gap-1.5 text-xs font-mono">3 pending disputes</CardFooter>
      </Card> */}
    </div>
  );
};

export default SectionCards;