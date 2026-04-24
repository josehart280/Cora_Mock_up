-- ============================================
-- Enable pgvector extension for vector search
-- ============================================

-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- Verify extension was created
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'vector'
    ) THEN
        RAISE EXCEPTION 'pgvector extension failed to install';
    END IF;
END $$;

COMMENT ON EXTENSION vector IS 'Vector similarity search with pgvector for psychologist matching';
