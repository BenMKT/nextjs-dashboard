import React from "react";
import DashboardSkeleton from "@/app/ui/skeletons"; // Import the DashboardSkeleton component as a fallback for the loading state(loading skeletons).

const Loading = () => {
  return <DashboardSkeleton />;
};

export default Loading;
