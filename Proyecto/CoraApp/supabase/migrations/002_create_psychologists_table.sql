-- ============================================
-- Create psychologists table with vector support
-- ============================================

-- Main psychologists table
CREATE TABLE psychologists (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identity
    email text UNIQUE NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    avatar_url text,
    title text NOT NULL,

    -- Professional Info
    license_number text UNIQUE NOT NULL,
    education text,
    bio text NOT NULL,
    approach text,

    -- Specializations as array for filtering
    specializations text[] NOT NULL DEFAULT '{}',
    languages text[] NOT NULL DEFAULT '{}',

    -- Session Configuration
    session_price integer NOT NULL CHECK (session_price > 0),
    currency text DEFAULT 'USD',
    session_types text[] NOT NULL DEFAULT '{}', -- ['video', 'audio', 'chat']

    -- Availability
    accepting_new_patients boolean DEFAULT true,
    next_available timestamptz,

    -- Metrics
    years_experience integer DEFAULT 0,
    rating decimal(2,1) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
    review_count integer DEFAULT 0,

    -- Verification
    verified boolean DEFAULT false,
    verified_at timestamptz,

    -- Vector embedding for semantic search (384-dim for text-embedding-3-small)
    embedding extensions.vector(384),

    -- Full-text search vector (optional, for hybrid search)
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('spanish', COALESCE(first_name, '')), 'A') ||
        setweight(to_tsvector('spanish', COALESCE(last_name, '')), 'A') ||
        setweight(to_tsvector('spanish', COALESCE(title, '')), 'B') ||
        setweight(to_tsvector('spanish', COALESCE(bio, '')), 'C') ||
        setweight(to_tsvector('spanish', COALESCE(array_to_string(specializations, ' '), '')), 'B') ||
        setweight(to_tsvector('spanish', COALESCE(approach, '')), 'C')
    ) STORED,

    -- Metadata
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ============================================
-- Create availability table (normalized)
-- ============================================

CREATE TABLE psychologist_availability (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    psychologist_id uuid REFERENCES psychologists(id) ON DELETE CASCADE,
    day_of_week smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
    time_slots time[] NOT NULL,
    created_at timestamptz DEFAULT now(),

    UNIQUE(psychologist_id, day_of_week)
);

-- ============================================
-- Create indexes for performance
-- ============================================

-- HNSW index for vector similarity search (cosine distance)
-- Using HNSW (Hierarchical Navigable Small World) for O(log n) approximate nearest neighbor
CREATE INDEX idx_psychologists_embedding_hnsw
ON psychologists
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- GIN indexes for array filtering
CREATE INDEX idx_psychologists_specializations
ON psychologists USING gin(specializations);

CREATE INDEX idx_psychologists_session_types
ON psychologists USING gin(session_types);

CREATE INDEX idx_psychologists_languages
ON psychologists USING gin(languages);

-- B-tree indexes for range queries and sorting
CREATE INDEX idx_psychologists_price
ON psychologists(session_price);

CREATE INDEX idx_psychologists_rating
ON psychologists(rating DESC);

CREATE INDEX idx_psychologists_experience
ON psychologists(years_experience DESC);

-- GIN index for full-text search (hybrid search)
CREATE INDEX idx_psychologists_search
ON psychologists USING gin(search_vector);

-- Partial composite index for common query patterns
-- Pre-filters verified + accepting_new_patients (most common filters)
CREATE INDEX idx_psychologists_active
ON psychologists(accepting_new_patients, verified, rating DESC, session_price)
WHERE accepting_new_patients = true AND verified = true;

-- Index for name ordering
CREATE INDEX idx_psychologists_name
ON psychologists(last_name, first_name);

-- Index on availability for join queries
CREATE INDEX idx_psychologist_availability_psychologist
ON psychologist_availability(psychologist_id, day_of_week);

-- ============================================
-- Row Level Security Policies
-- ============================================

ALTER TABLE psychologists ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychologist_availability ENABLE ROW LEVEL SECURITY;

-- Everyone can read psychologists (public directory)
CREATE POLICY "Psychologists are viewable by everyone"
    ON psychologists FOR SELECT
    USING (true);

-- Only authenticated users with psychologist role can update their own profile
CREATE POLICY "Psychologists can update own profile"
    ON psychologists FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Only admins can insert (handled via service role or separate admin policy)
CREATE POLICY "Only admins can insert psychologists"
    ON psychologists FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Everyone can read availability
CREATE POLICY "Availability is viewable by everyone"
    ON psychologist_availability FOR SELECT
    USING (true);

-- Psychologists can update own availability
CREATE POLICY "Psychologists can update own availability"
    ON psychologist_availability FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM psychologists
            WHERE psychologists.id = psychologist_availability.psychologist_id
            AND psychologists.id = auth.uid()
        )
    );

-- ============================================
-- Triggers
-- ============================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER psychologists_updated_at
    BEFORE UPDATE ON psychologists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Comments
-- ============================================

COMMENT ON TABLE psychologists IS 'Psychologist profiles with vector embeddings for semantic matching';
COMMENT ON COLUMN psychologists.embedding IS '384-dimensional vector embedding for semantic similarity search';
COMMENT ON COLUMN psychologists.search_vector IS 'Full-text search vector for hybrid search';
COMMENT ON TABLE psychologist_availability IS 'Weekly availability schedule for each psychologist';
