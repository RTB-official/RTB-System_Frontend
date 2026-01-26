-- Add registration document fields and remove tire_date
alter table vehicles add column if not exists registration_doc_bucket text;
alter table vehicles add column if not exists registration_doc_path text;
alter table vehicles add column if not exists registration_doc_name text;
alter table vehicles drop column if exists tire_date;
