"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type ContextType = {
  modalOpen: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
};

const AddStashContext = createContext<ContextType>({
  modalOpen: false,
  openAddModal: () => {},
  closeAddModal: () => {},
  toastMessage: null,
  setToastMessage: () => {},
});

export function AddStashProvider({ children }: { children: ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  return (
    <AddStashContext.Provider
      value={{
        modalOpen,
        openAddModal: () => setModalOpen(true),
        closeAddModal: () => setModalOpen(false),
        toastMessage,
        setToastMessage,
      }}
    >
      {children}
    </AddStashContext.Provider>
  );
}

export const useAddStash = () => useContext(AddStashContext);
