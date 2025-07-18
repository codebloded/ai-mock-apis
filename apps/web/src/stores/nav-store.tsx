import { create } from "zustand";

interface Breadcrumb {
  label: string;
  path?: string;
}

interface NavState {
  breadcrumbs: Breadcrumb[];
  title: string;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  setTitle: (title: string) => void;
  clear: () => void;
}

export const useNavStore = create<NavState>((set) => ({
  breadcrumbs: [],
  title: "",
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
  setTitle: (title) => set({ title }),
  clear: () => set({ breadcrumbs: [], title: "" }),
}));

export const useNavigation = () => {
  const { setBreadcrumbs, setTitle, clear } = useNavStore();

  const updateNavigation = (breadcrumbs: Breadcrumb[], pageTitle: string) => {
    setBreadcrumbs(breadcrumbs);
    setTitle(pageTitle);
  };

  return {
    updateNavigation,
    clearNavigation: clear,
  };
};
