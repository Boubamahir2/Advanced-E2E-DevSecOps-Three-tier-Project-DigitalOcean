locals {
  script_directory = "${path.module}/scripts/"
}


data "digitalocean_ssh_key" "terraform" {
  name = var.ssh_key
}



resource "digitalocean_droplet" "server" {
    name    = var.name
    image   = var.image
    size    = "s-2vcpu-4gb"
    region  = var.region
    ssh_keys = ["e1:60:18:52:09:28:79:41:f7:06:ab:e1:0f:45:67:4f"]
    tags   = [digitalocean_tag.webserver.id, var.tag]   

  # Create directories for deployment scripts
  provisioner "remote-exec" {
    inline = [
      "mkdir -p  /tmp/scripts/",
    ]

    connection {
      type        = "ssh"
      user        = "root"
      private_key = file("~/.ssh/id_rsa") 
      host        = self.server.ipv4_address
    }
  }

  # Copy  Scripts
  provisioner "file" {
    source      = "${local.script_directory}/"
    destination = "/tmp/scripts/"

    connection {
      type        = "ssh"
      user        = "root"
       private_key = file("~/.ssh/id_rsa") 
      host        = self.server.ipv4_address
    }
  }

  provisioner "remote-exec" {
    inline = [
      "bash /tmp/scripts/software_install.sh"
    ]

    connection {
      type        = "ssh"
      user        = "root"
       private_key = file("~/.ssh/id_rsa") 
      host        = self.server.ipv4_address
    }
  }


}

resource "digitalocean_tag" "webserver" {
    name = "web"
}



