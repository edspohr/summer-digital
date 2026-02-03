import { User } from '@/types';

class MockAuthService {
  private static readonly LATENCY = 800;

  private static readonly MOCK_USER: User = {
    id: 'u1',
    name: 'Valentina Muñoz',
    email: 'valentina@fundacionsummer.cl',
    role: 'Participant',
    oasisScore: 78,
    avatarUrl: 'https://github.com/shadcn.png',
    lastConnection: new Date().toISOString(),
  };

  async login(): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MockAuthService.MOCK_USER);
      }, MockAuthService.LATENCY);
    });
  }

  async getUserProfile(): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MockAuthService.MOCK_USER);
      }, MockAuthService.LATENCY / 2);
    });
  }

  async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
  }
}

export const authService = new MockAuthService();
