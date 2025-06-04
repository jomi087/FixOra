import InfoCard from "../../components/admin/InfoCard"
import SideBar from "../../components/admin/SideBar"
import Nav from "../../components/common/layout/Nav"
import Pagination from "../../components/common/Pagination";
import SearchFilterBar from "../../components/common/SearchFilterBar";

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

const data :Array<data> = [
    { id: 1, Fname: 'John', Lname: 'Doe',   email: 'john@example.com', mobileNo: '123-456-7890', status: true , role:'user' },
    { id: 2, Fname: 'Jane', Lname: 'Smith', email: 'jane@example.com', mobileNo: '098-765-4321', status: false , role:'user'  },
    { id: 1, Fname: 'John', Lname: 'Doe',   email: 'john@example.com', mobileNo: '123-456-7890', status: true , role:'user' },
    { id: 2, Fname: 'Jane', Lname: 'Smith', email: 'jane@example.com', mobileNo: '098-765-4321', status: false , role:'user' },
    { id: 1, Fname: 'John', Lname: 'Doe',   email: 'john@example.com', mobileNo: '123-456-7890', status: true , role:'user' },
    { id: 2, Fname: 'Jane', Lname: 'Smith', email: 'jane@example.com', mobileNo: '098-765-4321', status: false , role:'user' },
    { id: 1, Fname: 'John', Lname: 'Doe',   email: 'john@example.com', mobileNo: '123-456-7890', status: true , role:'user' },
    { id: 2, Fname: 'Jane', Lname: 'Smith', email: 'jane@example.com', mobileNo: '098-765-4321', status: false , role:'user' }
]

const UserManagement:React.FC = () => {
  return (
      <>
        <Nav className='bg-nav-background text-nav-text' />
          <div className="flex pt-16 min-h-screen">
              <SideBar  />
              <div className="flex-1 bg-footer-background text-body-text ">
                  <SearchFilterBar/>
                  <InfoCard datas={data} />
                  <Pagination/>
              </div> 
          </div>
      </>
  )
}

export default UserManagement