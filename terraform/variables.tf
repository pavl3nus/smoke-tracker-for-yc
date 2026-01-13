variable "yc_token" {
  description = "Yandex Cloud OAuth token"
  type        = string
  sensitive   = true
}

variable "cloud_id" {
  description = "Yandex Cloud ID"
  type        = string
}

variable "folder_id" {
  description = "Yandex Cloud folder ID"
  type        = string
}

variable "db_password" {
  description = "PostgreSQL password"
  type        = string
  sensitive   = true
}

variable "ssh_public_key" {
  description = "SSH public key for VM access"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository URL"
  type        = string
  default     = "https://github.com/pavl3nus/smoke-tracker-for-yc.git"
}

variable "vm_count" {
  description = "Number of VMs"
  type        = number
  default     = 3
}

variable "vm_zones" {
  description = "Zones for VMs"
  type        = list(string)
  default     = ["ru-central1-a", "ru-central1-b", "ru-central1-d"]
}

variable "bucket_name" {
  description = "Имя бакета для Object Storage"
  type        = string
  default     = "smoke-tracker"
}

variable "enable_bucket_versioning" {
  description = "Включить версионирование файлов в бакете"
  type        = bool
  default     = false
}