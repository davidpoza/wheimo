build:
	docker-compose build --no-cache
start:
	docker-compose down || true && docker-compose up -d