import React from 'react';
import Skeleton from '../Skeleton';

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="p-6 space-y-8 animate-fade-in-up">
      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface-2 rounded-3xl p-6 h-48 flex flex-col justify-between">
            <Skeleton variant="circular" width={48} height={48} />
            <div className="space-y-2">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="rectangular" width="80%" height={32} />
              <Skeleton variant="text" width="40%" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alerts Table Skeleton */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-luxury border border-gray-50">
          <div className="flex justify-between items-center mb-6">
            <Skeleton variant="rectangular" width={200} height={28} />
            <Skeleton variant="circular" width={100} height={24} />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Skeleton variant="rectangular" width={40} height={40} className="rounded-lg" />
                  <Skeleton variant="text" width={150} />
                </div>
                <Skeleton variant="text" width={80} />
                <Skeleton variant="text" width={60} />
                <Skeleton variant="text" width={80} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="bg-surface-2 rounded-3xl p-8 shadow-luxury border border-transparent space-y-6">
          <Skeleton variant="rectangular" width={120} height={28} />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width="100%"
                height={48}
                className="rounded-full"
              />
            ))}
          </div>
          <div className="mt-8 p-6 bg-brand-burgundy/5 rounded-2xl border border-brand-burgundy/10 space-y-3">
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="rectangular" width="100%" height={12} className="rounded-full" />
            <Skeleton variant="text" width="80%" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
