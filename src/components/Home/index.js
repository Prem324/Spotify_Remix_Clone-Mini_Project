import Section1 from '../Section1'
import Section2 from '../Section2'
import Section3 from '../Section3'
import Navbar from '../Navbar'

import './index.css'

const Home = () => (
  <div className="home-responsive-container">
    <Navbar />
    <div className="home-container">
      <Section1 />
      <Section2 />
      <Section3 />
    </div>
  </div>
)

export default Home
