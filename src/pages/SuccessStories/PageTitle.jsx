import engagementImg from "../../assets/images/site/engdagement.png";
import { Check } from "lucide-react"; // tick icon

const PageTitle = () => {
  return (
    <section className="py-16 w-11/12 mx-auto mt-20">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* Left: Text */}
        <div className="lg:w-1/2 w-full text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Where Matches <br />
            Turn Into <span className="text-orange-500">Marriages</span>
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Because the right match deserves a beautiful beginning, and a forever built on trust.
          </p>

          {/* Points */}
          <div className="space-y-3">
            {[
              "Real couples who found their life partner here",
              "Genuine stories shared by happily married families",
              "Authentic photos and verified success journeys",
              "Celebrating marriages across communities and cities",
              "Trusted platform for meaningful connections"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="text-orange-500 w-5 h-5" />
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Image */}
        <div className="lg:w-1/2 w-full flex justify-end">
          <img
            src={engagementImg}
            alt="Happy Couple"
            className="w-full rounded-2xl shadow-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default PageTitle;