# variable "domain_name" {}
# variable "name" {}
# variable "value" {}

variable "domain_name" {
  type = string
  description = "The base domain name for which you want to create an A record (e.g., example.com)."
}

variable "name" {
  type = string
  description = "(Optional) The subdomain name for the A record. If left empty, defaults to 'www'."
  default = "www"
}

variable "value" {
  type = string
  description = "The IP address that the A record should point to."
  sensitive = true
}
