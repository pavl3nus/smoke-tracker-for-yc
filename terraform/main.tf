# Сеть
resource "yandex_vpc_network" "pavlenko" {
  name = "pavlenko"
}

resource "yandex_vpc_subnet" "subnet_a" {
  name           = "pavlenko-ru-central1-a"
  zone           = "ru-central1-a"
  network_id     = yandex_vpc_network.pavlenko.id
  v4_cidr_blocks = ["10.128.0.0/24"]
}

resource "yandex_vpc_subnet" "subnet_b" {
  name           = "pavlenko-ru-central1-b"
  zone           = "ru-central1-b"
  network_id     = yandex_vpc_network.pavlenko.id
  v4_cidr_blocks = ["10.129.0.0/24"]
}

resource "yandex_vpc_subnet" "subnet_d" {
  name           = "pavlenko-ru-central1-d"
  zone           = "ru-central1-d"
  network_id     = yandex_vpc_network.pavlenko.id
  v4_cidr_blocks = ["10.130.0.0/24"]
}

# Группа безопасности
resource "yandex_vpc_security_group" "default-sg" {
  name        = "default-sg-enpmr1lkdog15i3c6d77"
  network_id  = yandex_vpc_network.pavlenko.id
  
  ingress {
    protocol       = "TCP"
    v4_cidr_blocks = ["0.0.0.0/0"]
    port           = 80
  }
  
  ingress {
    protocol       = "TCP"
    v4_cidr_blocks = ["0.0.0.0/0"]
    port           = 443
  }
  
  ingress {
    protocol       = "TCP"
    v4_cidr_blocks = ["0.0.0.0/0"]
    port           = 5173
  }
  
  ingress {
    protocol       = "TCP"
    v4_cidr_blocks = ["0.0.0.0/0"]
    port           = 8000
  }
  
  ingress {
    protocol       = "TCP"
    v4_cidr_blocks = ["0.0.0.0/0"]
    port           = 22
  }
  
  egress {
    protocol       = "ANY"
    v4_cidr_blocks = ["0.0.0.0/0"]
  }
}

# PostgreSQL кластер
resource "yandex_mdb_postgresql_cluster" "smoke-tracker-db" {
  name        = "smoke-tracker-db"
  environment = "PRODUCTION"
  network_id  = yandex_vpc_network.pavlenko.id
  
  config {
    version = 16
    resources {
      resource_preset_id = "s2.micro"
      disk_type_id       = "network-ssd"
      disk_size          = 10
    }
    
    access {
      web_sql = true
    }
    
    postgresql_config = {
      max_connections                   = 100
      enable_parallel_hash              = true
      vacuum_cleanup_index_scale_factor = 0.2
      autovacuum_vacuum_scale_factor    = 0.34
      default_transaction_isolation     = "TRANSACTION_ISOLATION_READ_COMMITTED"
      shared_preload_libraries          = "pg_stat_statements"
    }
  }
  
  host {
    zone      = "ru-central1-a"
    subnet_id = yandex_vpc_subnet.subnet_a.id
  }
}

resource "yandex_mdb_postgresql_database" "smoke-track" {
  cluster_id = yandex_mdb_postgresql_cluster.smoke-tracker-db.id
  name       = "smoke-track"
  owner      = yandex_mdb_postgresql_user.alinochka3.name
}

resource "yandex_mdb_postgresql_user" "alinochka3" {
  cluster_id = yandex_mdb_postgresql_cluster.smoke-tracker-db.id
  name       = "alinochka3"
  password   = var.db_password
  permission {
    database_name = "smoke-track"
  }
}

# ВМ
resource "yandex_compute_instance" "smoke-backend" {
  count = var.vm_count
  
  name        = "smoke-backend-${count.index + 1}"
  zone        = var.vm_zones[count.index % length(var.vm_zones)]
  platform_id = "standard-v3"
  
  resources {
    cores  = 2
    memory = 2
    core_fraction = 100
  }
  
  boot_disk {
    initialize_params {
      image_id = "fd8hqa8g7m4s1q1rp0gr" # Ubuntu 22.04 with OS Login
      size     = 10
    }
  }
  
  network_interface {
    subnet_id = element([
      yandex_vpc_subnet.subnet_a.id,
      yandex_vpc_subnet.subnet_b.id,
      yandex_vpc_subnet.subnet_d.id
    ], count.index)
    nat = true
    security_group_ids = [yandex_vpc_security_group.default-sg.id]
  }
  
  metadata = {
    ssh-keys = "ubuntu:${var.ssh_public_key}"
    user-data = <<-EOF
      #cloud-config
      packages:
        - docker.io
        - docker-compose
        - git
        - postgresql-client
      runcmd:
        - systemctl enable docker
        - systemctl start docker
        - git clone ${var.github_repo} /opt/smoke-tracker
        - cd /opt/smoke-tracker
        - echo "DB_HOST=${yandex_mdb_postgresql_cluster.smoke-tracker-db.host[0].fqdn}" > .env
        - echo "DB_PORT=6432" >> .env
        - echo "DB_NAME=smoke-track" >> .env
        - echo "DB_USER=alinochka3" >> .env
        - echo "DB_PASSWORD=${var.db_password}" >> .env
        - echo "DB_SSL=true" >> .env
        - echo "DB_CA_PATH=/app/.postgresql/root.crt" >> .env
        - echo "CORS_ORIGIN=http://localhost:5173" >> .env
        - mkdir -p backend/.postgresql
        - wget "https://storage.yandexcloud.net/cloud-certs/CA.pem" -O backend/.postgresql/root.crt
        - chmod 0655 backend/.postgresql/root.crt
        - docker-compose up -d
      EOF
  }
}

# Целевая группа
resource "yandex_lb_target_group" "smoke-backend-targets" {
  name = "smoke-backend-targets"
  
  dynamic "target" {
    for_each = yandex_compute_instance.smoke-backend
    content {
      subnet_id = target.value.network_interface[0].subnet_id
      address   = target.value.network_interface[0].ip_address
    }
  }
}

# Балансировщик
resource "yandex_lb_network_load_balancer" "smoke-balancer" {
  name = "smoke-balancer"
  type = "external"
  
  listener {
    name = "listener-a0a2f-5b0"
    port = 5173
    external_address_spec {
      ip_version = "ipv4"
    }
  }
  
  attached_target_group {
    target_group_id = yandex_lb_target_group.smoke-backend-targets.id
    
    healthcheck {
      name = "hc-773d9-607"
      http_options {
        port = 5173
        path = "/"
      }
      timeout   = 2
      interval  = 5
      healthy_threshold   = 2
      unhealthy_threshold = 2
    }
  }
}
