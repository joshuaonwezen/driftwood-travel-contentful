import {
  Camera, Compass, Heart, Leaf, Map, Mountain, Plane, Shield, Snowflake, Star, Sun, TrainFront, Users, Utensils, Wallet,
  type LucideIcon,
} from "lucide-react";

/** Maps the `icon` enum used in Contentful (featureItem.icon, category.icon) to icons. */
const ICONS: Record<string, LucideIcon> = {
  compass: Compass,
  mountain: Mountain,
  utensils: Utensils,
  camera: Camera,
  sun: Sun,
  snowflake: Snowflake,
  train: TrainFront,
  wallet: Wallet,
  leaf: Leaf,
  users: Users,
  shield: Shield,
  heart: Heart,
  map: Map,
  plane: Plane,
  star: Star,
};

export function Icon({ name, className }: { name?: string; className?: string }) {
  const Component = (name && ICONS[name]) || Compass;
  return <Component className={className} aria-hidden="true" strokeWidth={1.75} />;
}
