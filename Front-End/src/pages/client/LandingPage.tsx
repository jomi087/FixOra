import Footer from '@/components/Common/Footer'
import Nav from "@/components/Common/Nav"

const LandingPage = () => {
  return (
    <>
      <Nav/>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Landing Page</h1>
        <p className="text-lg mb-8">This is a simple landing page built with React and Tailwind CSS.</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Get Started
        </button>
      </div>
      <Footer/>
    </>
  )
}

export default LandingPage