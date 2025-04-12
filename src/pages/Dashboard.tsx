import React from 'react';
import { useDeviceStore } from '../store/deviceStore';
import { DeviceStatus } from '../types/device';
import { cn } from '../lib/utils';

export function Dashboard() {
  const devices = useDeviceStore((state) => state.devices);
  
  const stats = {
    total: devices.length,
    online: devices.filter(d => d.status === DeviceStatus.ONLINE).length,
    offline: devices.filter(d => d.status === DeviceStatus.OFFLINE).length,
    error: devices.filter(d => d.status === DeviceStatus.ERROR).length,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Devices" value={stats.total} />
        <StatCard 
          title="Online" 
          value={stats.online}
          className="bg-green-50 border-green-200"
        />
        <StatCard 
          title="Offline" 
          value={stats.offline}
          className="bg-gray-50 border-gray-200"
        />
        <StatCard 
          title="Error" 
          value={stats.error}
          className="bg-red-50 border-red-200"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {devices.length === 0 ? (
          <p className="text-gray-500">No devices added yet</p>
        ) : (
          <div className="space-y-4">
            {devices.map(device => (
              <div 
                key={device.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div>
                  <h3 className="font-medium">{device.name}</h3>
                  <p className="text-sm text-gray-500">
                    Last seen: {device.lastSeen.toLocaleString()}
                  </p>
                </div>
                <StatusBadge status={device.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  className 
}: { 
  title: string; 
  value: number; 
  className?: string;
}) {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow p-6 border",
      className
    )}>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: DeviceStatus }) {
  const styles = {
    [DeviceStatus.ONLINE]: 'bg-green-100 text-green-800',
    [DeviceStatus.OFFLINE]: 'bg-gray-100 text-gray-800',
    [DeviceStatus.ERROR]: 'bg-red-100 text-red-800',
    [DeviceStatus.UPDATING]: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={cn(
      'px-2 py-1 rounded-full text-xs font-medium',
      styles[status]
    )}>
      {status}
    </span>
  );
}