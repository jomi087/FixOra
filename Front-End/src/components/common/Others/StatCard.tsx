const StatCard = ({ title, value, footer }: { title: string; value: number|string ; footer?: string }) => {
  return (
    <section className="p-4 border rounded-xl bg-primary-foreground shadow-sm hover:shadow-lg transition-shadow duration-200">
      <header>
        <p className="text-sm font-serif underline underline-offset-4 pr-2">
          {title}
        </p>
      </header>
      <main>
        <h2 className="text-2xl font-semibold tabular-nums text-center mt-2" >
          {value ?? "N/A"}
        </h2>
      </main>
      {footer &&
        <footer
          className="mt-1 text-xs text-red-400 text-center"
        >
          {footer}
        </footer>
      }
    </section>
  );
};

export default StatCard;