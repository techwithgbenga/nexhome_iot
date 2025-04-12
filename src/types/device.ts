export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  lastSeen: Date;
  capabilities: DeviceCapability[];
  metadata: Record<string, unknown>;
}

export enum DeviceType {
  LIGHT = 'light',
  THERMOSTAT = 'thermostat',
  CAMERA = 'camera',
  SWITCH = 'switch',
  SENSOR = 'sensor',
}

export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ERROR = 'error',
  UPDATING = 'updating',
}

export enum DeviceCapability {
  POWER = 'power',
  BRIGHTNESS = 'brightness',
  COLOR = 'color',
  TEMPERATURE = 'temperature',
  HUMIDITY = 'humidity',
  MOTION = 'motion',
  VIDEO = 'video',
  AUDIO = 'audio',
}