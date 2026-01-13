# Monitoring Dashboard для PostgreSQL кластера
resource "yandex_monitoring_dashboard" "postgresql_dashboard" {
  name        = "PostgreSQL Cluster Monitoring - ${yandex_mdb_postgresql_cluster.smoke-tracker-db.name}"
  description = "Comprehensive monitoring for PostgreSQL cluster"

  # 1. PostgreSQL Alive и Replication
  widget {
    position {
      h = 8
      w = 12
      x = 0
      y = 0
    }
    
    title = "PostgreSQL Status"

    chart {
      name = "PostgreSQL Alive"
      description = "Checks if PostgreSQL is running"

      query {
        name = "PostgreSQL Alive"
        target = <<-EOT
          alias(
            series_max(
              "host",
              "postgres-is_alive"{
                folderId="${var.folder_id}",
                service="managed-postgresql",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                resource_type="cluster",
                host="{{hostname}}",
                node="*"
              }
            ),
            "{{host}}"
          )
        EOT
      }

      visualization_settings {
        type                = "CHART_VISUALIZATION_TYPE_COUNTER"
        color_scheme_settings {
          automatic {}
        }
        heatmap_settings {
          green_threshold = 1
          red_threshold   = 0
          yellow_threshold = 0.5
        }
      }
    }
  }

  widget {
    position {
      h = 8
      w = 12
      x = 12
      y = 0
    }
    
    title = "Replication Status"

    chart {
      name = "Replication Lag"
      description = "Replication lag in seconds"

      query {
        name = "Replication Lag"
        target = <<-EOT
          alias(
            series_max(
              "host",
              "postgres-replication_lag"{
                folderId="${var.folder_id}",
                service="managed-postgresql",
                resource_type="cluster",
                host="*",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}"
              }
            ),
            "{{host}}"
          )
        EOT
      }

      visualization_settings {
        type = "CHART_VISUALIZATION_TYPE_LINE"
        normalize = false
      }
    }
  }

  # 2. CPU и Memory Usage
  widget {
    position {
      h = 8
      w = 24
      x = 0
      y = 8
    }
    
    title = "CPU Usage"

    chart {
      name = "Average CPU Usage"
      description = "Average CPU usage across all cores"

      query {
        name = "Average CPU"
        target = <<-EOT
          alias(
            series_avg(
              "systag",
              "cpu*"{
                folderId="${var.folder_id}",
                service="managed-postgresql",
                host="{{hostname}}",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                node="*",
                resource_type="cluster",
                systag="*"
              }
            ),
            "{{systag}}"
          )
        EOT
      }

      query {
        name = "Maximum CPU"
        target = <<-EOT
          alias(
            series_max(
              "systag",
              "cpu*"{
                folderId="${var.folder_id}",
                service="managed-postgresql",
                host="{{hostname}}",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                node="*",
                resource_type="cluster",
                systag="*",
                systag!="idle"
              }
            ),
            "{{systag}}"
          )
        EOT
      }

      visualization_settings {
        type = "CHART_VISUALIZATION_TYPE_STACK"
        normalize = true
        interpolation = "INTERPOLATION_TYPE_LINEAR"
      }
    }
  }

  widget {
    position {
      h = 8
      w = 24
      x = 0
      y = 16
    }
    
    title = "Memory Usage"

    chart {
      name = "Memory Breakdown"
      description = "Detailed memory usage"

      query {
        name = "Active Memory"
        target = <<-EOT
          alias(
            series_max(
              "systag",
              trunc(
                "mem.active_bytes"{
                  folderId="${var.folder_id}",
                  service="managed-postgresql",
                  host="{{hostname}}",
                  resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                  resource_type="cluster",
                  systag!="-"
                }
              )
            ),
            "Active"
          )
        EOT
      }

      query {
        name = "Available Memory"
        target = <<-EOT
          alias(
            series_max(
              "systag",
              trunc(
                "mem.available_bytes"{
                  folderId="${var.folder_id}",
                  service="managed-postgresql",
                  host="{{hostname}}",
                  resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                  resource_type="cluster",
                  systag!="-"
                }
              )
            ),
            "Available"
          )
        EOT
      }

      query {
        name = "Shared Memory"
        target = <<-EOT
          alias(
            series_max(
              "systag",
              trunc(
                "mem.shared_bytes"{
                  folderId="${var.folder_id}",
                  service="managed-postgresql",
                  host="{{hostname}}",
                  resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                  resource_type="cluster",
                  systag!="-"
                }
              )
            ),
            "Shared"
          )
        EOT
      }

      visualization_settings {
        type = "CHART_VISUALIZATION_TYPE_STACK"
        normalize = false
        yaxis_settings {
          unit_format = "UNIT_FORMAT_BYTES"
        }
      }
    }
  }

  # 3. Disk Usage
  widget {
    position {
      h = 8
      w = 12
      x = 0
      y = 24
    }
    
    title = "Disk Usage"

    chart {
      name = "Disk Space"
      description = "Disk usage on primary"

      query {
        name = "Disk Used"
        target = <<-EOT
          alias(
            series_max(
              "host",
              "disk.used_bytes"{
                folderId="${var.folder_id}",
                service="managed-postgresql",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                resource_type="cluster",
                node="primary",
                host="*"
              }
            ),
            "Disk used"
          )
        EOT
      }

      query {
        name = "Disk Free"
        target = <<-EOT
          alias(
            series_max(
              "host",
              "disk.free_bytes"{
                folderId="${var.folder_id}",
                service="managed-postgresql",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                node="primary",
                resource_type="cluster",
                host="*"
              }
            ),
            "Disk free"
          )
        EOT
      }

      visualization_settings {
        type = "CHART_VISUALIZATION_TYPE_STACK"
        normalize = false
        yaxis_settings {
          unit_format = "UNIT_FORMAT_BYTES"
        }
      }
    }
  }

  widget {
    position {
      h = 8
      w = 12
      x = 12
      y = 24
    }
    
    title = "Disk I/O"

    chart {
      name = "Disk Read/Write"
      description = "Disk read/write operations"

      query {
        name = "Write bytes"
        target = <<-EOT
          alias(
            non_negative_derivative(
              series_sum(
                "io.disk1.write_bytes"{
                  folderId="${var.folder_id}",
                  service="managed-postgresql",
                  host="{{hostname}}",
                  resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                  node="*"
                }
              )
            ),
            "Write bytes"
          )
        EOT
      }

      query {
        name = "Read bytes"
        target = <<-EOT
          alias(
            non_negative_derivative(
              series_sum(
                "io.disk1.read_bytes"{
                  folderId="${var.folder_id}",
                  service="managed-postgresql",
                  host="{{hostname}}",
                  resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                  node="*"
                }
              )
            ),
            "Read bytes"
          )
        EOT
      }

      visualization_settings {
        type = "CHART_VISUALIZATION_TYPE_LINE"
        normalize = false
        yaxis_settings {
          unit_format = "UNIT_FORMAT_BYTES_IEC"
        }
      }
    }
  }

  # 4. Transactions
  widget {
    position {
      h = 8
      w = 12
      x = 0
      y = 32
    }
    
    title = "Transactions per second"

    chart {
      name = "TPS"
      description = "Transactions and statements per second"

      query {
        name = "Transactions"
        target = <<-EOT
          alias(
            series_sum(
              "name",
              "pooler-xact_count"{
                folderId="${var.folder_id}",
                service="managed-postgresql",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                resource_type="cluster",
                host="{{hostname}}",
                node="*"
              }
            ),
            "Transactions"
          )
        EOT
      }

      query {
        name = "Statements"
        target = <<-EOT
          alias(
            series_sum(
              "pooler-query_count"{
                folderId="${var.folder_id}",
                service="managed-postgresql",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                resource_type="cluster",
                node="*",
                host="{{hostname}}"
              }
            ),
            "Statements"
          )
        EOT
      }

      visualization_settings {
        type = "CHART_VISUALIZATION_TYPE_LINE"
        normalize = false
      }
    }
  }

  widget {
    position {
      h = 8
      w = 12
      x = 12
      y = 32
    }
    
    title = "Transaction Times"

    chart {
      name = "Transaction Duration"
      description = "Average transaction and statement times"

      query {
        name = "Average Transaction Time"
        target = <<-EOT
          alias(
            series_avg(
              "pooler-avg_xact_time"{
                folderId="${var.folder_id}",
                service="managed-postgresql",
                host="{{hostname}}",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                resource_type="cluster",
                node="*"
              }
            ),
            "Average Transaction Time"
          )
        EOT
      }

      query {
        name = "Average Statement Time"
        target = <<-EOT
          alias(
            series_avg(
              "pooler-avg_query_time"{
                folderId="${var.folder_id}",
                service="managed-postgresql",
                resource_type="cluster",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                host="{{hostname}}",
                node="*"
              }
            ),
            "Average Statement Time"
          )
        EOT
      }

      visualization_settings {
        type = "CHART_VISUALIZATION_TYPE_LINE"
        normalize = false
        yaxis_settings {
          unit_format = "UNIT_FORMAT_SECONDS"
        }
      }
    }
  }

  # 5. Log Errors
  widget {
    position {
      h = 8
      w = 24
      x = 0
      y = 40
    }
    
    title = "Error Logs"

    chart {
      name = "Error Counts"
      description = "Log errors, fatals, and warnings"

      query {
        name = "Log Errors"
        target = <<-EOT
          alias(
            series_sum(
              ceil(
                "postgres-log_errors"{
                  folderId="${var.folder_id}",
                  service="managed-postgresql",
                  resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                  host="{{hostname}}",
                  node="*",
                  resource_type="cluster"
                }
              )
            ),
            "Log Errors"
          )
        EOT
      }

      query {
        name = "Log Fatals"
        target = <<-EOT
          alias(
            series_sum(
              ceil(
                "postgres-log_fatals"{
                  folderId="${var.folder_id}",
                  service="managed-postgresql",
                  resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                  host="{{hostname}}",
                  node="*",
                  resource_type="cluster"
                }
              )
            ),
            "Log Fatals"
          )
        EOT
      }

      query {
        name = "Log Warnings"
        target = <<-EOT
          alias(
            series_sum(
              ceil(
                "postgres-log_warnings"{
                  folderId="${var.folder_id}",
                  service="managed-postgresql",
                  resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                  host="{{hostname}}",
                  node="*",
                  resource_type="cluster"
                }
              )
            ),
            "Log Warnings"
          )
        EOT
      }

      visualization_settings {
        type = "CHART_VISUALIZATION_TYPE_COLUMN"
        normalize = false
      }
    }
  }

  # 6. Connections
  widget {
    position {
      h = 8
      w = 12
      x = 0
      y = 48
    }
    
    title = "Pooler Connections"

    chart {
      name = "Connection Counts"
      description = "Pooler connections status"

      query {
        name = "Clients"
        target = <<-EOT
          alias(
            series_sum(
              "pooler-used_clients"{
                folderId="${var.folder_id}",
                service="managed-postgresql",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                host="{{hostname}}",
                node="*"
              }
            ),
            "Clients"
          )
        EOT
      }

      query {
        name = "Servers"
        target = <<-EOT
          alias(
            series_sum(
              "pooler-used_servers"{
                folderId="${var.folder_id}",
                service="managed-postgresql",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                host="{{hostname}}",
                node="*"
              }
            ),
            "Servers"
          )
        EOT
      }

      visualization_settings {
        type = "CHART_VISUALIZATION_TYPE_LINE"
        normalize = false
      }
    }
  }

  widget {
    position {
      h = 8
      w = 12
      x = 12
      y = 48
    }
    
    title = "Network Traffic"

    chart {
      name = "Network Bytes"
      description = "Network received/sent bytes"

      query {
        name = "Received"
        target = <<-EOT
          alias(
            series_sum(
              "net.bytes_recv"{
                folderId="${var.folder_id}",
                service="managed-postgresql",
                host="{{hostname}}",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                resource_type="cluster",
                node="*"
              }
            ),
            "Received"
          )
        EOT
      }

      query {
        name = "Sent"
        target = <<-EOT
          alias(
            series_sum(
              "net.bytes_sent"{
                folderId="${var.folder_id}",
                service="managed-postgresql",
                host="{{hostname}}",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                resource_type="cluster",
                node="*"
              }
            ),
            "Sent"
          )
        EOT
      }

      visualization_settings {
        type = "CHART_VISUALIZATION_TYPE_LINE"
        normalize = false
        yaxis_settings {
          unit_format = "UNIT_FORMAT_BYTES_IEC"
        }
      }
    }
  }

  # 7. Vacuum Processes
  widget {
    position {
      h = 8
      w = 24
      x = 0
      y = 56
    }
    
    title = "Vacuum Processes"

    chart {
      name = "Vacuum Counts"
      description = "Autovacuum and user vacuum processes"

      query {
        name = "autovacuum_max_workers"
        target = <<-EOT
          alias(
            series_max(
              "cid",
              "postgres_autovacuum.autovacuum_max_workers"{
                service="managed-postgresql",
                folderId="${var.folder_id}",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}"
              }
            ),
            "limit by autovacuum_max_workers"
          )
        EOT
      }

      query {
        name = "autovacuum"
        target = <<-EOT
          alias(
            series_max(
              "cid",
              "postgres_autovacuum.total_regular_vacuums"{
                service="managed-postgresql",
                folderId="${var.folder_id}",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}"
              }
            ),
            "autovacuum"
          )
        EOT
      }

      query {
        name = "user"
        target = <<-EOT
          alias(
            series_max(
              "cid",
              "postgres_autovacuum.total_user_vacuums"{
                service="managed-postgresql",
                folderId="${var.folder_id}",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}"
              }
            ),
            "user"
          )
        EOT
      }

      query {
        name = "wraparound"
        target = <<-EOT
          alias(
            series_max(
              "cid",
              "postgres_autovacuum.total_wraparound_vacuums"{
                service="managed-postgresql",
                folderId="${var.folder_id}",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}"
              }
            ),
            "wraparound"
          )
        EOT
      }

      visualization_settings {
        type = "CHART_VISUALIZATION_TYPE_STACK"
        normalize = false
      }
    }
  }
}

