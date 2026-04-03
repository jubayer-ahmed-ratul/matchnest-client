import React from 'react';
import Banner from './Banner';
import WhoWeAre from './WhoWeAre';
import HowWeWork from './HowWeWork';
import WhyChooseUs from './WhyChooseUs';
import MembershipPlans from './MembershipPlans';
import Gallery from './Gallery';
import FAQ from './FAQ';
import Stats from './Stats';



const Home = () => {
    return (
        <div>
            <Banner></Banner>
            
            <WhoWeAre></WhoWeAre>
            <Stats />
            <HowWeWork></HowWeWork>
            <WhyChooseUs></WhyChooseUs>
            <MembershipPlans></MembershipPlans>
          <Gallery />
          <FAQ />
          
        </div>
    );
};

export default Home;