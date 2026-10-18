import type { Metadata } from "next";
import { SubscriptionsView } from "@/components/subscriptions/SubscriptionsView";

export const metadata: Metadata = {
  title: "Subscriptions · Subscription Tracker",
};

export default function SubscriptionsPage() {
  return <SubscriptionsView />;
}
