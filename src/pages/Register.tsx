import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Utensils,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Heart,
  User,
  MapPin,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type UserType = "restaurant" | "orphanage";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = (searchParams.get("type") as UserType) || "restaurant";
  const { signUp } = useAuth();

  const [userType, setUserType] = useState<UserType>(initialType);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword || !address || !city) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(email, password, name, userType);

      if (error) {
        toast.error(error.toString());
      } else {
        toast.success(
          "Account created! Please check your email to confirm your account.",
        );
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <div className="absolute inset-0 gradient-radial opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8 max-h-[90vh] overflow-y-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Utensils className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Create Account
              </h1>
              <p className="text-muted-foreground text-sm">
                Join the Food Rescue Network
              </p>
            </div>
          </div>

          {/* User Type Selection */}
          <div className="flex gap-3 mb-8">
            <button
              type="button"
              onClick={() => setUserType("restaurant")}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                userType === "restaurant"
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card/50 hover:border-primary/50"
              }`}
            >
              <Building2
                className={`w-6 h-6 mx-auto mb-2 ${
                  userType === "restaurant"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              />
              <p
                className={`text-sm font-medium ${
                  userType === "restaurant"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Restaurant
              </p>
            </button>
            <button
              type="button"
              onClick={() => setUserType("orphanage")}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                userType === "orphanage"
                  ? "border-pink bg-pink/10"
                  : "border-border bg-card/50 hover:border-pink/50"
              }`}
            >
              <Heart
                className={`w-6 h-6 mx-auto mb-2 ${
                  userType === "orphanage"
                    ? "text-pink"
                    : "text-muted-foreground"
                }`}
              />
              <p
                className={`text-sm font-medium ${
                  userType === "orphanage"
                    ? "text-pink"
                    : "text-muted-foreground"
                }`}
              >
                Orphanage
              </p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                {userType === "restaurant"
                  ? "Restaurant Name"
                  : "Orphanage Name"}{" "}
                *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder={`Enter ${userType} name`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-input border-border focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-input border-border focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-foreground">
                Address *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter street address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-10 bg-input border-border focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-foreground">
                  City *
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-input border-border focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">
                  Phone
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-9 bg-input border-border focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-input border-border focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirm Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-input border-border focus:border-primary"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
