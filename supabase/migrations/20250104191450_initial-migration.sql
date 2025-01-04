CREATE TABLE products (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  price integer,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);