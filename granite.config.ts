import os from 'node:os';
import { defineConfig } from '@apps-in-toss/web-framework/config';

const devPort = 5173;

function resolveWebHost() {
  const configuredHost = process.env.AIT_WEB_HOST?.trim();

  if (configuredHost) {
    return configuredHost;
  }

  const ipv4Addresses = Object.values(os.networkInterfaces())
    .flat()
    .filter((entry): entry is os.NetworkInterfaceInfo => entry != null)
    .filter((entry) => entry.family === 'IPv4' && !entry.internal)
    .map((entry) => entry.address);

  return ipv4Addresses.find(isPreferredPrivateAddress) ?? ipv4Addresses[0] ?? 'localhost';
}

function isPreferredPrivateAddress(address: string) {
  return (
    address.startsWith('192.168.') ||
    address.startsWith('10.') ||
    isPrivate172Address(address)
  );
}

function isPrivate172Address(address: string) {
  const match = /^172\.(\d{1,3})\./.exec(address);

  if (match == null) {
    return false;
  }

  const secondOctet = Number(match[1]);
  return secondOctet >= 16 && secondOctet <= 31;
}

export default defineConfig({
  appName: 'MomentBook',
  brand: {
    displayName: 'MomentBook',
    primaryColor: '#81C784',
    icon: '',
  },
  web: {
    host: resolveWebHost(),
    port: devPort,
    commands: {
      dev: 'vite --host',
      build: 'tsc -b && vite build',
    },
  },
  permissions: [
    {
      name: 'photos',
      access: 'read',
    },
  ],
  outdir: 'dist',
});
