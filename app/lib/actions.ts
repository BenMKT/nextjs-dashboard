// Make it a server component to mark all the exported functions within the file as server functions/actions
'use server';
// use a TypeScript-first validation library (Zod) to handle type validation
import { z } from 'zod';
// define a schema that matches the shape of your form object
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.pick({
  customerId: true,
  amount: true,
  status: true,
});

export async function createInvoice(formData: FormData) {
  // Extract and Convert FormData to a plain object
  const RawFormData = Object.fromEntries(formData.entries());
  // Pass RawFormData to CreateInvoice to validate the types
  const rawFormData = CreateInvoice.parse(RawFormData);
  // Convert the amount into cents as its good practice to store monetary values in cents in your database to eliminate JavaScript floating-point errors and ensure greater accuracy
  const amountInCents = rawFormData.amount * 100;
  // create a new date with the format "YYYY-MM-DD" for the invoice's creation date
  const date = new Date().toISOString().split('T')[0];
  // Test it out in the console terminal
  console.log(date);
}
