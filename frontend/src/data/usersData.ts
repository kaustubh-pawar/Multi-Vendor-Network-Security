'use client';

export interface UserProfile {
  name: string;
  email: string;
  clearance: string;
  role: string;
}

export interface StoredUser extends UserProfile {
  accessKey: string;
  isVerified?: boolean;
}

const STORAGE_KEY = 'ancp_auditor_users';

export const INITIAL_USERS: StoredUser[] = [
  {
    name: 'Kaustubh Pawar',
    email: 'kaustubh1006p@gmail.com',
    accessKey: 'threat2risk',
    clearance: 'L4 Lead Clearance',
    role: 'Principal Compliance Auditor',
    isVerified: true,
  },
  {
    name: 'Lead Security Auditor',
    email: 'auditor@ancp.io',
    accessKey: 'ancp123',
    clearance: 'L4 Lead Clearance',
    role: 'Lead Security Auditor',
    isVerified: true,
  },
  {
    name: 'CISO Administrator',
    email: 'ciso@ancp.io',
    accessKey: 'ancp123',
    clearance: 'Executive Clearance',
    role: 'Chief Information Security Officer',
    isVerified: true,
  },
];

export function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const users = getStoredUsers();
  return users.find((u) => u.email.toLowerCase().trim() === email.toLowerCase().trim());
}

export function saveUser(user: StoredUser): StoredUser[] {
  const current = getStoredUsers();
  const index = current.findIndex(
    (u) => u.email.toLowerCase().trim() === user.email.toLowerCase().trim()
  );
  let updated: StoredUser[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = user;
  } else {
    updated = [user, ...current];
  }
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
  }
  return updated;
}

export function registerNewUser(user: StoredUser): { success: boolean; user?: StoredUser; error?: string } {
  const existing = findUserByEmail(user.email);
  if (existing) {
    return {
      success: false,
      error: `Email identity "${user.email}" is already registered. Please log in using SECURE ACCESS.`,
    };
  }

  const newUser: StoredUser = {
    ...user,
    email: user.email.toLowerCase().trim(),
    isVerified: true,
  };

  saveUser(newUser);
  return { success: true, user: newUser };
}

export function verifyUserCredentials(email: string, pass: string): { success: boolean; user?: StoredUser; error?: string } {
  const cleanEmail = email.toLowerCase().trim();
  const user = findUserByEmail(cleanEmail);

  if (!user) {
    return {
      success: false,
      error: `ERR_UNAUTHORIZED: Identity "${cleanEmail}" is not registered. You MUST complete Auditor Registration first.`,
    };
  }

  if (user.accessKey !== pass) {
    return {
      success: false,
      error: `ERR_INVALID_KEY: Incorrect Access Key for identity "${cleanEmail}".`,
    };
  }

  return { success: true, user };
}
