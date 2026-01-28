import { Link } from "react-router-dom";
import { Utensils, Heart, MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-border">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Utensils className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Food Rescue
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Connecting restaurants with surplus food to orphanages in need.
              Together, we can end food waste and feed hope.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Join Network
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">For Partners</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/register?type=restaurant"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Restaurant Partners
                </Link>
              </li>
              <li>
                <Link
                  to="/register?type=orphanage"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Orphanage Partners
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                hello@foodrescue.org
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                Worldwide
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Food Rescue Network. Built with{" "}
            <Heart className="w-3 h-3 inline text-pink" /> for communities.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
