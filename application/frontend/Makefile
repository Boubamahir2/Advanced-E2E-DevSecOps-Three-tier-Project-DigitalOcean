
build-dev:
	docker build -t jobster-client -f Dockerfile.dev .

###################
build-production:
	docker build \
		-t jobster-client:production \
		--build-arg CADDYFILE=Caddyfile.production \
		--build-arg BASE_URL=http://localhost:5000/api/v1 \ .
