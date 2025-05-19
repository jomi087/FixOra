
const Pagination:React.FC = () => {
    return (
        <div className="flex justify-end items-center gap-3 p-6">
            <button  className="px-4 py-1 rounded border disabled:opacity-50"
            // onClick={}
            // disabled={} 
            >
                Prev
            </button>
            <p className={`px-3 py-1 rounded `}
                // key={}
                // onClick={}
            >
                {1}
            </p>
            <button  className="px-4 py-1 rounded border disabled:opacity-50"
            //   onClick={}
            //   disabled={}
            >
                Next
            </button>
        </div>
    )
}

export default Pagination