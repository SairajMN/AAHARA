import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users, Building2, Heart, BarChart3, Shield,
  Settings, Clock, CheckCircle, XCircle,
  FileText, Activity, TrendingUp, Calendar,
  MapPin, Utensils, Baby, Star, Award,
  AlertTriangle, Bell, Search, Filter,
  Download, Upload, Eye, Edit, Trash2,
  CheckSquare, Square, MoreHorizontal, RefreshCw,
  BarChart, PieChart, TrendingDown, Zap
} from "lucide-react";
import AdvancedTabs from "./advanced-tabs";
import { TabItem } from "./advanced-tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface RoleBasedTabsProps {
  role: "admin" | "restaurant" | "orphanage";
  variant?: "default" | "pills" | "underlined" | "modern";
  searchable?: boolean;
  persistent?: boolean;
}

export const RoleBasedTabs: React.FC<RoleBasedTabsProps> = ({
  role,
  variant = "modern",
  searchable = true,
  persistent = true,
}) => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");

  // Get tabs based on role
  const getTabs = (): TabItem[] => {
    const commonTabs: TabItem[] = [
      {
        id: "overview",
        label: "Overview",
        icon: Activity,
        content: <OverviewTab role={role} />,
      },
    ];

    switch (role) {
      case "admin":
        return [
          ...commonTabs,
          {
            id: "approvals",
            label: "Approvals",
            icon: Shield,
            badge: "12",
            content: <ApprovalsTab />,
          },
          {
            id: "users",
            label: "Users",
            icon: Users,
            badge: "156",
            content: <UsersTab />,
          },
          {
            id: "restaurants",
            label: "Restaurants",
            icon: Building2,
            content: <RestaurantsTab />,
          },
          {
            id: "orphanages",
            label: "Orphanages",
            icon: Heart,
            content: <OrphanagesTab />,
          },
          {
            id: "analytics",
            label: "Analytics",
            icon: BarChart3,
            content: <AnalyticsTab />,
          },
          {
            id: "settings",
            label: "Settings",
            icon: Settings,
            content: <AdminSettingsTab />,
          },
        ];

      case "restaurant":
        return [
          ...commonTabs,
          {
            id: "listings",
            label: "My Listings",
            icon: Utensils,
            badge: "8",
            content: <ListingsTab />,
          },
          {
            id: "orders",
            label: "Orders",
            icon: FileText,
            badge: "3",
            content: <OrdersTab />,
          },
          {
            id: "analytics",
            label: "Analytics",
            icon: TrendingUp,
            content: <RestaurantAnalyticsTab />,
          },
          {
            id: "profile",
            label: "Profile",
            icon: Building2,
            content: <ProfileTab role="restaurant" />,
          },
          {
            id: "settings",
            label: "Settings",
            icon: Settings,
            content: <SettingsTab />,
          },
        ];

      case "orphanage":
        return [
          ...commonTabs,
          {
            id: "available-food",
            label: "Available Food",
            icon: Utensils,
            content: <AvailableFoodTab />,
          },
          {
            id: "requests",
            label: "My Requests",
            icon: Heart,
            badge: "5",
            content: <RequestsTab />,
          },
          {
            id: "history",
            label: "History",
            icon: Clock,
            content: <HistoryTab />,
          },
          {
            id: "profile",
            label: "Profile",
            icon: Heart,
            content: <ProfileTab role="orphanage" />,
          },
          {
            id: "settings",
            label: "Settings",
            icon: Settings,
            content: <SettingsTab />,
          },
        ];

      default:
        return commonTabs;
    }
  };

  return (
    <div className="w-full">
      <AdvancedTabs
        tabs={getTabs()}
        variant={variant}
        searchable={searchable}
        persistent={persistent}
        onTabChange={(tabId) => {
          console.log(`Tab changed to: ${tabId} for role: ${role}`);
        }}
      />
    </div>
  );
};

