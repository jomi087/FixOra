
const SearchFilterBar:React.FC = () => {
  return (
        <div className='m-6 mb-2  flex justify-between ' aria-label={'search &  filter '} >
            <div className="flex items-center  border w-80 focus-within:border-indigo-500 transition duration-300 pr-3 gap-2  border-gray-500/30 h-[46px] rounded-[5px] overflow-hidden">
                <input type="text" placeholder="Search User" className="w-full h-full pl-4 outline-none placeholder-body-text/70 text-sm" />
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={22} height={22} viewBox="0 0 30 30" fill="#6B7280">
                  <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z" />
                </svg> 
            </div>
            <div className="flex gap-5 ">
                <div className='m-1'>
                    <select
                        // onChange={}
                        // value={}
                        className="border border-gray-300 rounded px-8 h-full text-sm bg-body-background text-body-text "
                        >
                        <option  value="" disabled>Filter</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select> 
                </div>
                <div className='m-1 '>
                    <select
                        // onChange={}
                        // value={}
                        className="border border-gray-300 rounded px-8 h-full text-sm bg-body-background text-body-text"
                        >
                        <option value="" disabled>Sort</option>
                        <option value="1">A-Z</option>
                        <option value="-1">Z-A</option>

                    </select> 
                </div>    
            </div>  
        </div>  )
}

export default SearchFilterBar