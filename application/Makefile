### PROD

build-production:
	cd backend && $(MAKE) build-production
	cd frontend && $(MAKE) build	

run-production:
	ENV=production docker-compose -f docker-compose-production.yml up

# ### REMOTE

# SSH_STRING:=root@161.35.104.130

# ssh:
# 	ssh $(SSH_STRING)


# # apt install make

# copy-files:
# 	scp -r ./* $(SSH_STRING):/root/

# # when you add firewall rule, have to add SSH on port 22 or it will stop working

# # run challenge with cloudflare on flexible, then bump to full