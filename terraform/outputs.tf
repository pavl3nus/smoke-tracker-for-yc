output "postgresql_cluster_info" {
  description = "Информация о PostgreSQL кластере"
  value = {
    host_fqdn     = yandex_mdb_postgresql_cluster.smoke-tracker-db.host[0].fqdn
    database_name = "smoke-track"
    user          = "alinochka3"
    port          = 6432
    ssl_required  = true
  }
}

output "load_balancer_external_ip" {
  description = "Внешний IP адрес Load Balancer"
  value       = yandex_lb_network_load_balancer.smoke-balancer.listener[0].external_address_spec[0].address
}

output "load_balancer_url" {
  description = "URL для доступа к приложению через Load Balancer"
  value       = "http://${yandex_lb_network_load_balancer.smoke-balancer.listener[0].external_address_spec[0].address}:5173"
}

output "vm_details" {
  description = "Детальная информация о виртуальных машинах"
  value = [
    for idx, vm in yandex_compute_instance.smoke-backend : {
      name           = vm.name
      zone           = vm.zone
      public_ip      = vm.network_interface[0].nat_ip_address
      private_ip     = vm.network_interface[0].ip_address
      fqdn           = vm.fqdn
      ssh_connection = "ssh -i ~/.ssh/id_rsa ubuntu@${vm.network_interface[0].nat_ip_address}"
    }
  ]
}

output "network_info" {
  description = "Информация о сети"
  value = {
    network_id    = yandex_vpc_network.pavlenko.id
    network_name  = yandex_vpc_network.pavlenko.name
    subnet_a_cidr = yandex_vpc_subnet.subnet_a.v4_cidr_blocks[0]
    subnet_b_cidr = yandex_vpc_subnet.subnet_b.v4_cidr_blocks[0]
    subnet_d_cidr = yandex_vpc_subnet.subnet_d.v4_cidr_blocks[0]
  }
}

output "security_group_id" {
  description = "ID группы безопасности"
  value       = yandex_vpc_security_group.default-sg.id
}

output "target_group_info" {
  description = "Информация о целевой группе Load Balancer"
  value = {
    id            = yandex_lb_target_group.smoke-backend-targets.id
    name          = yandex_lb_target_group.smoke-backend-targets.name
    target_count  = length(yandex_lb_target_group.smoke-backend-targets.target)
  }
}

output "application_urls" {
  description = "URL для доступа к различным частям приложения"
  value = {
    frontend_via_lb  = "http://${yandex_lb_network_load_balancer.smoke-balancer.listener[0].external_address_spec[0].address}:5173"
    backend_direct_1 = "http://${yandex_compute_instance.smoke-backend[0].network_interface[0].nat_ip_address}:8000"
    backend_direct_2 = "http://${yandex_compute_instance.smoke-backend[1].network_interface[0].nat_ip_address}:8000"
    backend_direct_3 = "http://${yandex_compute_instance.smoke-backend[2].network_interface[0].nat_ip_address}:8000"
  }
}

output "health_check_info" {
  description = "Информация о health check балансировщика"
  value = {
    port     = 5173
    path     = "/"
    protocol = "HTTP"
    timeout  = 2
    interval = 5
  }
}

output "connection_strings" {
  description = "Строки подключения к базе данных"
  value = {
    psql = "PGPASSWORD=${var.db_password} psql -h ${yandex_mdb_postgresql_cluster.smoke-tracker-db.host[0].fqdn} -p 6432 -U alinochka3 -d smoke-track"
    nodejs = "postgres://alinochka3:${var.db_password}@${yandex_mdb_postgresql_cluster.smoke-tracker-db.host[0].fqdn}:6432/smoke-track?ssl=true"
  }
  sensitive = true
}

output "object_storage_info" {
  description = "Информация о Object Storage"
  value = {
    bucket_name = yandex_storage_bucket.smoke_tracker.bucket
    logo_light_url = "https://storage.yandexcloud.net/${yandex_storage_bucket.smoke_tracker.bucket}/logo.png"
    logo_dark_url  = "https://storage.yandexcloud.net/${yandex_storage_bucket.smoke_tracker.bucket}/logo-dark.png"
  }
}

output "monitoring_dashboard_url" {
  description = "URL to PostgreSQL monitoring dashboard"
  value       = "https://monitoring.cloud.yandex.ru/dashboards/${yandex_monitoring_dashboard.postgresql_dashboard.id}"
}

output "alert_channels" {
  description = "Configured alert channels"
  value       = {
    email = yandex_monitoring_notification_channel.email_alerts.email[0].to
  }
}