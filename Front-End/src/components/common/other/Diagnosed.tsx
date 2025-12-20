interface DiagnosedProps {
  diagnose: {
    description: string;
    replaceParts?: {
      name: string;
      cost: number;
    }[];
  };
}

const Diagnosed: React.FC<DiagnosedProps> = ({ diagnose }) => {
  const totalCost = diagnose.replaceParts?.reduce((sum, part) => sum + part.cost, 0) || 0;

  return (
    <div className="mt-5">
      <div className="mt-2 py-2 md:border-t-2 border-chart-5">
        <div className="text-lg font-semibold mb-1 text-nav-text font-mono text-center underline underline-offset-4">
          <h3>Diagnosed</h3>
        </div>

        <div className="px-2 text-sm font-roboto">
          <p>{diagnose.description}</p>
        </div>
      </div>

      {diagnose.replaceParts && diagnose.replaceParts.length > 0 && (
        <>
          <div className="text-lg md:border-t-2 border-chart-5 font-semibold mt-2 pt-2 text-nav-text font-mono text-center underline underline-offset-4">
            <h3>Extra Parts</h3>
          </div>
          <div className="space-y-1 text-sm text-body-text mt-2">
            {diagnose.replaceParts.map((part, index) => (
              <div key={index} className="flex justify-between">
                <span className="font-semibold">{part.name.toUpperCase()}:</span>
                <span>{part.cost}</span>
              </div>
            ))}
            <hr className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>{totalCost}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Diagnosed;
