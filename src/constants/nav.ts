import {
  Home,
  Apple,
  Dumbbell,
  Moon,
  Brain,
  Flower2,
  Sparkles,
  BarChart3,
  Trophy,
  Zap,
  User,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

export const PRIMARY_NAV: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: Home },
  { label: "Nutrition", to: "/nutrition", icon: Apple },
  { label: "Fitness", to: "/fitness", icon: Dumbbell },
  { label: "Sleep", to: "/sleep", icon: Moon },
  { label: "Mental", to: "/mental", icon: Brain },
  { label: "Women's Health", to: "/women", icon: Flower2 },
  { label: "AI Coach", to: "/ai-coach", icon: Sparkles },
  { label: "Reports", to: "/reports", icon: BarChart3 },
  { label: "Achievements", to: "/achievements", icon: Trophy },
  { label: "Programs", to: "/programs", icon: Zap },
  { label: "Profile", to: "/profile", icon: User },
];

export const BOTTOM_NAV: NavItem[] = [
  { label: "Home", to: "/dashboard", icon: Home },
  { label: "Women", to: "/women", icon: Flower2 },
  { label: "Coach", to: "/ai-coach", icon: Sparkles },
  { label: "Reports", to: "/reports", icon: BarChart3 },
  { label: "Profile", to: "/profile", icon: User },
];
