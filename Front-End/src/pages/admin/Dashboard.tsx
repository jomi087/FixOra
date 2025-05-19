import SideBar from "../../components/Admin/SideBar"
import Nav from "../../components/common/Nav"

const Dashboard:React.FC = () => {
  return (
      <>
      <Nav className='bg-nav-background text-nav-text' />
          <div className="flex pt-16 min-h-screen">
              <SideBar className='min-w-1/5 shrink-0'/>
              <div className="flex-1 ">
                  <p> Welcome to the admin dashboard! </p>
              </div>
         </div>
      </>
  )
}

export default Dashboard