# Alert Channels
resource "yandex_monitoring_notification_channel" "email_alerts" {
  name = "Email Alerts"
  description = "Email notifications for critical issues"
  
  email {
    to = ["admin@example.com"]
  }
}

# Alert Rules
resource "yandex_monitoring_alert" "postgresql_down" {
  name        = "PostgreSQL is down"
  description = "Alert when PostgreSQL service is not responding"
  
  alert_group {
    name = "postgresql-alerts"
  }
  
  notification_channels = [yandex_monitoring_notification_channel.email_alerts.id]
  
  alarm_rule {
    type = "STATUS_ALARM_RULE"
    
    status_alarm_rule {
      statuses = ["ALARM"]
      target {
        query {
          name = "PostgreSQL Alive"
          target = <<-EOT
            series_max(
              "host",
              "postgres-is_alive"{
                folderId="${var.folder_id}",
                service="managed-postgresql",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                resource_type="cluster",
                host="{{hostname}}",
                node="*"
              }
            )
          EOT
        }
      }
    }
  }
  
  alert_strategy {
    auto_close = "AUTO_CLOSE_60_MINUTES"
    notification_delay = "NOTIFICATION_DELAY_5_MINUTES"
  }
}

resource "yandex_monitoring_alert" "high_cpu" {
  name        = "High CPU Usage"
  description = "Alert when CPU usage is above 80% for 5 minutes"
  
  alert_group {
    name = "postgresql-alerts"
  }
  
  notification_channels = [yandex_monitoring_notification_channel.email_alerts.id]
  
  alarm_rule {
    type = "METRIC_ALARM_RULE"
    
    metric_alarm_rule {
      metric {
        query {
          name = "CPU Usage"
          target = <<-EOT
            series_max(
              "systag",
              "cpu*"{
                folderId="${var.folder_id}",
                service="managed-postgresql",
                host="{{hostname}}",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                node="*",
                resource_type="cluster",
                systag="*",
                systag!="idle"
              }
            )
          EOT
        }
      }
      evaluation_window = "EVALUATION_WINDOW_5_MINUTES"
      comparison = "COMPARISON_GT"
      threshold = 80
    }
  }
  
  alert_strategy {
    auto_close = "AUTO_CLOSE_30_MINUTES"
    notification_delay = "NOTIFICATION_DELAY_0"
  }
}

