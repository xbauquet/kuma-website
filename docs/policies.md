---
sidebar: false
layout: Policies
title: Policies
subTitle: Bundled policies for your service traffic and network configuration.

# the data that is used to build this page
policies:
  - section: security
    sectionTitle: Security
    sectionSubTitle: Identity, Encryption and Compliance
    items:
      - title: Mesh / Multi-Mesh
        url: /docs/latest/policies/mesh/
        icon: /images/icons/policies/icon-mesh-multi-tenancy@2x.png
      - title: Mutual TLS (mTLS)
        url: /docs/latest/policies/mutual-tls/
        icon: /images/icons/policies/icon-mtls@2x.png
      - title: Traffic Permissions
        url: /docs/latest/policies/traffic-permissions/
        icon: /images/icons/policies/icon-traffic-control@2x.png
  - section: traffic-control
    sectionTitle: Traffic Control
    sectionSubTitle: Routing, Ingress, Failover
    items:
      - title: Traffic Route
        url: /docs/latest/policies/traffic-route/
        icon: /images/icons/policies/icon-traffic-route@2x.png
      - title: Health Check
        url: /docs/latest/policies/health-check/
        icon: /images/icons/policies/icon-healthcheck@2x.png
      - title: Circuit Breaker
        url: /docs/latest/policies/circuit-breaker/
        icon: /images/icons/policies/icon-circuitbreaker.png
      - title: Fault Injection
        url: /docs/latest/policies/fault-injection
        icon: /images/icons/policies/icon-fault-injection@2x.png
      - title: Kong Gateway
        url: /docs/latest/documentation/dps-and-data-model/#gateway
        icon: /images/icons/policies/icon-kong-logo.png
  - section: observability
    sectionTitle: Observability
    sectionSubTitle: Metrics, Logs and Traces
    items:
      - title: Traffic Metrics
        url: /docs/latest/policies/traffic-metrics/
        icon: /images/icons/policies/icon-dataplane-metrics@2x.png
      - title: Traffic Trace
        url: /docs/latest/policies/traffic-trace/
        icon: /images/icons/policies/icon-traffic-trace@2x.png
      - title: Traffic Log
        url: /docs/latest/policies/traffic-log/
        icon: /images/icons/policies/icon-traffic-log@2x.png
  - section: advanced
    sectionTitle: Advanced
    sectionSubTitle: Envoy configuration and Miscellaneous
    items:
      - title: Proxy Template
        url: /docs/latest/policies/proxy-template/
        icon: /images/icons/policies/icon-proxy-template@2x.png
      - title: DP/CP Security
        url: /docs/latest/documentation/security/#dataplane-token
        icon: /images/icons/policies/icon-dc-cp-security@2x.png
---
