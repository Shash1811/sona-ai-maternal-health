import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface NightModeContextType {
  nightMode: boolean;
  toggleNightMode: () => void;
}

const NightModeContext = createContext<NightModeContextType>({ nightMode: false, toggleNightMode: () => {} });

export const useNightMode = () => useContext(NightModeContext);

export const NightModeProvider = ({ children }: { children: ReactNode }) => {
  const [nightMode, setNightMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (nightMode) {
      root.classList.add("night-owl");
    } else {
      root.classList.remove("night-owl");
    }
  }, [nightMode]);

  return (
    <NightModeContext.Provider value={{ nightMode, toggleNightMode: () => setNightMode((p) => !p) }}>
      {children}
    </NightModeContext.Provider>
  );
};