resource "yandex_monitoring_alert" "low_disk_space" {
  name        = "Low Disk Space"
  description = "Alert when disk free space is below 10%"
  
  alert_group {
    name = "postgresql-alerts"
  }
  
  notification_channels = [yandex_monitoring_notification_channel.email_alerts.id]
  
  alarm_rule {
    type = "METRIC_ALARM_RULE"
    
    metric_alarm_rule {
      metric {
        query {
          name = "Disk Free Percent"
          target = <<-EOT
            (
              series_max(
                "host",
                "disk.free_bytes"{
                  folderId="${var.folder_id}",
                  service="managed-postgresql",
                  resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                  node="primary",
                  resource_type="cluster",
                  host="*"
                }
              ) / 
              series_max(
                "host",
                "disk.total_bytes"{
                  folderId="${var.folder_id}",
                  service="managed-postgresql",
                  resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}",
                  node="primary",
                  resource_type="cluster",
                  host="*"
                }
              )
            ) * 100
          EOT
        }
      }
      evaluation_window = "EVALUATION_WINDOW_5_MINUTES"
      comparison = "COMPARISON_LT"
      threshold = 10
    }
  }
  
  alert_strategy {
    auto_close = "AUTO_CLOSE_60_MINUTES"
    notification_delay = "NOTIFICATION_DELAY_0"
  }
}

resource "yandex_monitoring_alert" "high_replication_lag" {
  name        = "High Replication Lag"
  description = "Alert when replication lag exceeds 60 seconds"
  
  alert_group {
    name = "postgresql-alerts"
  }
  
  notification_channels = [yandex_monitoring_notification_channel.email_alerts.id]
  
  alarm_rule {
    type = "METRIC_ALARM_RULE"
    
    metric_alarm_rule {
      metric {
        query {
          name = "Replication Lag"
          target = <<-EOT
            series_max(
              "host",
              "postgres-replication_lag"{
                folderId="${var.folder_id}",
                service="managed-postgresql",
                resource_type="cluster",
                host="*",
                resource_id="${yandex_mdb_postgresql_cluster.smoke-tracker-db.id}"
              }
            )
          EOT
        }
      }
      evaluation_window = "EVALUATION_WINDOW_5_MINUTES"
      comparison = "COMPARISON_GT"
      threshold = 60
    }
  }
  
  alert_strategy {
    auto_close = "AUTO_CLOSE_30_MINUTES"
    notification_delay = "NOTIFICATION_DELAY_0"
  }
}