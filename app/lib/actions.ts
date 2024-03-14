// Make it a server component to mark all the exported functions within the file as server functions/actions
'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// use a TypeScript-first validation library (Zod) to handle type validation
import { z } from 'zod';
// define a schema that matches the shape of your database invoice table object using Zod
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
// define a schema that matches the shape of your create form object
const CreateInvoice = FormSchema.pick({
  customerId: true,
  amount: true,
  status: true,
});
// define a schema that matches the shape of your edit form object
const UpdateInvoice = FormSchema.omit({
  id: true,
  date: true,
});

// define a function/action to create a new invoice
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
  // console.log(date);
  // create an SQL query to insert the new invoice into your database and pass in the variables
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date) VALUES (${rawFormData.customerId}, ${amountInCents}, ${rawFormData.status}, ${date})  
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.'
    };
  }
  // Once the database has been updated, the `/dashboard/invoices` path should be revalidated allowing fresh data to be fetched from the server to reflect the changes
  revalidatePath('/dashbord/invoices');
  // At this point, redirect the user back to the `/dashboard/invoices` page
  redirect('/dashboard/invoices');
}

// Similarly like above, define a function/action to update/edit an invoice
export async function updateInvoice(id: string, formData: FormData) {
  // Extract the data from formData
  const RawFormData = Object.fromEntries(formData.entries());
  // Validate the types with Zod
  const rawFormData = UpdateInvoice.parse(RawFormData);
  // Convert the amount into cents
  const amountInCents = rawFormData.amount * 100;
  // create an SQL query to update/edit the invoice in your database and pass in the variables
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${rawFormData.customerId}, amount = ${amountInCents}, status = ${rawFormData.status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Invoice.'
    };
  }
  // Call `revalidatePath` to clear the client cache and make a new server request
  revalidatePath('/dashboard/invoices');
  // Call `redirect` to redirect the user to the invoice's page
  redirect('/dashboard/invoices');
}

// define a function/action to delete an invoice
export async function deleteInvoice(id: string) {
  // create an SQL query to delete the invoice from your database
  try {
    await sql`
      DELETE FROM invoices
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Invoice.'
    };
  }
  // call `revalidatePath` to clear the client cache and make a new server request
  revalidatePath('/dashboard/invoices');
}
