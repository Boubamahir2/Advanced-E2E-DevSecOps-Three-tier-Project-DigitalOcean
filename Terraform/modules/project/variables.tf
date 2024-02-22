# variable "project_name" {}
# variable "resources" {}

variable "project_name" {
  description = "Name for the DigitalOcean project"
  type        = string
}

variable "resources" {
  description = "Number of resources associated with the project"
}
