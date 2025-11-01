import { create } from "zustand";
import { getLevelExp } from "@/user/level";
import { Toast } from "native-base";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

interface UserState {
  level: number;
  currentExp: number;
}
interface UserAction {
  addExp: (exp: number, uid: string) => void;
  setUserExp: (level: number, currentExp: number) => void;
}

export const useUserStore = create<UserAction & UserState>((set) => ({
  level: 1,
  currentExp: 0,
  setUserExp: (level: number, currentExp: number) => set({ level, currentExp }),
  addExp: (exp: number, uid: string) => {
    set((state) => {
      const docRef = doc(db, "users", uid);
      const currentExp = state.currentExp + exp;
      const currentLevelExp = getLevelExp(state.level);
      // handles user leveling up
      if (currentExp >= currentLevelExp) {
        Toast.show({
          description: `You leveled up to level ${state.level + 1}!`,
          variant: "success",
          duration: 3000,
        });
        const level = state.level + 1;
        const extraExp = currentExp - currentLevelExp;
        updateDoc(docRef, {
          level: level,
          currentExp: extraExp,
        });
        return { level: level, currentExp: extraExp };
      } else {
        state.setUserExp(state.level, currentExp);
        updateDoc(docRef, {
          currentExp: currentExp,
        });
        return { currentExp: currentExp };
      }
    });
  },
}));
