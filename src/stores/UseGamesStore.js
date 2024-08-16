import { create } from "zustand";

const useGamesStore = create((set) => ({
  games: null,
  setGames: (games) => set({ games }),
}));

export default useGamesStore;
