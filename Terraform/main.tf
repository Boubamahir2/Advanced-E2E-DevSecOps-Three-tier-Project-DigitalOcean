terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

# Set the variable value in *.tfvars file
# or using -var="do_token=..." CLI option
variable "do_token" {}

# Configure the DigitalOcean Provider
provider "digitalocean" {
  token = var.do_token
}


resource "digitalocean_droplet" "demo_droplet" {
  image    = "ubuntu-22-04-x64"
  name     = "web-1"
  region   = "fra1"
  size     = "s-2vcpu-4gb"
  ssh_keys = ["e1:60:18:52:09:28:79:41:f7:06:ab:e1:0f:45:67:4f"]

  # connection {
  #   host = self.ipv4_address
  #   user = "root"  # Replace with your username
  #   type = "ssh"
  #   private_key = file("~/.ssh/id_rsa")  # Securely store key
  #   # host = digitalocean_droplet.demo_droplet.ipv4_address
  #   timeout = "2m"
  # }



  # provisioner "remote-exec" {
  #   inline = [
  #     "mkdir -p  /tmp/scripts/",
  #   ]
  # }
}


output "public_ip" {
  value = digitalocean_droplet.demo_droplet.ipv4_address
}