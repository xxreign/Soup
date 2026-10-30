import { Metadata } from "next";
import CrossyRoadClient from "./CrossyRoadClient";

export const metadata: Metadata = {
  title: "CROSSY ROAD - Retro Arcade Cabinet",
  description: "Cross endless roads, turbulent rivers, and high-speed train tracks in retro 8-bit style!",
};

export default function CrossyRoadPage() {
  return <CrossyRoadClient />;
}
