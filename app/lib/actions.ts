// Make it a server component to mark all the exported functions within the file as server functions/actions
'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
// use a TypeScript-first validation library (Zod) to handle type validation
import { z } from 'zod';
// define a schema that matches the shape of your database invoice table object using Zod
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({ invalid_type_error: 'Please select a customer' }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});
// define a schema that matches the shape of your create form object
const CreateInvoice = FormSchema.omit({
  id: true,
  date: true,
});
// define a schema that matches the shape of your edit form object
const UpdateInvoice = FormSchema.omit({
  id: true,
  date: true,
});

// This is temporary until @types/react-dom is updated
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
// define a function/action to create a new invoice
export async function createInvoice(prevState: State, formData: FormData) {
  // Extract and Convert FormData to a plain object
  // use const RawFormData = Object.fromEntries(formData.entries()); if you have many form fields
  const RawFormData = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  };
  // Pass RawFormData to CreateInvoice to validate the types
  const validatedFields = CreateInvoice.safeParse(RawFormData);
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  // Convert the amount into cents as its good practice to store monetary values in cents in your database to eliminate JavaScript floating-point errors and ensure greater accuracy
  const amountInCents = amount * 100;
  // create a new date with the format "YYYY-MM-DD" for the invoice's creation date
  const date = new Date().toISOString().split('T')[0];
  // Test it out in the console terminal
  // console.log(date);
  // create an SQL query, with error handling, to insert the new invoice into your database and pass in the variables
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date) VALUES (${customerId}, ${amountInCents}, ${status}, ${date})  
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
  // Once the database has been updated, the `/dashboard/invoices` path should be revalidated allowing fresh data to be fetched from the server to reflect the changes
  revalidatePath('/dashbord/invoices');
  // At this point, redirect the user back to the `/dashboard/invoices` page
  redirect('/dashboard/invoices');
}

// Similarly like above, define a function/action to update/edit an invoice
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  // Extract the data from formData
  // const RawFormData = Object.fromEntries(formData.entries());
  const RawFormData = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  };
  // Validate the types with Zod using safeParse for Server-Side Validation
  const validatedFields = UpdateInvoice.safeParse(RawFormData);
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Field. Failed to Update Invoice.',
    };
  }
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  // Convert the amount into cents
  const amountInCents = amount * 100;
  // create an SQL query, with error handling, to update/edit the invoice in your database and pass in the variables
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Invoice.',
    };
  }
  // Call `revalidatePath` to clear the client cache and make a new server request
  revalidatePath('/dashboard/invoices');
  // Call `redirect` to redirect the user to the invoice's page
  redirect('/dashboard/invoices');
}

// define a function/action to delete an invoice
export async function deleteInvoice(id: string) {
  // create an SQL query, with error handling, to delete the invoice from your database
  // throw new Error('Failed to Delete Invoice');
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

// define a function/action to connect the auth logic with your login form
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // Call the signIn function from the auth library
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': return 'Invalid credentials.'      
        default: return 'Something went wrong.';
      }
    }
    throw error;
  }
};
