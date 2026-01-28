import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Heart,
  MapPin,
  Clock,
  Package,
  Bell,
  LogOut,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { orphanageAPI } from "@/services/api";
import { toast } from "sonner";

interface FoodListing {
  _id: string;
  title: string;
  quantity: string;
  expires_at: string;
  status: string;
  restaurants: {
    name: string;
    address: string;
    city: string;
  } | null;
}

interface Orphanage {
  _id: string;
  name: string;
}

const OrphanageDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [orphanage, setOrphanage] = useState<Orphanage | null>(null);
  const [availableListings, setAvailableListings] = useState<FoodListing[]>([]);
  const [claimsCount, setClaimsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrphanageData();
    }
  }, [user]);

  const fetchOrphanageData = async () => {
    try {
      try {
        // Fetch orphanage profile
        const profileResponse = await orphanageAPI.getProfile(user!.id);
        setOrphanage(profileResponse.data);

        // Fetch claims count - this would need a separate API endpoint
        setClaimsCount(0);

        // Fetch available food listings
        const listingsResponse = await orphanageAPI.getAvailableListings();
        setAvailableListings(listingsResponse.data || []);
      } catch (error) {
        console.error("Error fetching orphanage data:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async (listingId: string) => {
    if (!orphanage) {
      toast.error("Orphanage profile not found");
      return;
    }

    try {
      await orphanageAPI.claimListing(listingId);
      toast.success("Food claimed successfully! The restaurant will be notified.");
      fetchOrphanageData(); // Refresh data
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
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

  const stats = [
    {
      label: "Total Claims",
      value: claimsCount.toString(),
      icon: Heart,
      color: "text-pink",
    },
    {
      label: "Active Claims",
      value: "0",
      icon: Package,
      color: "text-primary",
    },
    {
      label: "Nearby Listings",
      value: availableListings.length.toString(),
      icon: MapPin,
      color: "text-coral",
    },
    {
      label: "This Week",
      value: "Growing!",
      icon: Clock,
      color: "text-orange",
    },
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
                {orphanage?.name || "Orphanage Dashboard"}
              </h1>
              <p className="text-muted-foreground">
                Find and claim available food nearby.
              </p>
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
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
                <MapPin className="w-5 h-5 mr-2" />
                View Food Map
              </Button>
              <Button variant="heroOutline" size="lg">
                <Bell className="w-5 h-5 mr-2" />
                Notification Settings
              </Button>
            </div>
          </motion.div>

          {/* Nearby Listings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Available Nearby
              </h2>
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            {availableListings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>
                  No food listings available at the moment. Check back soon!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {listing.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {listing.restaurants?.name || "Unknown Restaurant"} •{" "}
                        {listing.quantity}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{" "}
                          {listing.restaurants?.city || "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Expires in{" "}
                          {getTimeRemaining(listing.expires_at)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={() => handleClaim(listing._id)}
                    >
                      Claim
                    </Button>
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

export default OrphanageDashboard;
