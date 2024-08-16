import { create } from "zustand";

const useUsersStore = create((set) => ({
  users: null,
  setUsers: (users) => set({ users }),
}));

export default useUsersStore;
