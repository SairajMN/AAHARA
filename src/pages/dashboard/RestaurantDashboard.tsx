import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Package,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  LogOut,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { restaurantAPI } from "@/services/api";
import { toast } from "sonner";

interface FoodListing {
  _id: string;
  title: string;
  quantity: string;
  expires_at: string;
  status: string;
}

interface Restaurant {
  _id: string;
  name: string;
}

const RestaurantDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    claimedToday: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRestaurantData();
    }
  }, [user]);

  const fetchRestaurantData = async () => {
    try {
      try {
        // Fetch restaurant profile
        const profileResponse = await restaurantAPI.getProfile(user!.id);
        setRestaurant(profileResponse.data);

        // Fetch food listings
        const listingsResponse = await restaurantAPI.getListings(
          profileResponse.data._id,
        );
        setListings(listingsResponse.data || []);

        // Calculate stats
        const activeCount =
          listingsResponse.data?.filter(
            (l: FoodListing) => l.status === "available",
          ).length || 0;
        const totalCount = listingsResponse.data?.length || 0;

        setStats({
          totalListings: totalCount,
          activeListings: activeCount,
          claimedToday: 0, // This would need a separate API endpoint
        });
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      return `${Math.floor(hours / 24)} days`;
    }
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const statsDisplay = [
    {
      label: "Total Listings",
      value: stats.totalListings?.toString() || "0",
      icon: Package,
      color: "text-primary",
    },
    {
      label: "Active Listings",
      value: stats.activeListings?.toString() || "0",
      icon: Clock,
      color: "text-coral",
    },
    {
      label: "Claims Today",
      value: stats.claimedToday?.toString() || "0",
      icon: CheckCircle,
      color: "text-orange",
    },
    { label: "Impact", value: "Growing!", icon: Users, color: "text-pink" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {restaurant?.name || "Restaurant Dashboard"}
              </h1>
              <p className="text-muted-foreground">
                Welcome back! Here's your impact summary.
              </p>
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statsDisplay.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg">
                <Package className="w-5 h-5 mr-2" />
                Post New Listing
              </Button>
              <Button variant="heroOutline" size="lg">
                <MapPin className="w-5 h-5 mr-2" />
                View Map
              </Button>
            </div>
          </motion.div>

          {/* Recent Listings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Recent Listings
              </h2>
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            {listings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No listings yet. Create your first food listing!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div
                    key={listing._id}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {listing.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {listing.quantity} • Expires in{" "}
                        {getTimeRemaining(listing.expires_at)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        listing.status === "available"
                          ? "bg-primary/20 text-primary"
                          : "bg-pink/20 text-pink"
                      }`}
                    >
                      {listing.status === "available" ? "Active" : "Claimed"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RestaurantDashboard;
