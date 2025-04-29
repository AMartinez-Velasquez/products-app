-- Agregar columnas con valores por defecto
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE;

-- Actualizar los registros existentes con la fecha actual
UPDATE products 
SET "createdAt" = CURRENT_TIMESTAMP,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "createdAt" IS NULL;

-- Hacer las columnas NOT NULL después de establecer los valores
ALTER TABLE products 
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL; 