import { cn } from "@/lib/cn";

// Lucide — primary set
import {
  Search, Calendar, Clock, FlaskConical, Droplets, Pill, Phone,
  Ambulance, MessageCircle, Check, ArrowRight, Star, Mountain,
  Home, User, Users, Stethoscope, Heart, ShieldCheck, Building2,
  BedDouble, Map, Menu, X, ChevronDown, Play, BookOpen, Bone,
  Brain, Baby, Eye, Activity, Mail, MapPin, Apple, Quote, Headset,
  BadgeCheck, type LucideIcon,
} from "lucide-react";

// Tabler — for icons Lucide doesn't have
import {
  IconBrandFacebook, IconBrandInstagram, IconBrandX,
  IconAlarmFilled, IconDental, IconLungs,
  type Icon as TablerIcon,
} from "@tabler/icons-react";

export type IconName =
  | "search" | "calendar" | "clock" | "flask" | "blood" | "pill"
  | "phone" | "ambulance" | "chat" | "check" | "arrow" | "arrowSmall"
  | "star" | "mountain" | "home" | "user" | "users" | "stethoscope"
  | "heart" | "shield" | "building" | "bed" | "map" | "facebook"
  | "instagram" | "twitter" | "menu" | "close" | "siren"
  | "chevron" | "play" | "book" | "bone" | "brain" | "baby" | "eye"
  | "tooth" | "lung" | "kidney" | "activity" | "mail" | "pin" | "apple"
  | "play2" | "quote" | "headset" | "badge";

interface IconProps {
  name: IconName;
  size?: number;
  stroke?: number;
  className?: string;
}

const lucideMap: Partial<Record<IconName, LucideIcon>> = {
  search: Search,
  calendar: Calendar,
  clock: Clock,
  flask: FlaskConical,
  blood: Droplets,
  pill: Pill,
  phone: Phone,
  ambulance: Ambulance,
  chat: MessageCircle,
  check: Check,
  arrow: ArrowRight,
  arrowSmall: ArrowRight,
  star: Star,
  mountain: Mountain,
  home: Home,
  user: User,
  users: Users,
  stethoscope: Stethoscope,
  heart: Heart,
  shield: ShieldCheck,
  building: Building2,
  bed: BedDouble,
  map: Map,
  menu: Menu,
  close: X,
  chevron: ChevronDown,
  play: Play,
  play2: Play,
  book: BookOpen,
  bone: Bone,
  brain: Brain,
  baby: Baby,
  eye: Eye,
  activity: Activity,
  mail: Mail,
  pin: MapPin,
  apple: Apple,
  quote: Quote,
  headset: Headset,
  badge: BadgeCheck,
};

// Tabler fills the gaps: socials + medical icons Lucide lacks
const tablerMap: Partial<Record<IconName, TablerIcon>> = {
  facebook: IconBrandFacebook,
  instagram: IconBrandInstagram,
  twitter: IconBrandX,
  siren: IconAlarmFilled,
  tooth: IconDental,
  lung: IconLungs,
};

export default function Icon({ name, size = 24, stroke = 1.75, className }: IconProps) {
  const LucideComponent = lucideMap[name];
  if (LucideComponent) {
    return (
      <LucideComponent
        size={size}
        strokeWidth={stroke}
        className={cn("shrink-0", className)}
        aria-hidden="true"
      />
    );
  }

  const TablerComponent = tablerMap[name];
  if (TablerComponent) {
    return (
      <TablerComponent
        size={size}
        stroke={stroke}
        className={cn("shrink-0", className)}
        aria-hidden="true"
      />
    );
  }

  const customPaths: Partial<Record<IconName, React.ReactNode>> = {
    kidney: <path d="M8 4c-3 0-5 3-5 8s3 8 6 8c2 0 3-1 4-2s2 2 5 2 5-3 5-8-2-8-5-8c-2 0-3 1-4 2s-1-2-6-2z" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {customPaths[name] ?? <path d="m5 13 4 4L20 6" />}
    </svg>
  );
}
