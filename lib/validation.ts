// lib/validation.ts
import { z } from "zod";

/**
 * Pré‑processamento para telefone: remove tudo que não for dígito
 * e valida se restaram 10 ou 11 dígitos.
 */
const telefoneSchema = z.preprocess((val) => {
  if (typeof val === "string") return val.replace(/\D/g, "");
  return val;
}, z.string().refine((s) => /^\d{10,11}$/.test(s), { message: "Telefone inválido" }));

// ─── Orfanato ────────────────────────────────────────────────────────────────

export const signUpBaseSchema = z.object({
  nome: z.string().min(3, "O nome do orfanato deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido"),
  endereco: z.string().min(5, "Endereço deve ser preenchido"),
  telefone: telefoneSchema,
});

export const signUpSchema = signUpBaseSchema
  .extend({
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

export type SignUpBase = z.infer<typeof signUpBaseSchema>;
export type SignUpFull = z.infer<typeof signUpSchema>;

// ─── Doador ──────────────────────────────────────────────────────────────────

export const signUpDoadorBaseSchema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  telefone: telefoneSchema.optional(),
});

export const signUpDoadorSchema = signUpDoadorBaseSchema
  .extend({
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

export type SignUpDoadorBase = z.infer<typeof signUpDoadorBaseSchema>;
export type SignUpDoadorFull = z.infer<typeof signUpDoadorSchema>;

// ─── Login ───────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("Digite um e-mail válido")
    .toLowerCase()
    .trim(),
  senha: z
    .string()
    .min(1, "A senha é obrigatória")
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .max(72, "A senha não pode ter mais de 72 caracteres")
    .refine((s) => /[A-Za-z]/.test(s), {
      message: "A senha deve conter pelo menos uma letra",
    })
    .refine((s) => /[0-9]/.test(s), {
      message: "A senha deve conter pelo menos um número",
    }),
});

export type LoginForm = z.infer<typeof loginSchema>;
