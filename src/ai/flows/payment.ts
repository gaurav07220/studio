
'use server';

/**
 * @fileOverview Genkit flows for handling Razorpay payments.
 *
 * - createOrder - Creates a new Razorpay order.
 * - verifyPayment - Verifies the payment signature from Razorpay.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { getFirebaseUid } from 'genkit/next';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const CreateOrderInputSchema = z.object({
  amount: z.number().describe('The amount for the order in the smallest currency unit (e.g., paisa for INR).'),
  currency: z.string().describe('The currency of the order (e.g., INR).'),
});
export type CreateOrderInput = z.infer<typeof CreateOrderInputSchema>;

const CreateOrderOutputSchema = z.object({
  id: z.string(),
  amount: z.number(),
  currency: z.string(),
});
export type CreateOrderOutput = z.infer<typeof CreateOrderOutputSchema>;

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderOutput> {
  return createOrderFlow(input);
}

const createOrderFlow = ai.defineFlow(
  {
    name: 'createOrderFlow',
    inputSchema: CreateOrderInputSchema,
    outputSchema: CreateOrderOutputSchema,
    auth: {
      policy: 'require',
    }
  },
  async (input) => {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: input.amount * 100, // amount in the smallest currency unit
      currency: input.currency,
      receipt: `receipt_order_${new Date().getTime()}`,
    };

    try {
      const order = await razorpay.orders.create(options);
      return {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
      };
    } catch (error) {
      console.error("Razorpay order creation failed:", error);
      throw new Error("Failed to create Razorpay order.");
    }
  }
);


const VerifyPaymentInputSchema = z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string(),
});
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentInputSchema>;

const VerifyPaymentOutputSchema = z.object({
    signatureIsValid: z.boolean(),
});
export type VerifyPaymentOutput = z.infer<typeof VerifyPaymentOutputSchema>;

export async function verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentOutput> {
    return verifyPaymentFlow(input);
}

const verifyPaymentFlow = ai.defineFlow(
    {
        name: 'verifyPaymentFlow',
        inputSchema: VerifyPaymentInputSchema,
        outputSchema: VerifyPaymentOutputSchema,
        auth: {
            policy: 'require',
        }
    },
    async (input) => {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = input;
        const uid = getFirebaseUid();
        if (!uid) {
            throw new Error("User is not authenticated.");
        }
        
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex');

        const signatureIsValid = expectedSignature === razorpay_signature;

        if (signatureIsValid) {
            // If signature is valid, update user's plan in Firestore
            const userDocRef = doc(db, 'users', uid);
            await setDoc(userDocRef, { plan: 'pro' }, { merge: true });
        }

        return { signatureIsValid };
    }
);
