import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Utensils, MapPin, Heart, Shield, Bell, BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0 gradient-radial opacity-60" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 leading-tight">
                Ending Food Waste,
                <br />
                <span className="text-primary">Feeding Hope</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Connect restaurants with surplus food to orphanages in need. Real-time
              geolocation, instant notifications, and a sustainable revenue model
              through ads.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register?type=restaurant">
                <Button variant="hero" size="lg" className="min-w-[200px]">
                  I'm a Restaurant
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/register?type=orphanage">
                <Button variant="heroOutline" size="lg" className="min-w-[200px]">
                  I'm an Orphanage
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border border-border/50">
              <img
                src={heroImage}
                alt="Volunteers sharing food with children"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A simple three-step process to reduce food waste and help communities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Utensils className="w-8 h-8 text-primary-foreground" />}
              iconBg="bg-primary"
              title="Restaurants List Food"
              description="At the end of the day, restaurants post surplus food with quantity, expiry time, and location details."
              delay={0}
            />
            <FeatureCard
              icon={<MapPin className="w-8 h-8 text-foreground" />}
              iconBg="bg-pink"
              title="Geolocation Matching"
              description="Orphanages within a configurable radius are instantly notified about available food nearby."
              delay={0.15}
            />
            <FeatureCard
              icon={<Heart className="w-8 h-8 text-foreground" />}
              iconBg="bg-coral"
              title="Orphanages Claim"
              description="Quick claim process ensures food reaches those in need. Confirm pickup and reduce waste together."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-card/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built with enterprise-grade security and modern technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Bell className="w-8 h-8 text-primary-foreground" />}
              iconBg="bg-primary"
              title="Real-time Notifications"
              description="Instant push notifications when food becomes available nearby. Never miss an opportunity to help."
              delay={0}
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-foreground" />}
              iconBg="bg-pink"
              title="Enterprise Security"
              description="JWT authentication, encrypted data, and comprehensive audit logs keep your data safe."
              delay={0.1}
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8 text-foreground" />}
              iconBg="bg-coral"
              title="Analytics Dashboard"
              description="Track impact metrics, view history, and measure your contribution to reducing food waste."
              delay={0.2}
            />
            <FeatureCard
              icon={<MapPin className="w-8 h-8 text-primary-foreground" />}
              iconBg="bg-primary"
              title="Interactive Maps"
              description="Map-based view shows available food listings and optimal pickup routes."
              delay={0.3}
            />
            <FeatureCard
              icon={<Utensils className="w-8 h-8 text-foreground" />}
              iconBg="bg-orange"
              title="Auto-expiry System"
              description="Listings automatically expire to ensure food freshness and safety standards."
              delay={0.4}
            />
            <FeatureCard
              icon={<Heart className="w-8 h-8 text-foreground" />}
              iconBg="bg-pink"
              title="Verified Partners"
              description="Admin-approved restaurants and orphanages ensure trust and reliability."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-radial opacity-40" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Join our platform today and be part of the solution to food waste and
              hunger.
            </p>
            <Link to="/register">
              <Button variant="hero" size="xl" className="glow-teal animate-glow">
                Join Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
