'use client';

export interface UserProfile {
  name: string;
  email: string;
  clearance: string;
  role: string;
}

export interface StoredUser extends UserProfile {
  accessKey: string;
}

const STORAGE_KEY = 'ancp_auditor_users';

export const INITIAL_USERS: StoredUser[] = [
  {
    name: 'Lead Security Auditor',
    email: 'auditor@ancp.io',
    accessKey: 'ancp123',
    clearance: 'L4 Lead Clearance',
    role: 'Lead Security Auditor',
  },
  {
    name: 'Kaustubh Pawar',
    email: 'kaustubh1006p@gmail.com',
    accessKey: 'threat2risk',
    clearance: 'L4 Lead Clearance',
    role: 'Principal Compliance Auditor',
  },
  {
    name: 'CISO Administrator',
    email: 'ciso@ancp.io',
    accessKey: 'ancp123',
    clearance: 'Executive Clearance',
    role: 'Chief Information Security Officer',
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

export function saveUser(user: StoredUser): StoredUser[] {
  const current = getStoredUsers();
  const index = current.findIndex(
    (u) => u.email.toLowerCase() === user.email.toLowerCase()
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

export function findOrCreateUser(email: string, pass: string, name?: string, clearance?: string): StoredUser {
  const users = getStoredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    if (pass && existing.accessKey !== pass) {
      existing.accessKey = pass;
      saveUser(existing);
    }
    return existing;
  }

  const derivedName = name && name.trim()
    ? name.trim()
    : email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const newUser: StoredUser = {
    name: derivedName,
    email: email.toLowerCase().trim(),
    accessKey: pass || 'ancp123',
    clearance: clearance || 'L4 Lead Clearance',
    role: 'Security Auditor',
  };

  saveUser(newUser);
  return newUser;
}
