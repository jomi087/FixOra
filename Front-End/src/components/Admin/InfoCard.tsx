// import { IoPersonCircleSharp } from "react-icons/io5";
import { IoPersonCircleOutline } from "react-icons/io5";


interface data {
    id: number;
    Fname: string;
    Lname: string;
    email: string;
    mobileNo: string;
    status: boolean;
    image?: string;
    role: string;
}


interface DataProps {
    datas:data[]
}


const InfoCard:React.FC <DataProps> = ({datas}) => {
    return (
        <div className="flex justify-evenly flex-wrap gap-2 m-5" aria-label={`user list and info cards `}>
            {datas.map((data) => (
                <div key={data.email} className="py-5 hover:scale-110" role="listitem" aria-label={`card About ${data.Fname}`}> {/*  leter key to be given _id */}
                    
                    <div className="rounded-3xl cursor-pointer border-l-10 border-t-1 border-b-1 border-r-1   shadow-lg shadow-gray-800 ">
                        <div className="flex justify-center rounded-t-3xl ">
                            <button className={` ${ data.status ? 'hover:bg-green-400' : 'hover:bg-red-400'} font-semibold px-10 border-b-1 border-l-1 border-r-1 rounded-b-2xl `} aria-label={`toggle button for changeing status current status is  ${data.status}`} >{data.status ? 'Active ' : 'In-Active'} </button>
                        </div>

                        <div className="max-h-44 overflow-hidden flex justify-center mt-4   ">
                            {data.image ?
                                (<img src={data.image} alt="dummy image" className="" />) :
                                (<IoPersonCircleOutline size={155} className="text-userIcon-text"/>)
                            }
                        </div>
                        
                        <h6 className="text-lg font-bold text-center underline m-2">{data.Fname.toUpperCase()}</h6>
                        <div className="flex justify-between mb-2 ">
                            <p className="text-sm font-semibold font-mono text-start px-2">Full Name :</p>
                            <p className="text-sm font-semibold text-end px-2">{`${data.Fname} ${data.Lname}`}</p>
                        </div>
                        <div className="flex justify-between mb-2">
                            <p className="text-sm font-semibold font-mono text-start px-2">Email :</p>
                            <p className="text-sm font-semibold text-end px-2">{data.email}</p>
                        </div>
                        <div className="flex justify-between mb-2 ">
                            <p className="text-sm font-semibold font-mono text-start px-2">Mobile :</p>
                            <p className="text-sm font-semibold text-end px-2">{data.mobileNo}</p>
                        </div>

                    </div>
                </div>
            ))}
        </div> 
     )
}

export default InfoCard

