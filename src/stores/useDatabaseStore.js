import { create } from "zustand";

const useDatabaseStore = create((set) => ({
  version: null,
  setVersion: (version) => set({ version }),
}));

export default useDatabaseStore;
