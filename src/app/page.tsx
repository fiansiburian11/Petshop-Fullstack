import BestProducts from "@/components/BestProducts";
import CustomerOption from "@/components/CustomerOption";
import FeaturesSection from "@/components/FeatureSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HubKami from "@/components/HubKami";

const HomePage = () => {


  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <HubKami id="tentang" />
      <BestProducts />
      <CustomerOption />
      <Footer />
    </div>
  );
};

export default HomePage;
