declare module "midtrans-client" {
  export class Snap {
    constructor(config: { isProduction: boolean; serverKey: string; clientKey?: string });

    createTransaction(params: {
      transaction_details: {
        order_id: string;
        gross_amount: number;
      };
      item_details?: Array<{
        id: string;
        name: string;
        quantity: number;
        price: number;
      }>;
      customer_details?: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
      };
      credit_card?: {
        secure: boolean;
      };
    }): Promise<{
      token: string;
      redirect_url: string;
    }>;
  }
}
