locals {
  script_directory = "${path.module}/scripts/"
}

resource "digitalocean_droplet" "server" {
  name     = var.name
  image    = var.image
  size     = "s-2vcpu-4gb"
  region   = var.region
  ssh_keys = ["e1:60:18:52:09:28:79:41:f7:06:ab:e1:0f:45:67:4f"]
  tags     = [digitalocean_tag.webserver.id, var.tag]

  # Provisioners should go outside the resource block
  connection {
    type        = "ssh"
    user        = "root"
    private_key = file("~/.ssh/id_rsa")
    host        = digitalocean_droplet.server.ipv4_address
  }
  
  provisioner "remote-exec" {
    inline = [
      "mkdir -p /tmp/scripts/",
    ]
  }

  provisioner "file" {
    source      = "${local.script_directory}/"
    destination = "/tmp/scripts/"
  }

  provisioner "remote-exec" {
    inline = [
      "bash /tmp/scripts/software_install.sh"
    ]
  }
}

resource "digitalocean_tag" "webserver" {
  name = "web"
}



