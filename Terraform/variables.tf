variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "name" {
  description = "Name for resources"
  type = list(string)
}

variable "environment" {
  description = "Environment (e.g., dev, prod)"
  type        = string
}

variable "image" {
  description = "Droplet image"
  type        = string
}

variable "tag" {
  description = "Tag for resources"
  type        = string
}

variable "domain_name" {
  description = "Domain name for DNS records"
  type        = string
}

variable "region" {
  description = "DigitalOcean region"
  type        = string
}

variable "project_name" {
  description = "Name for the DigitalOcean project"
  type        = string
}


