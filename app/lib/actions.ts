'use server';

export async function createInvoice(formData: FormData) {
    // Extract and Convert FormData to a plain object
    const rawFormData = Object.fromEntries(formData.entries());
    // Test it out in the console terminal
    console.log(rawFormData);
};
