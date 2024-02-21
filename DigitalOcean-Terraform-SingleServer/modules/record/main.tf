data "digitalocean_domain" "server" {
  name = var.domain_name
  # Add error handling to check if the domain exists
  # lifecycle {
  #   ignore_changes = [
  #     resource_records,
  #   ]
  # }
}

resource "digitalocean_record" "www" {
  domain    = data.digitalocean_domain.server.id
  type      = "A"
  name      = var.name
  value     = var.value
}
