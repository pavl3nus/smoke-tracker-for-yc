# Storage для логотипов приложения
resource "yandex_storage_bucket" "smoke_tracker" {
  bucket = "smoke-tracker"
  acl    = "public-read"
}

# Загрузка логотипов в бакет
resource "yandex_storage_object" "logo_light" {
  bucket = yandex_storage_bucket.smoke_tracker.bucket
  key    = "logo.png"
  
  # Путь к файлу относительно папки terraform
  source = "../frontend/public/logo.png"
  
  # MIME тип для правильного отображения в браузере
  content_type = "image/png"
  
  # Публичный доступ
  acl = "public-read"
}

resource "yandex_storage_object" "logo_dark" {
  bucket = yandex_storage_bucket.smoke_tracker.bucket
  key    = "logo-dark.png"
  
  # Путь к файлу относительно папки terraform
  source = "../frontend/public/logo-dark.png"
  
  content_type = "image/png"
  acl = "public-read"
}

# Output информации о бакете
output "bucket_info" {
  description = "Информация о бакете"
  value = {
    name        = yandex_storage_bucket.smoke_tracker.bucket
    region      = "ru-central1"
    website_url = yandex_storage_bucket.smoke_tracker.website_endpoint
    created_at  = timestamp()  # Примерное время создания
  }
  sensitive = false
}