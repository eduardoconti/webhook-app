import create from "zustand";

export type RequestEventProps = {
  body: string;
  headers: string;
  time: string;
  id: string;
  method: string;
};

export interface IUseRequestEvent {
  requests: RequestEventProps[];
  selectedEventId: string;
  setSelectedEventId(selectedEventId: string): void;
  addRequest(request: RequestEventProps): void;
  clearRequests(): void;
}
export const useRequesEventStore = create<IUseRequestEvent>((set) => ({
  requests: [],
  selectedEventId: "",
  setSelectedEventId: (selectedEventId: string) =>
    set(() => ({ selectedEventId })),
  addRequest: (request: RequestEventProps) =>
    set((state) => ({
      requests: [request, ...state.requests],
    })),
  clearRequests: () => set(() => ({ requests: [] })),
}));
