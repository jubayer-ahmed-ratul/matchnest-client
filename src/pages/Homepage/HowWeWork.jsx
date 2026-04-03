import React from "react";
import howWorkImg from "../../assets/images/site/how_work_section.jpg";

const steps = [
  { number: 1, title: "Sign Up", description: "Create your profile quickly and securely." },
  { number: 2, title: "Find Matches", description: "Explore profiles that match your preferences." },
  { number: 3, title: "Connect", description: "Send interest and chat with compatible matches." },
  { number: 4, title: "Meet & Celebrate", description: "Meet your perfect match and start your journey." },
];

const HowWeWork = () => {
  return (
    <section className="py-10 w-11/12 mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-20">
        {/* Left: Image */}
        <div className="lg:w-1/2 w-full">
          <img
            src={howWorkImg}
            alt="How We Work"
            className="w-full md:h-[450px] rounded-xl shadow-lg"
          />
        </div>

        {/* Right: Content */}
        <div className="lg:w-1/2 w-full">
          {/* Header Section */}
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              <span className="text-orange-500">How</span> We Work
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our simple 4-step process makes finding your perfect match easy and enjoyable. 
              Follow these steps to start your journey towards a meaningful relationship.
            </p>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-8 relative">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-start relative">
                {/* Circle with number */}
                <div className="flex flex-col items-center">
                  <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg z-10">
                    {step.number}
                  </div>

                  {/* Line connecting to next step */}
                  {index !== steps.length - 1 && (
                    <div className="w-1 bg-orange-300 h-full mt-2 absolute top-12"></div>
                  )}
                </div>

                {/* Step content */}
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;