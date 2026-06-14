import { z } from "zod";

export const orfanatoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  telefone: z.string().regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Telefone inválido"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmarSenha: z.string()
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

export type OrfanatoForm = z.infer<typeof orfanatoSchema>;
