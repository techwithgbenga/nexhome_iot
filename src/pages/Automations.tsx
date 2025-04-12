import React, { useState } from 'react';
import { Plus, Play, Pause, Trash2, X, Save, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { DeviceType, DeviceStatus } from '../types/device';
import { useDeviceStore } from '../store/deviceStore';

interface Condition {
  id: string;
  type: 'device' | 'time' | 'weather';
  deviceId?: string;
  property?: string;
  operator: string;
  value: string;
}

interface Action {
  id: string;
  type: 'device';
  deviceId: string;
  command: string;
  value?: string;
}

interface Automation {
  id: string;
  name: string;
  enabled: boolean;
  conditions: Condition[];
  actions: Action[];
  createdAt: Date;
  updatedAt: Date;
}

interface AutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (automation: Partial<Automation>) => void;
  automation?: Automation;
}

function AutomationModal({ isOpen, onClose, onSave, automation }: AutomationModalProps) {
  const { devices } = useDeviceStore();
  const [formData, setFormData] = useState<Partial<Automation>>({
    name: automation?.name || '',
    conditions: automation?.conditions || [],
    actions: automation?.actions || [],
    enabled: automation?.enabled ?? true,
  });

  if (!isOpen) return null;

  const addCondition = () => {
    const newCondition: Condition = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'device',
      operator: '==',
      value: '',
    };
    setFormData({
      ...formData,
      conditions: [...(formData.conditions || []), newCondition],
    });
  };

  const addAction = () => {
    const newAction: Action = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'device',
      deviceId: devices[0]?.id || '',
      command: 'power',
    };
    setFormData({
      ...formData,
      actions: [...(formData.actions || []), newAction],
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {automation ? 'Edit Automation' : 'Create Automation'}
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
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Automation Name
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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Conditions
                </label>
                <button
                  type="button"
                  onClick={addCondition}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add Condition
                </button>
              </div>
              <div className="space-y-3">
                {formData.conditions?.map((condition, index) => (
                  <div key={condition.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <select
                      value={condition.type}
                      onChange={(e) => {
                        const newConditions = [...(formData.conditions || [])];
                        newConditions[index] = {
                          ...condition,
                          type: e.target.value as 'device' | 'time' | 'weather',
                        };
                        setFormData({ ...formData, conditions: newConditions });
                      }}
                      className="px-3 py-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="device">Device</option>
                      <option value="time">Time</option>
                      <option value="weather">Weather</option>
                    </select>

                    {condition.type === 'device' && (
                      <>
                        <select
                          value={condition.deviceId}
                          onChange={(e) => {
                            const newConditions = [...(formData.conditions || [])];
                            newConditions[index] = {
                              ...condition,
                              deviceId: e.target.value,
                            };
                            setFormData({ ...formData, conditions: newConditions });
                          }}
                          className="px-3 py-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          {devices.map(device => (
                            <option key={device.id} value={device.id}>
                              {device.name}
                            </option>
                          ))}
                        </select>

                        <select
                          value={condition.operator}
                          onChange={(e) => {
                            const newConditions = [...(formData.conditions || [])];
                            newConditions[index] = {
                              ...condition,
                              operator: e.target.value,
                            };
                            setFormData({ ...formData, conditions: newConditions });
                          }}
                          className="px-3 py-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="==">=</option>
                          <option value="!=">≠</option>
                          <option value=">">&gt;</option>
                          <option value=">=">&gt;=</option>
                          <option value="<">&lt;</option>
                          <option value="<=">&lt;=</option>
                        </select>

                        <input
                          type="text"
                          value={condition.value}
                          onChange={(e) => {
                            const newConditions = [...(formData.conditions || [])];
                            newConditions[index] = {
                              ...condition,
                              value: e.target.value,
                            };
                            setFormData({ ...formData, conditions: newConditions });
                          }}
                          className="px-3 py-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Value"
                        />
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const newConditions = formData.conditions?.filter(c => c.id !== condition.id);
                        setFormData({ ...formData, conditions: newConditions });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Actions
                </label>
                <button
                  type="button"
                  onClick={addAction}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add Action
                </button>
              </div>
              <div className="space-y-3">
                {formData.actions?.map((action, index) => (
                  <div key={action.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <select
                      value={action.deviceId}
                      onChange={(e) => {
                        const newActions = [...(formData.actions || [])];
                        newActions[index] = {
                          ...action,
                          deviceId: e.target.value,
                        };
                        setFormData({ ...formData, actions: newActions });
                      }}
                      className="px-3 py-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      {devices.map(device => (
                        <option key={device.id} value={device.id}>
                          {device.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={action.command}
                      onChange={(e) => {
                        const newActions = [...(formData.actions || [])];
                        newActions[index] = {
                          ...action,
                          command: e.target.value,
                        };
                        setFormData({ ...formData, actions: newActions });
                      }}
                      className="px-3 py-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="power">Power</option>
                      <option value="brightness">Brightness</option>
                      <option value="color">Color</option>
                      <option value="temperature">Temperature</option>
                    </select>

                    <input
                      type="text"
                      value={action.value}
                      onChange={(e) => {
                        const newActions = [...(formData.actions || [])];
                        newActions[index] = {
                          ...action,
                          value: e.target.value,
                        };
                        setFormData({ ...formData, actions: newActions });
                      }}
                      className="px-3 py-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Value"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const newActions = formData.actions?.filter(a => a.id !== action.id);
                        setFormData({ ...formData, actions: newActions });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
              {automation ? 'Update Automation' : 'Create Automation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Automations() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | undefined>();
  const [automations, setAutomations] = useState<Automation[]>([]);

  const handleSave = (automationData: Partial<Automation>) => {
    if (selectedAutomation) {
      setAutomations(automations.map(automation =>
        automation.id === selectedAutomation.id
          ? { ...automation, ...automationData, updatedAt: new Date() }
          : automation
      ));
    } else {
      const newAutomation: Automation = {
        id: Math.random().toString(36).substr(2, 9),
        name: automationData.name || '',
        enabled: automationData.enabled || true,
        conditions: automationData.conditions || [],
        actions: automationData.actions || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setAutomations([...automations, newAutomation]);
    }
  };

  const toggleAutomation = (id: string) => {
    setAutomations(automations.map(automation =>
      automation.id === id
        ? { ...automation, enabled: !automation.enabled }
        : automation
    ));
  };

  const deleteAutomation = (id: string) => {
    setAutomations(automations.filter(automation => automation.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Automations</h1>
        <button
          onClick={() => {
            setSelectedAutomation(undefined);
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Automation
        </button>
      </div>

      <div className="space-y-4">
        {automations.map(automation => (
          <div
            key={automation.id}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleAutomation(automation.id)}
                  className={cn(
                    "p-2 rounded-full",
                    automation.enabled ? "text-green-600" : "text-gray-400"
                  )}
                >
                  {automation.enabled ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                </button>
                <div>
                  <h3 className="font-medium">{automation.name}</h3>
                  <p className="text-sm text-gray-500">
                    Last updated: {automation.updatedAt.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedAutomation(automation);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteAutomation(automation.id)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Conditions</h4>
                <div className="space-y-2">
                  {automation.conditions.map((condition, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <ChevronRight className="w-4 h-4 mr-2" />
                      {condition.type === 'device' && (
                        <span>
                          When device "{condition.deviceId}" {condition.property} {condition.operator} {condition.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Actions</h4>
                <div className="space-y-2">
                  {automation.actions.map((action, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <ChevronRight className="w-4 h-4 mr-2" />
                      <span>
                        Set device "{action.deviceId}" {action.command} to {action.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {automations.length === 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No automations created yet</p>
              <p className="text-sm text-gray-400 mb-6">
                Create your first automation to start controlling your devices automatically
              </p>
              <button
                onClick={() => {
                  setSelectedAutomation(undefined);
                  setIsModalOpen(true);
                }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Automation
              </button>
            </div>
          </div>
        )}
      </div>

      <AutomationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        automation={selectedAutomation}
      />
    </div>
  );
}