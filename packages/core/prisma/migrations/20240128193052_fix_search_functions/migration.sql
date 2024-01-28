drop function if exists match_posts;
drop function if exists kw_match_posts;

-- Create a function to similarity search for "Post"
create or replace function match_posts (
  query_embedding vector(1024),
  match_count int DEFAULT null,
  filter jsonb DEFAULT '{}'
) returns table (
  id integer,
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
    1 - ("Post".embedding <=> query_embedding) as similarity
  from "Post"
  order by "Post".embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Create a function to keyword search for "Post"
create or replace function kw_match_posts(query_text text, match_count int)
returns table (id integer, content text, similarity real)
as $$

begin
return query execute
format('select id, content, ts_rank(to_tsvector(content), plainto_tsquery($1)) as similarity
from "Post"
where to_tsvector(content) @@ plainto_tsquery($1)
order by similarity desc
limit $2')
using query_text, match_count;
end;
$$ language plpgsql;
