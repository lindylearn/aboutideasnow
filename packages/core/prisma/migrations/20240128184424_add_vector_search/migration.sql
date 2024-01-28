-- From https://js.langchain.com/docs/integrations/retrievers/supabase-hybrid/?ref=blog.langchain.dev#create-a-table-and-search-functions-in-your-database

-- Enable the pgvector extension to work with embedding vectors
create extension vector;

-- Create a table to store your documents
alter table "Post"
add column embedding vector(1024);

-- Create a function to similarity search for documents
create function match_posts (
  query_embedding vector(1024),
  match_count int DEFAULT null,
  filter jsonb DEFAULT '{}'
) returns table (
  id bigint,
  content text,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Create a function to keyword search for documents
create function kw_match_posts(query_text text, match_count int)
returns table (id bigint, content text, similarity real)
as $$

begin
return query execute
format('select id, content, ts_rank(to_tsvector(content), plainto_tsquery($1)) as similarity
from documents
where to_tsvector(content) @@ plainto_tsquery($1)
order by similarity desc
limit $2')
using query_text, match_count;
end;
$$ language plpgsql;