// Tab Components
const OverviewTab: React.FC<{ role: string }> = ({ role }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              +2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +5 new this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">
              -15min from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "New food listing created", time: "2 hours ago", type: "success" },
              { action: "Order #1234 completed", time: "4 hours ago", type: "info" },
              { action: "Profile updated", time: "1 day ago", type: "neutral" },
              { action: "New orphanage registered", time: "2 days ago", type: "success" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  item.type === "success" ? "bg-green-500" :
                  item.type === "info" ? "bg-blue-500" :
                  "bg-gray-500"
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ApprovalsTab: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Pending Approvals</CardTitle>
      <CardDescription>Review and approve restaurant and orphanage registrations</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { name: "Restaurant ABC", type: "Restaurant", time: "2 hours ago" },
          { name: "Orphanage XYZ", type: "Orphanage", time: "4 hours ago" },
          { name: "Restaurant DEF", type: "Restaurant", time: "1 day ago" },
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {item.type === "Restaurant" ? (
                <Building2 className="w-5 h-5 text-primary" />
              ) : (
                <Heart className="w-5 h-5 text-pink" />
              )}
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.type} • {item.time}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="hero" size="sm">
                <CheckCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const UsersTab: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>User Management</CardTitle>
      <CardDescription>Manage all platform users and their permissions</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { name: "John Doe", role: "Restaurant Owner", status: "Active", joined: "Jan 2024" },
          { name: "Jane Smith", role: "Orphanage Director", status: "Active", joined: "Dec 2023" },
          { name: "Bob Wilson", role: "Restaurant Owner", status: "Pending", joined: "Jan 2024" },
        ].map((user, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.role} • Joined {user.joined}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                {user.status}
              </Badge>
              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const RestaurantsTab: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Restaurant Partners</CardTitle>
      <CardDescription>Manage restaurant partnerships and verification</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { name: "Restaurant ABC", location: "Downtown", verified: true, listings: 12 },
          { name: "Cafe XYZ", location: "Midtown", verified: false, listings: 8 },
          { name: "Bistro DEF", location: "Uptown", verified: true, listings: 15 },
        ].map((restaurant, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium">{restaurant.name}</p>
                <p className="text-sm text-muted-foreground">{restaurant.location} • {restaurant.listings} listings</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={restaurant.verified ? "default" : "secondary"}>
                {restaurant.verified ? "Verified" : "Pending"}
              </Badge>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const OrphanagesTab: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Orphanage Partners</CardTitle>
      <CardDescription>Manage orphanage partnerships and verification</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { name: "Orphanage ABC", location: "North Side", verified: true, children: 45 },
          { name: "Care Home XYZ", location: "South Side", verified: false, children: 32 },
          { name: "Children's Home DEF", location: "East Side", verified: true, children: 28 },
        ].map((orphanage, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-pink" />
              <div>
                <p className="font-medium">{orphanage.name}</p>
                <p className="text-sm text-muted-foreground">{orphanage.location} • {orphanage.children} children</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={orphanage.verified ? "default" : "secondary"}>
                {orphanage.verified ? "Verified" : "Pending"}
              </Badge>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const AnalyticsTab: React.FC = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Platform Analytics</CardTitle>
        <CardDescription>Comprehensive insights into platform performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">89%</div>
            <p className="text-sm text-muted-foreground">Food Rescue Rate</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600">2.4h</div>
            <p className="text-sm text-muted-foreground">Avg Response Time</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-bold text-purple-600">156</div>
            <p className="text-sm text-muted-foreground">Active Partners</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-bold text-orange-600">1,234</div>
            <p className="text-sm text-muted-foreground">Meals Rescued</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const ListingsTab: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filter, setFilter] = useState("all");

  const listings = [
    { id: "1", name: "Pasta Bowl", quantity: "20 portions", status: "Available", time: "2 hours ago", selected: false },
    { id: "2", name: "Sandwiches", quantity: "15 pieces", status: "Reserved", time: "4 hours ago", selected: false },
    { id: "3", name: "Salad", quantity: "10 bowls", status: "Picked up", time: "1 day ago", selected: false },
  ];

  const filteredListings = listings.filter(listing =>
    filter === "all" || listing.status.toLowerCase() === filter
  );

  const handleSelectAll = () => {
    if (selectedItems.length === filteredListings.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredListings.map(l => l.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    toast.success(`${action} applied to ${selectedItems.length} items`);
    setSelectedItems([]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>My Food Listings</CardTitle>
            <CardDescription>Manage your food donations and listings</CardDescription>
          </div>
          {selectedItems.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleBulkAction("Delete")}>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete ({selectedItems.length})
              </Button>
              <Button variant="hero" size="sm" onClick={() => handleBulkAction("Mark as Available")}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark Available
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "available" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("available")}
            >
              Available
            </Button>
            <Button
              variant={filter === "reserved" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("reserved")}
            >
              Reserved
            </Button>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Checkbox
              checked={selectedItems.length === filteredListings.length && filteredListings.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-muted-foreground">Select All</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedItems.includes(listing.id)}
                  onCheckedChange={() => handleSelectItem(listing.id)}
                />
                <Utensils className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{listing.name}</p>
                  <p className="text-sm text-muted-foreground">{listing.quantity} • {listing.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={
                  listing.status === "Available" ? "default" :
                  listing.status === "Reserved" ? "secondary" : "outline"
                }>
                  {listing.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const OrdersTab: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Order Management</CardTitle>
      <CardDescription>Track and manage food pickup orders</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { id: "1234", restaurant: "Restaurant ABC", items: "Pasta Bowl x20", status: "Pending", time: "2 hours ago" },
          { id: "1235", restaurant: "Cafe XYZ", items: "Sandwiches x15", status: "Confirmed", time: "4 hours ago" },
          { id: "1236", restaurant: "Bistro DEF", items: "Salad x10", status: "Completed", time: "1 day ago" },
        ].map((order, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-sm text-muted-foreground">{order.restaurant} • {order.items} • {order.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={
                order.status === "Completed" ? "default" :
                order.status === "Confirmed" ? "secondary" : "outline"
              }>
                {order.status}
              </Badge>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const RestaurantAnalyticsTab: React.FC = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Restaurant Analytics</CardTitle>
        <CardDescription>Your donation impact and performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">47</div>
            <p className="text-sm text-muted-foreground">Meals Donated</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <p className="text-sm text-muted-foreground">Active Listings</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-bold text-purple-600">89%</div>
            <p className="text-sm text-muted-foreground">Pickup Rate</p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-bold text-orange-600">4.2</div>
            <p className="text-sm text-muted-foreground">Avg Rating</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const ProfileTab: React.FC<{ role: "restaurant" | "orphanage" }> = ({ role }) => (
  <Card>
    <CardHeader>
      <CardTitle>Profile Information</CardTitle>
      <CardDescription>Manage your {role} profile and settings</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Organization Name</label>
            <Input defaultValue={`${role.charAt(0).toUpperCase() + role.slice(1)} ABC`} />
          </div>
          <div>
            <label className="text-sm font-medium">Contact Email</label>
            <Input type="email" defaultValue="contact@example.com" />
          </div>
          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <Input defaultValue="+1 (555) 123-4567" />
          </div>
          <div>
            <label className="text-sm font-medium">Location</label>
            <Input defaultValue="Downtown Area" />
          </div>
        </div>
        <Button variant="hero">Save Changes</Button>
      </div>
    </CardContent>
  </Card>
);

const SettingsTab: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Account Settings</CardTitle>
      <CardDescription>Configure your account preferences and notifications</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive push notifications</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
          </div>
        </div>
        <Button variant="hero">Save Settings</Button>
      </div>
    </CardContent>
  </Card>
);

const AvailableFoodTab: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Available Food</CardTitle>
      <CardDescription>Browse and request food donations from restaurants</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { restaurant: "Restaurant ABC", item: "Pasta Bowl", quantity: "20 portions", distance: "2.3 km", time: "Fresh" },
          { restaurant: "Cafe XYZ", item: "Sandwiches", quantity: "15 pieces", distance: "1.8 km", time: "Fresh" },
          { restaurant: "Bistro DEF", item: "Salad", quantity: "10 bowls", distance: "3.1 km", time: "Fresh" },
        ].map((food, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Utensils className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{food.item}</p>
                <p className="text-sm text-muted-foreground">{food.restaurant} • {food.quantity} • {food.distance} • {food.time}</p>
              </div>
            </div>
            <Button variant="hero" size="sm">
              Request
            </Button>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const RequestsTab: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>My Requests</CardTitle>
      <CardDescription>Track your food donation requests</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { id: "REQ001", item: "Pasta Bowl", status: "Approved", time: "2 hours ago" },
          { id: "REQ002", item: "Sandwiches", status: "Pending", time: "4 hours ago" },
          { id: "REQ003", item: "Salad", status: "Delivered", time: "1 day ago" },
        ].map((request, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-pink" />
              <div>
                <p className="font-medium">Request #{request.id}</p>
                <p className="text-sm text-muted-foreground">{request.item} • {request.time}</p>
              </div>
            </div>
            <Badge variant={
              request.status === "Approved" ? "default" :
              request.status === "Delivered" ? "secondary" : "outline"
            }>
              {request.status}
            </Badge>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const HistoryTab: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Donation History</CardTitle>
      <CardDescription>Your past food donation activities</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { date: "2024-01-15", item: "Pasta Bowl", quantity: "20 portions", status: "Delivered" },
          { date: "2024-01-12", item: "Sandwiches", quantity: "15 pieces", status: "Delivered" },
          { date: "2024-01-10", item: "Salad", quantity: "10 bowls", status: "Delivered" },
        ].map((history, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{history.item}</p>
                <p className="text-sm text-muted-foreground">{history.date} • {history.quantity}</p>
              </div>
            </div>
            <Badge variant="secondary">{history.status}</Badge>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const AdminSettingsTab: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Admin Settings</CardTitle>
      <CardDescription>Platform-wide configuration and settings</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Platform Configuration</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-approve Restaurants</p>
                <p className="text-sm text-muted-foreground">Automatically approve restaurant registrations</p>
              </div>
              <input type="checkbox" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-approve Orphanages</p>
                <p className="text-sm text-muted-foreground">Automatically approve orphanage registrations</p>
              </div>
              <input type="checkbox" />
            </div>
          </div>
        </div>
        <Button variant="hero">Save Settings</Button>
      </div>
    </CardContent>
  </Card>
);
