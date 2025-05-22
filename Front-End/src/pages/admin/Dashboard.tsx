import DashBoard from "../../components/Admin/DashBoard"
import SideBar from "../../components/Admin/SideBar"
import Nav from "../../components/common/layout/Nav"

const Dashboard:React.FC = () => {
  return (
      <>
        <Nav className='bg-nav-background text-nav-text' />
        <div className="flex pt-16 min-h-screen">
            <SideBar />
            <DashBoard />
        </div>
      </>
  )
}

export default Dashboard