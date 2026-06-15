// lib/validation.ts
import { z } from "zod";

/**
 * Base schema sem refinamentos — permite usar .pick()/.omit()
 * Use signUpBaseSchema.pick({...}) para validação por etapa.
 */
export const signUpBaseSchema = z.object({
  nome: z.string().min(3, "O nome do orfanato deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido"),
  endereco: z.string().min(5, "Endereço deve ser preenchido"),
  telefone: z.string().regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Telefone inválido"),
});

/**
 * Full schema estendido com senha e refinamento para confirmarSenha.
 * Não chame .pick() diretamente em signUpSchema — use signUpBaseSchema para isso.
 */
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
