/*
  Migration Corrigida Manualmente (v3):
  Adiciona lógica de 'CASE' para converter 'F' -> 'FEMALE' e 'M' -> 'MALE'
  e resolver o erro P3018.
*/

-- Create o novo "enum" para o Cargo
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- Create o novo "enum" para o Gênero
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- Create o novo "enum" para o Status de Verificação
CREATE TYPE "StatusVerificacao" AS ENUM ('PENDENTE', 'APROVADO', 'REPROVADO');

-- 1. Adiciona a nova coluna "role" à tabela "User" com o valor padrão 'USER'
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- 2. Converte a coluna "gender" (CORREÇÃO v3)
-- Usamos um 'CASE' para mapear os valores de texto antigos ('F', 'M')
-- para os novos valores do 'enum' ('FEMALE', 'MALE').
ALTER TABLE "User" ALTER COLUMN "gender" TYPE "Gender" USING (
  CASE
    WHEN "gender"::text = 'F' THEN 'FEMALE'::"Gender"
    WHEN "gender"::text = 'M' THEN 'MALE'::"Gender"
    WHEN "gender"::text = 'FEMALE' THEN 'FEMALE'::"Gender"
    WHEN "gender"::text = 'MALE' THEN 'MALE'::"Gender"
    -- Se houver qualquer outro valor (ou nulo), define como 'OTHER'
    ELSE 'OTHER'::"Gender" 
  END
);

-- 3. Converte a coluna "statusVerificacao" (ordem corrigida)
ALTER TABLE "User" ALTER COLUMN "statusVerificacao" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "statusVerificacao" TYPE "StatusVerificacao" USING ("statusVerificacao"::text::"StatusVerificacao");
ALTER TABLE "User" ALTER COLUMN "statusVerificacao" SET DEFAULT 'PENDENTE';

-- 4. Torna a coluna "driverLicense" opcional
ALTER TABLE "User" ALTER COLUMN "driverLicense" DROP NOT NULL;