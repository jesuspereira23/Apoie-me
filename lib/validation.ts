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