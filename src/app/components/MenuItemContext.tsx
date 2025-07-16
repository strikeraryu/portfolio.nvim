'use client';
import React, { createContext, useContext, useState } from "react";

type MenuItemContextType = {
  currentItem: string | null;
  setCurrentItem: (item: string | null) => void;
};

const MenuItemContext = createContext<MenuItemContextType>({
  currentItem: null,
  setCurrentItem: () => {},
});

export const useMenuItem = () => useContext(MenuItemContext);

export const MenuItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentItem, setCurrentItem] = useState<string | null>(null);
  return (
    <MenuItemContext.Provider value={{ currentItem, setCurrentItem }}>
      {children}
    </MenuItemContext.Provider>
  );
}; 
 
 