import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building2,
  Heart,
  BarChart3,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  LogOut,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { adminAPI } from "@/services/api";
import { toast } from "sonner";
import { RoleBasedTabs } from "@/components/role-based-tabs";

interface PendingApproval {
  id: string;
  name: string;
  type: "restaurant" | "orphanage";
  created_at: string;
}

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalOrphanages: 0,
    activeListings: 0,
    totalClaims: 0,
  });
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      try {
        // Fetch admin stats
        const statsResponse = await adminAPI.getStats();
        setStats(statsResponse.data);

        // Fetch pending approvals
        const approvalsResponse = await adminAPI.getPendingApprovals();
        setPendingApprovals(approvalsResponse.data || []);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }

      // The pending approvals are already set from the API response
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (
    id: string,
    type: "restaurant" | "orphanage",
  ) => {
    try {
      await adminAPI.approveEntity(id, type);
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} approved successfully!`,
      );
      fetchAdminData();
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    }
  };

  const handleReject = async (id: string, type: "restaurant" | "orphanage") => {
    try {
      await adminAPI.rejectEntity(id, type);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} rejected`);
      fetchAdminData();
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  const statsDisplay = [
    {
      label: "Total Restaurants",
      value: stats.totalRestaurants?.toString() || "0",
      icon: Building2,
      color: "text-primary",
    },
    {
      label: "Total Orphanages",
      value: stats.totalOrphanages?.toString() || "0",
      icon: Heart,
      color: "text-pink",
    },
    {
      label: "Active Listings",
      value: stats.activeListings?.toString() || "0",
      icon: BarChart3,
      color: "text-coral",
    },
    {
      label: "Total Claims",
      value: stats.totalClaims?.toString() || "0",
      icon: Users,
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
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-primary" />
                <h1 className="text-4xl font-bold text-foreground">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-muted-foreground">
                Manage the Food Rescue Network platform with advanced tab
                navigation.
              </p>
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </motion.div>

          {/* Enhanced Role-Based Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <RoleBasedTabs
              role="admin"
              variant="modern"
              searchable={true}
              persistent={true}
            />
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
