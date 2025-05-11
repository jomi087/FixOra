import Footer from "../../components/common/Footer"
import Nav from "../../components/common/Nav"

const LandingPage = () => {
  return (
    <div >
      <Nav props={'bg-nav-background text-nav-text'} />
      <div className="flex flex-col items-center justify-center h-screen bg-body-background text-body-text ">
        <h1 className="font-bold text-4xl bg-sla"> HI, its me jomi </h1>
      </div>
      <Footer props={'bg-footer-background text-footer-text'} />
    </div>
  )
}

export default LandingPage