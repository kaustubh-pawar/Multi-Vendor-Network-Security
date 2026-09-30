'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useAudio, type AudioSettings, type SoundType } from '@/hooks/useAudio';
import { UserProfile, getStoredUsers } from '@/data/usersData';

interface AppState {
  authed: boolean;
  setAuthed: (v: boolean) => void;
  currentUser: UserProfile;
  setCurrentUser: (u: UserProfile) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (v: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (v: boolean) => void;
  audio: {
    settings: AudioSettings;
    play: (type: SoundType) => void;
    toggle: () => void;
    update: (patch: Partial<AudioSettings>) => void;
  };
  logout: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const audio = useAudio();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [authed, setAuthedState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const stored = localStorage.getItem('ancp_authed');
      return stored === 'true';
    } catch {
      return true;
    }
  });

  const [currentUser, setCurrentUserState] = useState<UserProfile>(() => {
    if (typeof window === 'undefined') {
      return {
        name: 'Kaustubh Pawar',
        email: 'kaustubh1006p@gmail.com',
        clearance: 'L4 Lead Clearance',
        role: 'Principal Compliance Auditor',
      };
    }
    try {
      const stored = localStorage.getItem('ancp_current_user');
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    const defaultUser = getStoredUsers()[1] || getStoredUsers()[0];
    return {
      name: defaultUser.name,
      email: defaultUser.email,
      clearance: defaultUser.clearance,
      role: defaultUser.role,
    };
  });

  const setAuthed = useCallback((v: boolean) => {
    setAuthedState(v);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ancp_authed', String(v));
      } catch { /* ignore */ }
    }
  }, []);

  const setCurrentUser = useCallback((u: UserProfile) => {
    setCurrentUserState(u);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ancp_current_user', JSON.stringify(u));
      } catch { /* ignore */ }
    }
  }, []);

  const logout = useCallback(() => {
    setAuthed(false);
    audio.play('click');
  }, [setAuthed, audio]);

  return (
    <AppContext.Provider
      value={{
        authed,
        setAuthed,
        currentUser,
        setCurrentUser,
        commandPaletteOpen,
        setCommandPaletteOpen,
        notificationsOpen,
        setNotificationsOpen,
        audio,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
