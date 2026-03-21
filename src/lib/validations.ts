import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().optional(),
  price: z.coerce.number().positive('Price must be positive'),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  costPrice: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  lowStockThreshold: z.coerce.number().int().min(0).default(5),
  sku: z.string().min(1, 'SKU is required'),
  categoryId: z.string().optional().nullable(),
  brandName: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('DRAFT'),
  featured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().min(1),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
});

export const fitmentSchema = z.object({
  modelId: z.string().min(1, 'Vehicle model is required'),
  yearStart: z.coerce.number().int().min(1900).max(2030),
  yearEnd: z.coerce.number().int().min(1900).max(2030),
  trim: z.string().optional(),
  engine: z.string().optional(),
  notes: z.string().optional(),
});

export const addressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(5, 'ZIP code is required'),
  country: z.string().default('US'),
  phone: z.string().optional(),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().optional(),
  shippingStreet: z.string().min(1, 'Address is required'),
  shippingCity: z.string().min(1, 'City is required'),
  shippingState: z.string().min(2, 'State is required'),
  shippingZip: z.string().min(5, 'ZIP code is required'),
  shippingCountry: z.string().default('US'),
  notes: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(10, 'Review must be at least 10 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
