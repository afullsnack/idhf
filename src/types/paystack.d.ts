// types/paystack.d.ts
interface PaystackHandler {
  openIframe: () => void;
}

interface PaystackPopSetup {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref?: string;
  metadata?: Record<string, unknown>;
  callback?: (response: { reference: string; status: string }) => void;
  onClose?: () => void;
}

interface Window {
  PaystackPop: {
    setup: (options: PaystackPopSetup) => PaystackHandler;
  };
}
