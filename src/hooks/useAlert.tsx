import create from "zustand";

type ColorTypes = "success" | "error" | "info" | "warning";
export type AlertProps = {
  message: string;
  isOpen: boolean;
  color?: ColorTypes;
  severity?: ColorTypes;
};

export interface IUseAlert {
  props: AlertProps;
  setOpen(): void;
  setClose(): void;
  setProps(props: AlertProps): void;
}
export const useAlertStore = create<IUseAlert>((set) => ({
  props: {
    message: "",
    severity: "info",
    color: "success",
    isOpen: false,
  },
  setOpen: () => set((state) => ({ props: { ...state.props, isOpen: true } })),
  setClose: () =>
    set((state) => ({ props: { ...state.props, isOpen: false } })),
  setProps: (props: AlertProps) =>
    set(() => ({
      props: { ...props },
    })),
}));
