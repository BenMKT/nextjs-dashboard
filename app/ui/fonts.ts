import { Inter, Lusitana } from "next/font/google"; //set the primary font and use next/font for optimization and performance

// specify the subsets to load for the fonts
export const inter = Inter (
    {subsets: ["latin"]}
); 

export const lusitana = Lusitana({
    weight: ['400', '700'],
    subsets: ['latin']
});
