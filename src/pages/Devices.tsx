import React, { useState } from 'react';
import { Plus, Settings, History as HistoryIcon, X, Search, RefreshCw } from 'lucide-react';
import { useDeviceStore } from '../store/deviceStore';
import { DeviceStatus, DeviceType, DeviceCapability, Device } from '../types/device';
import { cn } from '../lib/utils';

interface DeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (device: Partial<Device>) => void;
  device?: Device;
}

function DeviceModal({ isOpen, onClose, onSave, device }: DeviceModalProps) {
  const [formData, setFormData] = useState({
    name: device?.name || '',
    type: device?.type || DeviceType.LIGHT,
    capabilities: device?.capabilities || [],
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {device ? 'Edit Device' : 'Add New Device'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
          onClose();
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Device Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as DeviceType })}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.values(DeviceType).map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capabilities
              </label>
              <div className="space-y-2">
                {Object.values(DeviceCapability).map((capability) => (
                  <label key={capability} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.capabilities.includes(capability)}
                      onChange={(e) => {
                        const newCapabilities = e.target.checked
                          ? [...formData.capabilities, capability]
                          : formData.capabilities.filter(c => c !== capability);
                        setFormData({ ...formData, capabilities: newCapabilities });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {capability.charAt(0).toUpperCase() + capability.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {device ? 'Update Device' : 'Add Device'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeviceHistoryModal({ isOpen, onClose, device }: { isOpen: boolean; onClose: () => void; device?: Device }) {
  if (!isOpen || !device) return null;

  // Mock history data - in production, this would come from your backend
  const mockHistory = [
    { timestamp: new Date(Date.now() - 3600000), status: DeviceStatus.ONLINE, event: 'Device came online' },
    { timestamp: new Date(Date.now() - 7200000), status: DeviceStatus.OFFLINE, event: 'Device went offline' },
    { timestamp: new Date(Date.now() - 10800000), status: DeviceStatus.UPDATING, event: 'Firmware update started' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Device History - {device.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {mockHistory.map((entry, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <StatusBadge status={entry.status} />
              <div>
                <p className="font-medium">{entry.event}</p>
                <p className="text-sm text-gray-500">
                  {entry.timestamp.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function Devices() {
  const { devices, addDevice, updateDevice } = useDeviceStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Mock refresh - in production, this would refresh device states from your backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Devices</h1>
        <button
          onClick={() => {
            setSelectedDevice(undefined);
            setIsAddModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Device
        </button>
      </div>

      <div className="mb-6 flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search devices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleRefresh}
          className={cn(
            "p-2 rounded-lg bg-gray-100 hover:bg-gray-200",
            isRefreshing && "animate-spin"
          )}
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map(device => (
          <div
            key={device.id}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">{device.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{device.type}</p>
              </div>
              <StatusBadge status={device.status} />
            </div>
            
            <div className="text-sm text-gray-500">
              <p>Last seen: {device.lastSeen.toLocaleString()}</p>
              <p className="mt-1">
                Capabilities: {device.capabilities.length 
                  ? device.capabilities.join(', ') 
                  : 'None'}
              </p>
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => {
                  setSelectedDevice(device);
                  setIsAddModalOpen(true);
                }}
                className="flex items-center px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                <Settings className="w-4 h-4 mr-1" />
                Configure
              </button>
              <button
                onClick={() => {
                  setSelectedDevice(device);
                  setIsHistoryModalOpen(true);
                }}
                className="flex items-center px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                <HistoryIcon className="w-4 h-4 mr-1" />
                History
              </button>
            </div>
          </div>
        ))}

        {devices.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center bg-white rounded-lg shadow p-8">
            <p className="text-gray-500 mb-4">No devices added yet</p>
            <button
              onClick={() => {
                setSelectedDevice(undefined);
                setIsAddModalOpen(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Device
            </button>
          </div>
        )}

        {devices.length > 0 && filteredDevices.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center bg-white rounded-lg shadow p-8">
            <p className="text-gray-500">No devices match your search</p>
          </div>
        )}
      </div>

      <DeviceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(deviceData) => {
          if (selectedDevice) {
            updateDevice(selectedDevice.id, deviceData);
          } else {
            const newDevice = {
              id: Math.random().toString(36).substr(2, 9),
              status: DeviceStatus.ONLINE,
              lastSeen: new Date(),
              metadata: {},
              ...deviceData,
            } as Device;
            addDevice(newDevice);
          }
        }}
        device={selectedDevice}
      />

      <DeviceHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        device={selectedDevice}
      />
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