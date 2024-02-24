### DEV

build-dev:
	cd frontend && $(MAKE) build-dev
	cd backend && $(MAKE) build

run-dev:
	docker-compose -f docker-compose-dev.yml up -d

### PROD
build-production:
	cd backend && $(MAKE) build-production
	cd backend && $(MAKE) build

run-production:
	ENV=production docker-compose -f docker-compose-production.yml up -d
	