import { Link } from "react-router-dom";
import marry1 from "../../assets/images/site/marry.jpg";
import marry2 from "../../assets/images/site/marry2.jpg";
import marry3 from "../../assets/images/site/marry3.jpg";
import marry4 from "../../assets/images/site/marry4.jpg";

const Gallery = () => {
  return (
    <section className="py-10 w-11/12 mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Our <span className="text-orange-500">Gallery</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Moments of love, joy, and new beginnings from our happy couples.
        </p>
      </div>

      {/* Mobile: single column, Desktop: original grid */}
      <div className="hidden md:grid grid-cols-2 gap-4 h-[500px]">
        <div className="rounded-2xl overflow-hidden">
          <img src={marry1} alt="Gallery 1" className="w-full h-full object-cover" />
        </div>
        <div className="grid grid-rows-2 gap-4 h-[500px]">
          <div className="rounded-2xl overflow-hidden">
            <img src={marry2} alt="Gallery 2" className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden">
              <img src={marry3} alt="Gallery 3" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img src={marry4} alt="Gallery 4" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile only: single column */}
      <div className="flex flex-col gap-4 md:hidden">
        {[marry1, marry2, marry3, marry4].map((img, i) => (
          <div key={i} className="rounded-2xl overflow-hidden">
            <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-64 object-cover" />
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          to="/success-stories"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition inline-block"
        >
          Explore Our Success Stories →
        </Link>
      </div>
    </section>
  );
};

export default Gallery;
