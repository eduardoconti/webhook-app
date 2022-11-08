import create from "zustand";

export interface IUseWebhookId {
  webhookId?: string;
  setWebhookId(webhookId?: string): void;
}
export const useWebhookIdStore = create<IUseWebhookId>((set) => ({
  webhookId: undefined,
  setWebhookId: (webhookId?: string) => set(() => ({ webhookId: webhookId })),
}));
