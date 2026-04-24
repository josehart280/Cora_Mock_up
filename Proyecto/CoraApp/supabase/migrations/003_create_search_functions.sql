-- ============================================
-- RPC Functions for Vector Search
-- ============================================

-- Function: Search psychologists by vector similarity with filters
-- Uses cosine distance for semantic matching
CREATE OR REPLACE FUNCTION search_psychologists(
    query_embedding extensions.vector(384),
    match_threshold float DEFAULT 0.5,
    match_count int DEFAULT 20,
    filter_specializations text[] DEFAULT null,
    min_price int DEFAULT null,
    max_price int DEFAULT null,
    filter_session_types text[] DEFAULT null,
    filter_accepting boolean DEFAULT true
)
RETURNS TABLE (
    id uuid,
    email text,
    first_name text,
    last_name text,
    avatar_url text,
    title text,
    license_number text,
    education text,
    bio text,
    approach text,
    specializations text[],
    languages text[],
    session_price integer,
    session_types text[],
    accepting_new_patients boolean,
    next_available timestamptz,
    years_experience integer,
    rating decimal,
    review_count integer,
    verified boolean,
    similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.email,
        p.first_name,
        p.last_name,
        p.avatar_url,
        p.title,
        p.license_number,
        p.education,
        p.bio,
        p.approach,
        p.specializations,
        p.languages,
        p.session_price,
        p.session_types,
        p.accepting_new_patients,
        p.next_available,
        p.years_experience,
        p.rating,
        p.review_count,
        p.verified,
        -- Calculate similarity: 1 - cosine_distance (range: 0 to 1)
        1 - (p.embedding <=> query_embedding) as similarity
    FROM psychologists p
    WHERE
        -- Vector similarity threshold
        1 - (p.embedding <=> query_embedding) > match_threshold
        -- Optional filters
        AND (filter_specializations IS NULL OR p.specializations && filter_specializations)
        AND (min_price IS NULL OR p.session_price >= min_price)
        AND (max_price IS NULL OR p.session_price <= max_price)
        AND (filter_session_types IS NULL OR p.session_types && filter_session_types)
        AND (filter_accepting IS NULL OR p.accepting_new_patients = filter_accepting)
        -- Always filter for verified psychologists
        AND p.verified = true
    ORDER BY p.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

COMMENT ON FUNCTION search_psychologists IS 'Search psychologists by vector embedding similarity with optional filters';


-- Function: Hybrid search (combines vector similarity + full-text search)
-- Weights: 70% vector similarity, 30% text relevance
CREATE OR REPLACE FUNCTION hybrid_search_psychologists(
    query_embedding extensions.vector(384),
    query_text text,
    match_count int DEFAULT 20
)
RETURNS TABLE (
    id uuid,
    first_name text,
    last_name text,
    avatar_url text,
    title text,
    specializations text[],
    session_price integer,
    rating decimal,
    similarity float,
    text_rank float,
    combined_score float
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.first_name,
        p.last_name,
        p.avatar_url,
        p.title,
        p.specializations,
        p.session_price,
        p.rating,
        1 - (p.embedding <=> query_embedding) as similarity,
        ts_rank(p.search_vector, plainto_tsquery('spanish', query_text)) as text_rank,
        -- Combined score: 70% vector, 30% text (normalized)
        (0.7 * (1 - (p.embedding <=> query_embedding))) +
        (0.3 * ts_rank(p.search_vector, plainto_tsquery('spanish', query_text))) as combined_score
    FROM psychologists p
    WHERE
        -- Match either by vector similarity OR full-text
        (
            1 - (p.embedding <=> query_embedding) > 0.3
            OR p.search_vector @@ plainto_tsquery('spanish', query_text)
        )
        AND p.verified = true
        AND p.accepting_new_patients = true
    ORDER BY combined_score DESC
    LIMIT match_count;
END;
$$;

COMMENT ON FUNCTION hybrid_search_psychologists IS 'Hybrid search combining vector similarity and full-text search with weighted scoring';


-- Function: Get psychologists with traditional filters (no vector search)
-- For browsing with pagination
CREATE OR REPLACE FUNCTION get_psychologists(
    filter_specializations text[] DEFAULT null,
    min_price int DEFAULT null,
    max_price int DEFAULT null,
    filter_session_types text[] DEFAULT null,
    min_rating decimal DEFAULT null,
    order_by text DEFAULT 'rating',
    sort_order text DEFAULT 'desc',
    page_size int DEFAULT 20,
    page_number int DEFAULT 1
)
RETURNS TABLE (
    id uuid,
    email text,
    first_name text,
    last_name text,
    avatar_url text,
    title text,
    specializations text[],
    languages text[],
    session_price integer,
    session_types text[],
    years_experience integer,
    rating decimal,
    review_count integer,
    total_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    offset_val int;
BEGIN
    offset_val := (page_number - 1) * page_size;

    RETURN QUERY
    SELECT
        p.id,
        p.email,
        p.first_name,
        p.last_name,
        p.avatar_url,
        p.title,
        p.specializations,
        p.languages,
        p.session_price,
        p.session_types,
        p.years_experience,
        p.rating,
        p.review_count,
        COUNT(*) OVER() as total_count
    FROM psychologists p
    WHERE
        -- Apply filters
        (filter_specializations IS NULL OR p.specializations && filter_specializations)
        AND (min_price IS NULL OR p.session_price >= min_price)
        AND (max_price IS NULL OR p.session_price <= max_price)
        AND (filter_session_types IS NULL OR p.session_types && filter_session_types)
        AND (min_rating IS NULL OR p.rating >= min_rating)
        AND p.verified = true
        AND p.accepting_new_patients = true
    ORDER BY
        CASE
            WHEN order_by = 'rating' AND sort_order = 'desc' THEN p.rating
            WHEN order_by = 'rating' AND sort_order = 'asc' THEN -p.rating::int
            WHEN order_by = 'price' AND sort_order = 'desc' THEN -p.session_price
            WHEN order_by = 'price' AND sort_order = 'asc' THEN p.session_price
            WHEN order_by = 'experience' AND sort_order = 'desc' THEN -p.years_experience
            WHEN order_by = 'experience' AND sort_order = 'asc' THEN p.years_experience
            ELSE -p.rating::int
        END
    LIMIT page_size
    OFFSET offset_val;
END;
$$;

COMMENT ON FUNCTION get_psychologists IS 'Get psychologists with traditional filters and pagination (no vector search)';


-- Function: Get availability for a psychologist
CREATE OR REPLACE FUNCTION get_psychologist_availability(
    psychologist_uuid uuid
)
RETURNS TABLE (
    day_of_week smallint,
    time_slots time[],
    day_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    day_names text[] := ARRAY['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
BEGIN
    RETURN QUERY
    SELECT
        pa.day_of_week,
        pa.time_slots,
        day_names[pa.day_of_week + 1] as day_name
    FROM psychologist_availability pa
    WHERE pa.psychologist_id = psychologist_uuid
    ORDER BY pa.day_of_week;
END;
$$;

COMMENT ON FUNCTION get_psychologist_availability IS 'Get weekly availability schedule for a specific psychologist';


-- Function: Update psychologist embedding
-- Called after profile creation or update
CREATE OR REPLACE FUNCTION update_psychologist_embedding(
    psychologist_id uuid,
    new_embedding extensions.vector(384)
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE psychologists
    SET embedding = new_embedding,
        updated_at = now()
    WHERE id = psychologist_id;
END;
$$;

COMMENT ON FUNCTION update_psychologist_embedding IS 'Update the vector embedding for a psychologist profile';


-- ============================================
-- Statistics and Analytics Functions
-- ============================================

-- Function: Get search statistics
CREATE OR REPLACE FUNCTION get_psychologist_stats()
RETURNS TABLE (
    total_count bigint,
    verified_count bigint,
    accepting_count bigint,
    avg_rating decimal,
    min_price integer,
    max_price integer,
    avg_price decimal,
    specializations text[]
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) as total_count,
        COUNT(*) FILTER (WHERE p.verified = true) as verified_count,
        COUNT(*) FILTER (WHERE p.accepting_new_patients = true) as accepting_count,
        ROUND(AVG(p.rating), 2) as avg_rating,
        MIN(p.session_price) as min_price,
        MAX(p.session_price) as max_price,
        ROUND(AVG(p.session_price), 2) as avg_price,
        ARRAY(
            SELECT DISTINCT unnest(specializations)
            FROM psychologists
            WHERE verified = true
        ) as specializations
    FROM psychologists p;
END;
$$;

COMMENT ON FUNCTION get_psychologist_stats IS 'Get aggregated statistics about psychologists';
