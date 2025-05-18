import SideBar from "../../components/Admin/SideBar"
import Nav from "../../components/common/Nav"

const Dashboard = () => {
  return (
      <>
          <Nav className='bg-nav-background text-nav-text' />
          <div className="flex pt-16 ">
              <SideBar />
              <div className="w-full bg-footer-background text-body-text">
                  <h1 className="text-2xl font-bold">Dashboard</h1>
                  <p> Welcome to the admin dashboard! </p>
              </div>
              
         </div>
      </>
  )
}

export default Dashboard