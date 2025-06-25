interface FilterOption {
  label: string;
  value: string;
}

interface SearchFilterBarProps {
  filterOptions: FilterOption[];
  searchQuery: string;
  onSearch: (query: string) => void;
  onFilter: (value: string) => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({ filterOptions, searchQuery, onSearch, onFilter }) => {
  
  return (
    <div className="m-4 md:m-6 mb-2 flex flex-col md:flex-row md:justify-between gap-4 items-start md:items-center ">
      <div className="flex items-center border w-full md:w-70 pr-3 gap-2 border-gray-500/30 h-[40px] rounded-[5px] bg-white">
        <label htmlFor="search" className="sr-only">Search Users</label>
        <input
          type="text"
          placeholder="Search User"
          className="w-full h-full pl-4 outline-none placeholder-body-text/70 dark:placeholder:text-black text-sm text-black "
          onChange={(e) => onSearch(e.target.value)}
          value={searchQuery}
        />
      </div> 

      <div className="flex gap-4">
        <select
          className="border border-gray-300 rounded px-4 py-2 text-sm bg-body-background text-body-text"
          onChange={(e) => onFilter(e.target.value)}
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchFilterBar;
