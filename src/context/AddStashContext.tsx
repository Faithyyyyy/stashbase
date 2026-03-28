"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type ContextType = {
  modalOpen: boolean;
  pickerOpen: boolean;
  uploadOpen: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;
  openLinkModal: () => void;
  openUploadModal: () => void;
  closePicker: () => void;
  closeUpload: () => void;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
};

const AddStashContext = createContext<ContextType>({
  modalOpen: false,
  pickerOpen: false,
  uploadOpen: false,
  openAddModal: () => {},
  closeAddModal: () => {},
  openLinkModal: () => {},
  openUploadModal: () => {},
  closePicker: () => {},
  closeUpload: () => {},
  toastMessage: null,
  setToastMessage: () => {},
});

export function AddStashProvider({ children }: { children: ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  return (
    <AddStashContext.Provider
      value={{
        modalOpen,
        pickerOpen,
        uploadOpen,
        openAddModal: () => setPickerOpen(true), // ← opens picker first
        closeAddModal: () => setModalOpen(false),
        openLinkModal: () => {
          setPickerOpen(false);
          setModalOpen(true);
        },
        openUploadModal: () => {
          setPickerOpen(false);
          setUploadOpen(true);
        },
        closePicker: () => setPickerOpen(false),
        closeUpload: () => setUploadOpen(false),
        toastMessage,
        setToastMessage,
      }}
    >
      {children}
    </AddStashContext.Provider>
  );
}

export const useAddStash = () => useContext(AddStashContext);
