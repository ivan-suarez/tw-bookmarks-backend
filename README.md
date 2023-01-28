# tw-bookmarks-backend

Build container

docker build . -t tw-backend


Start container

docker run -dp 8081:8080 --env-file .env tw-backend
