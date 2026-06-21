.PHONY: up down db-push studio

up:
	docker compose up -d

down:
	docker compose down

db-push:
	npm run db:push

studio:
	npm run db:studio
