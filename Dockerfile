# Dockerfile
FROM postgres:latest

ENV POSTGRES_DB=dog_database
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=password

COPY init.sql /docker-entrypoint-initdb.d/
