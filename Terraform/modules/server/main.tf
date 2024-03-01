resource "digitalocean_droplet" "server" {
  name     = var.name
  image    = var.image
  size     = "s-2vcpu-2gb"
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

  # Create directories for deployment scripts
  provisioner "remote-exec" {
    inline = [
      "mkdir -p  /tmp/",
    ]
  }

  # File provisioner to copy a file from local to the remote EC2 instance
  provisioner "file" {
    source      = "software_install.sh"      # Replace with the path to your 
    destination = "/tmp/software_install.sh" # Replace with the path on the remote instance
  }
  
  provisioner "remote-exec" {
    inline = [
      "sudo chmod +x /tmp/software_install.sh",
      "bash /tmp/software_install.sh"
    ]
  }
}

resource "digitalocean_tag" "webserver" {
  name = "web"
}



