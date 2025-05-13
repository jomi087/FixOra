import { useState } from "react"
import BlogsPreview from "../../components/client/BlogsPreview"
import Hero from "../../components/client/Hero"
import LearnMore from "../../components/client/LearnMore"
import Footer from "../../components/common/Footer"
import Nav from "../../components/common/Nav"


const LandingPage = () => {

  return (
    <div >
      <Nav className={'bg-nav-background text-nav-text'} />
      <div className="pt-16 bg-body-background text-body-text ">
        <Hero />
        <LearnMore />
        <BlogsPreview/> 
      </div>
      <Footer props={'bg-footer-background text-footer-text'} />
    </div>

  )
}

export default LandingPage


