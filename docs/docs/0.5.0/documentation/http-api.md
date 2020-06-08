# HTTP API

Kuma ships with a RESTful HTTP interface that you can use to retrieve the state of your configuration and policies on every environment, and when running on Universal mode it will also allow to make changes to the state. On Kubernetes, you will use native CRDs to change the state in order to be consistent with Kubernetes best practices.

::: tip
**CI/CD**: The HTTP API can be used for infrastructure automation to either retrieve data, or to make changes when running in Universal mode. The [`kumactl`](../kumactl) CLI is built on top of the HTTP API, which you can also access with any other HTTP client like `curl`.
:::

By default the HTTP API is listening on port `5681`. The endpoints available are:

* `/config`
* `/meshes`
* `/dataplanes`
* `/dataplanes+insights`
* `/health-checks`
* `/proxytemplates`
* `/traffic-logs`
* `/traffic-permissions`
* `/traffic-routes`
* `/fault-injections`
* `/meshes/{name}`
* `/meshes/{name}/dataplanes`
* `/meshes/{name}/dataplanes/{name}`
* `/meshes/{name}/dataplanes+insights`
* `/meshes/{name}/dataplanes+insights/{name}`
* `/meshes/{name}/health-checks`
* `/meshes/{name}/health-checks/{name}`
* `/meshes/{name}/proxytemplates`
* `/meshes/{name}/proxytemplates/{name}`
* `/meshes/{name}/traffic-logs`
* `/meshes/{name}/traffic-logs/{name}`
* `/meshes/{name}/traffic-permissions`
* `/meshes/{name}/traffic-permissions/{name}`
* `/meshes/{name}/traffic-routes`
* `/meshes/{name}/traffic-routes/{name}`
* `/meshes/{name}/fault-injections`
* `/meshes/{name}/fault-injections/{name}`

You can use `GET` requests to retrieve the state of Kuma on both Universal and Kubernetes, and `PUT` and `DELETE` requests on Universal to change the state.

## Pagination

Every resource list in Kuma is paginated. To use pagination, you can use following query parameters:
* `size` - size of the page (default - 1000, maximum value - 10000).
* `offset` - offset from which the page will be listed. The offset is a `string`, it does not have to be a number (it depends on the environment).

A response with a pagination contains `next` field with URL to fetch the next page. Example:
```json
{
  "items": [...],
  "next": "http://localhost:5681/meshes/default/dataplanes?offset=10"
}
```
If next field is `null` there is no more pages to fetch.

## Control Plane configuration

### Get effective configuration of the Control Plane

Request: `GET /config`

Response: `200 OK` with the effective configuration of the Control Plane (notice that secrets, such as database passwords, will never appear in the response)

Example:
```bash
curl http://localhost:5681/config
```
```json
{
  "adminServer": {
    "apis": {
      "dataplaneToken": {
        "enabled": true
      }
    },
    "local": {
      "port": 5679
    },
    "public": {
      "clientCertsDir": "/etc/kuma.io/kuma-cp/admin-api/tls/allowed-client-certs.d",
      "enabled": true,
      "interface": "0.0.0.0",
      "port": 5684,
      "tlsCertFile": "/etc/kuma.io/kuma-cp/admin-api/tls/server.cert",
      "tlsKeyFile": "/etc/kuma.io/kuma-cp/admin-api/tls/server.key"
    }
  },
  "apiServer": {
    "corsAllowedDomains": [
      ".*"
    ],
    "port": 5681,
    "readOnly": false
  },
  "bootstrapServer": {
    "params": {
      "adminAccessLogPath": "/dev/null",
      "adminAddress": "127.0.0.1",
      "adminPort": 0,
      "xdsConnectTimeout": "1s",
      "xdsHost": "kuma-control-plane.internal",
      "xdsPort": 5678
    },
    "port": 5682
  },
  "dataplaneTokenServer": {
    "enabled": true,
    "local": {
      "port": 5679
    },
    "public": {
      "clientCertsDir": "/etc/kuma.io/kuma-cp/admin-api/tls/allowed-client-certs.d",
      "enabled": true,
      "interface": "0.0.0.0",
      "port": 5684,
      "tlsCertFile": "/etc/kuma.io/kuma-cp/admin-api/tls/server.cert",
      "tlsKeyFile": "/etc/kuma.io/kuma-cp/admin-api/tls/server.key"
    }
  },
  "defaults": {
    "mesh": "type: Mesh\nname: default"
  },
  "discovery": {
    "universal": {
      "pollingInterval": "1s"
    }
  },
  "environment": "universal",
  "general": {
    "advertisedHostname": "kuma-control-plane.internal"
  },
  "guiServer": {
    "port": 5683
  },
  "monitoringAssignmentServer": {
    "assignmentRefreshInterval": "1s",
    "grpcPort": 5676
  },
  "reports": {
    "enabled": true
  },
  "runtime": {
    "kubernetes": {
      "admissionServer": {
        "address": "",
        "certDir": "",
        "port": 5443
      }
    }
  },
  "sdsServer": {
    "grpcPort": 5677,
    "tlsCertFile": "/tmp/117637813.crt",
    "tlsKeyFile": "/tmp/240596112.key"
  },
  "store": {
    "kubernetes": {
      "systemNamespace": "kuma-system"
    },
    "postgres": {
      "connectionTimeout": 5,
      "dbName": "kuma",
      "host": "127.0.0.1",
      "password": "*****",
      "port": 15432,
      "user": "kuma"
    },
    "type": "memory"
  },
  "xdsServer": {
    "dataplaneConfigurationRefreshInterval": "1s",
    "dataplaneStatusFlushInterval": "1s",
    "diagnosticsPort": 5680,
    "grpcPort": 5678
  }
}
```

## Meshes

### Get Mesh
Request: `GET /meshes/{name}`

Response: `200 OK` with Mesh entity

Example:
```bash
curl http://localhost:5681/meshes/mesh-1
```
```json
{
  "name": "mesh-1",
  "type": "Mesh",
  "creationTime": "2020-05-12T12:31:45.606217+02:00",
  "modificationTime": "2020-05-12T12:31:45.606217+02:00",
  "mtls": {
    "backends": [
      {
        "name": "ca-1",
        "type": "builtin"
      },
      {
        "name": "ca-2",
        "type": "provided",
        "conf": {
          "cert": {
            "secret": "provided-cert"
          },
          "key": {
            "secret": "provided-cert"
          }
        }
      }
    ],
    "enabledBackend": "ca-1"
  },
  "tracing": {
    "defaultBackend": "zipkin-1",
    "backends": [
      {
        "name": "zipkin-1",
        "type": "zipkin",
        "conf": {
          "url": "http://zipkin.local:9411/api/v1/spans"
        }
      }
    ]
  },
  "logging": {
    "backends": [
      {
        "name": "file-tmp",
        "format": "{ \"destination\": \"%KUMA_DESTINATION_SERVICE%\", \"destinationAddress\": \"%UPSTREAM_LOCAL_ADDRESS%\", \"source\": \"%KUMA_SOURCE_SERVICE%\", \"sourceAddress\": \"%KUMA_SOURCE_ADDRESS%\", \"bytesReceived\": \"%BYTES_RECEIVED%\", \"bytesSent\": \"%BYTES_SENT%\"}",
        "type": "file",
        "conf": {
          "path": "/tmp/access.log"
        }
      },
      {
        "name": "logstash",
        "type": "tcp",
        "conf": {
          "address": "logstash.internal:9000"
        }
      }
    ]
  },
  "metrics": {
    "enabledBackend": "prometheus-1",
    "backends": [
      {
        "name": "prometheus-1",
        "type": "prometheus",
        "conf": {
          "port": 1234,
          "path": "/metrics"
        }
      } 
    ]
  }
}
```

### Create/Update Mesh
Request: `PUT /meshes/{name}` with Mesh entity in body

Response: `201 Created` when the resource is created and `200 OK` when it is updated

Example:
```bash
curl -XPUT http://localhost:5681/meshes/mesh-1 --data @mesh.json -H'content-type: application/json'
```
```json
{
  "name": "mesh-1",
  "type": "Mesh",
  "mtls": {
    "backends": [
      {
        "name": "ca-1",
        "type": "builtin"
      },
      {
        "name": "ca-2",
        "type": "provided",
        "conf": {
          "cert": {
            "secret": "provided-cert"
          },
          "key": {
            "secret": "provided-cert"
          }
        }
      }
    ],
    "enabledBackend": "ca-1"
  },
  "tracing": {
    "defaultBackend": "zipkin-1",
    "backends": [
      {
        "name": "zipkin-1",
        "type": "zipkin",
        "conf": {
          "url": "http://zipkin.local:9411/api/v1/spans"
        }
      }
    ]
  },
  "logging": {
    "backends": [
      {
        "name": "file-tmp",
        "format": "{ \"destination\": \"%KUMA_DESTINATION_SERVICE%\", \"destinationAddress\": \"%UPSTREAM_LOCAL_ADDRESS%\", \"source\": \"%KUMA_SOURCE_SERVICE%\", \"sourceAddress\": \"%KUMA_SOURCE_ADDRESS%\", \"bytesReceived\": \"%BYTES_RECEIVED%\", \"bytesSent\": \"%BYTES_SENT%\"}",
        "type": "file",
        "conf": {
          "path": "/tmp/access.log"
        }
      },
      {
        "name": "logstash",
        "type": "tcp",
        "conf": {
          "address": "logstash.internal:9000"
        }
      }
    ]
  },
  "metrics": {
    "enabledBackend": "prometheus-1",
    "backends": [
      {
        "name": "prometheus-1",
        "type": "prometheus",
        "conf": {
          "port": 1234,
          "path": "/metrics"
        }
      } 
    ]
  }
}
```

### List Meshes
Request: `GET /meshes`

Response: `200 OK` with body of Mesh entities

Example:
```bash
curl http://localhost:5681/meshes
```
```json
{
  "items": [
    {
      "name": "mesh-1",
      "type": "Mesh",
      "creationTime": "2020-05-12T12:31:45.606217+02:00",
      "modificationTime": "2020-05-12T12:31:45.606217+02:00",
      "mtls": {
        "backends": [
          {
            "name": "ca-1",
            "type": "builtin"
          },
          {
            "name": "ca-2",
            "type": "provided",
            "conf": {
              "cert": {
                "secret": "provided-cert"
              },
              "key": {
                "secret": "provided-cert"
              }
            }
          }
        ],
        "enabledBackend": "ca-1"
      },
      "tracing": {
        "defaultBackend": "zipkin-1",
        "backends": [
          {
            "name": "zipkin-1",
            "type": "zipkin",
            "conf": {
              "url": "http://zipkin.local:9411/api/v1/spans"
            }
          }
        ]
      },
      "logging": {
        "backends": [
          {
            "name": "file-tmp",
            "format": "{ \"destination\": \"%KUMA_DESTINATION_SERVICE%\", \"destinationAddress\": \"%UPSTREAM_LOCAL_ADDRESS%\", \"source\": \"%KUMA_SOURCE_SERVICE%\", \"sourceAddress\": \"%KUMA_SOURCE_ADDRESS%\", \"bytesReceived\": \"%BYTES_RECEIVED%\", \"bytesSent\": \"%BYTES_SENT%\"}",
            "type": "file",
            "conf": {
              "path": "/tmp/access.log"
            }
          },
          {
            "name": "logstash",
            "type": "tcp",
            "conf": {
              "address": "logstash.internal:9000"
            }
          }
        ]
      },
      "metrics": {
        "enabledBackend": "prometheus-1",
        "backends": [
          {
            "name": "prometheus-1",
            "type": "prometheus",
            "conf": {
              "port": 1234,
              "path": "/metrics"
            }
          } 
        ]
      }
    }
  ],
  "next": "http://localhost:5681/meshes?offset=1"
}
```

### Delete Mesh
Request: `DELETE /meshes/{name}`

Response: `200 OK`

Example:
```bash
curl -XDELETE http://localhost:5681/meshes/mesh-1
```

## Dataplanes

### Get Dataplane
Request: `GET /meshes/{mesh}/dataplanes/{name}`

Response: `200 OK` with Mesh entity

Example:
```bash
curl http://localhost:5681/meshes/mesh-1/dataplanes/backend-1
```
```json
{
  "type": "Dataplane",
  "name": "backend-1",
  "mesh": "mesh-1",
  "creationTime": "2020-05-12T12:31:45.606217+02:00",
  "modificationTime": "2020-05-12T12:31:45.606217+02:00",
  "networking": {
    "address": "127.0.0.1",
    "inbound": [
      {
        "port": 11011,
        "servicePort": 11012,
        "tags": {
          "service": "backend",
          "version": "2.0",
          "env": "production"
        }
      }
    ],
    "outbound": [
      {
        "port": 33033,
        "service": "database"
      },
      {
        "port": 44044,
        "service": "user"
      }
    ]
  }
}
```

### Create/Update Dataplane
Request: `PUT /meshes/{mesh}/dataplanes/{name}` with Dataplane entity in body

Response: `201 Created` when the resource is created and `200 OK` when it is updated

Example:
```bash
curl -XPUT http://localhost:5681/meshes/mesh-1/dataplanes/backend-1 --data @dataplane.json -H'content-type: application/json'
```
```json
{
  "type": "Dataplane",
  "name": "backend-1",
  "mesh": "mesh-1",
  "networking": {
    "address": "127.0.0.1",
    "inbound": [
      {
        "port": 11011,
        "servicePort": 11012,
        "tags": {
          "service": "backend",
          "version": "2.0",
          "env": "production"
        }
      }
    ],
    "outbound": [
      {
        "port": 33033,
        "service": "database"
      },
      {
        "port": 44044,
        "service": "user"
      }
    ]
  }
}
```

### List Dataplanes
Request: `GET /meshes/{mesh}/dataplanes`

Response: `200 OK` with body of Dataplane entities

Example:
```bash
curl http://localhost:5681/meshes/mesh-1/dataplanes
```
```json
{
  "items": [
    {
      "type": "Dataplane",
      "name": "backend-1",
      "mesh": "mesh-1",
      "creationTime": "2020-05-12T12:31:45.606217+02:00",
      "modificationTime": "2020-05-12T12:31:45.606217+02:00",
      "networking": {
        "address": "127.0.0.1",
        "inbound": [
          {
            "port": 11011,
            "servicePort": 11012,
            "tags": {
              "service": "backend",
              "version": "2.0",
              "env": "production"
            }
          }
        ],
        "outbound": [
          {
            "port": 33033,
            "service": "database"
          },
          {
            "port": 44044,
            "service": "user"
          }
        ]
      }
    }
  ],
  "next": "http://localhost:5681/meshes/mesh-1/dataplanes?offset=1"
}
```

### Delete Dataplane
Request: `DELETE /meshes/{mesh}/dataplanes/{name}`

Response: `200 OK`

Example:
```bash
curl -XDELETE http://localhost:5681/meshes/mesh-1/dataplanes/backend-1
```

## Dataplane Overviews

### Get Dataplane Overview
Request: `GET /meshes/{mesh}/dataplane+insights/{name}`

Response: `200 OK` with Dataplane entity including insight

Example:
```bash
curl http://localhost:5681/meshes/default/dataplanes+insights/example
```
```json
{
 "type": "DataplaneOverview",
 "mesh": "default",
 "name": "example",
 "creationTime": "2020-05-12T12:31:45.606217+02:00",
 "modificationTime": "2020-05-12T12:31:45.606217+02:00",
 "dataplane": {
  "networking": {
   "address": "127.0.0.1",
   "inbound": [
    {
     "port": 11011,
     "servicePort": 11012,
     "tags": {
      "env": "production",
      "service": "backend",
      "version": "2.0"
     }
    }
   ],
   "outbound": [
    {
     "port": 33033,
     "service": "database"
    }
   ]
  }
 },
 "dataplaneInsight": {
  "subscriptions": [
   {
    "id": "426fe0d8-f667-11e9-b081-acde48001122",
    "controlPlaneInstanceId": "06070748-f667-11e9-b081-acde48001122",
    "connectTime": "2019-10-24T14:04:56.820350Z",
    "status": {
     "lastUpdateTime": "2019-10-24T14:04:57.832482Z",
     "total": {
      "responsesSent": "3",
      "responsesAcknowledged": "3"
     },
     "cds": {
      "responsesSent": "1",
      "responsesAcknowledged": "1"
     },
     "eds": {
      "responsesSent": "1",
      "responsesAcknowledged": "1"
     },
     "lds": {
      "responsesSent": "1",
      "responsesAcknowledged": "1"
     },
     "rds": {}
    }
   }
  ]
 }
}
```

### List Dataplane Overviews
Request: `GET /meshes/{mesh}/dataplane+insights/`

Response: `200 OK` with Dataplane entities including insight

Example:
```bash
curl http://localhost:5681/meshes/default/dataplanes+insights
```
```json
{
  "items": [
    {
     "type": "DataplaneOverview",
     "mesh": "default",
     "name": "example",
     "creationTime": "2020-05-12T12:31:45.606217+02:00",
     "modificationTime": "2020-05-12T12:31:45.606217+02:00",
     "dataplane": {
      "networking": {
       "address": "127.0.0.1",
       "inbound": [
        {
         "port": 11011,
         "servicePort": 11012,
         "tags": {
          "env": "production",
          "service": "backend",
          "version": "2.0"
         }
        }
       ],
       "outbound": [
        {
         "port": 33033,
         "service": "database"
        }
       ]
      }
     },
     "dataplaneInsight": {
      "subscriptions": [
       {
        "id": "426fe0d8-f667-11e9-b081-acde48001122",
        "controlPlaneInstanceId": "06070748-f667-11e9-b081-acde48001122",
        "connectTime": "2019-10-24T14:04:56.820350Z",
        "status": {
         "lastUpdateTime": "2019-10-24T14:04:57.832482Z",
         "total": {
          "responsesSent": "3",
          "responsesAcknowledged": "3"
         },
         "cds": {
          "responsesSent": "1",
          "responsesAcknowledged": "1"
         },
         "eds": {
          "responsesSent": "1",
          "responsesAcknowledged": "1"
         },
         "lds": {
          "responsesSent": "1",
          "responsesAcknowledged": "1"
         },
         "rds": {}
        }
       }
      ]
     }
    }
  ],
  "next": "http://localhost:5681/meshes/default/dataplanes+insights?offset=1"
}
```

## Health Check

### Get Health Check
Request: `GET /meshes/{mesh}/health-checks/{name}`

Response: `200 OK` with Health Check entity

Example:
```bash
curl http://localhost:5681/meshes/mesh-1/health-checks/web-to-backend
```
```json
{
 "type": "HealthCheck",
 "mesh": "mesh-1",
 "name": "web-to-backend",
 "creationTime": "2020-05-12T12:31:45.606217+02:00",
 "modificationTime": "2020-05-12T12:31:45.606217+02:00",
 "sources": [
  {
   "match": {
    "service": "web"
   }
  }
 ],
 "destinations": [
  {
   "match": {
    "service": "backend"
   }
  }
 ],
 "conf": {
  "activeChecks": {
   "interval": "10s",
   "timeout": "2s",
   "unhealthyThreshold": 3,
   "healthyThreshold": 1
  }
 }
}
```

### Create/Update Health Check
Request: `PUT /meshes/{mesh}/health-checks/{name}` with Health Check entity in body

Response: `201 Created` when the resource is created and `200 OK` when it is updated

Example:
```bash
curl -XPUT http://localhost:5681/meshes/mesh-1/health-checks/web-to-backend --data @healthcheck.json -H'content-type: application/json'
```
```json
{
 "type": "HealthCheck",
 "mesh": "mesh-1",
 "name": "web-to-backend",
 "sources": [
  {
   "match": {
    "service": "web"
   }
  }
 ],
 "destinations": [
  {
   "match": {
    "service": "backend"
   }
  }
 ],
 "conf": {
  "activeChecks": {
   "interval": "10s",
   "timeout": "2s",
   "unhealthyThreshold": 3,
   "healthyThreshold": 1
  }
 }
}
```

### List Health Checks
Request: `GET /meshes/{mesh}/health-checks`

Response: `200 OK` with body of Health Check entities

Example:
```bash
curl http://localhost:5681/meshes/mesh-1/health-checks
```
```json
{
 "items": [
  {
   "type": "HealthCheck",
   "mesh": "mesh-1",
   "name": "web-to-backend",
   "creationTime": "2020-05-12T12:31:45.606217+02:00",
   "modificationTime": "2020-05-12T12:31:45.606217+02:00",
   "sources": [
    {
     "match": {
      "service": "web"
     }
    }
   ],
   "destinations": [
    {
     "match": {
      "service": "backend"
     }
    }
   ],
   "conf": {
    "activeChecks": {
     "interval": "10s",
     "timeout": "2s",
     "unhealthyThreshold": 3,
     "healthyThreshold": 1
    }
   }
  }
 ],
 "next": "http://localhost:5681/meshes/mesh-1/health-checks?offset=1"
}
```

### Delete Health Check
Request: `DELETE /meshes/{mesh}/health-checks/{name}`

Response: `200 OK`

Example:
```bash
curl -XDELETE http://localhost:5681/meshes/mesh-1/health-checks/web-to-backend
```

## Proxy Template

### Get Proxy Template
Request: `GET /meshes/{mesh}/proxytemplates/{name}`

Response: `200 OK` with Proxy Template entity

Example:
```bash
curl http://localhost:5681/meshes/mesh-1/proxytemplates/pt-1
```
```json
{
 "type": "ProxyTemplate",
 "mesh": "mesh-1",
 "name": "pt-1",
 "creationTime": "2020-05-12T12:31:45.606217+02:00",
 "modificationTime": "2020-05-12T12:31:45.606217+02:00",
 "selectors": [
  {
   "match": {
    "service": "backend"
   }
  }
 ],
 "conf": {
  "imports": [
   "default-proxy"
  ],
  "resources": [
   {
    "name": "raw-name",
    "version": "raw-version",
    "resource": "'@type': type.googleapis.com/envoy.api.v2.Cluster\nconnectTimeout: 5s\nloadAssignment:\n  clusterName: localhost:8443\n  endpoints:\n    - lbEndpoints:\n        - endpoint:\n            address:\n              socketAddress:\n                address: 127.0.0.1\n                portValue: 8443\nname: localhost:8443\ntype: STATIC\n"
   }
  ]
 }
}
```

### Create/Update Proxy Template
Request: `PUT /meshes/{mesh}/proxytemplates/{name}` with Proxy Template entity in body

Response: `201 Created` when the resource is created and `200 OK` when it is updated

Example:
```bash
curl -XPUT http://localhost:5681/meshes/mesh-1/proxytemplates/pt-1 --data @proxytemplate.json -H'content-type: application/json'
```
```json
{
  "type": "ProxyTemplate",
  "name": "pt-1",
  "mesh": "mesh-1",
  "selectors": [
    {
      "match": {
          "service": "backend"
      }
    }
  ],
  "conf": {
    "imports": [
      "default-proxy"
    ],
    "resources": [
      {
        "name": "raw-name",
        "version": "raw-version",
        "resource": "'@type': type.googleapis.com/envoy.api.v2.Cluster\nconnectTimeout: 5s\nloadAssignment:\n  clusterName: localhost:8443\n  endpoints:\n    - lbEndpoints:\n        - endpoint:\n            address:\n              socketAddress:\n                address: 127.0.0.1\n                portValue: 8443\nname: localhost:8443\ntype: STATIC\n"
      }
    ]
  }
}
```

### List Proxy Templates
Request: `GET /meshes/{mesh}/proxytemplates`

Response: `200 OK` with body of Proxy Template entities

Example:
```bash
curl http://localhost:5681/meshes/mesh-1/proxytemplates
```
```json
{
 "items": [
  {
   "type": "ProxyTemplate",
   "mesh": "mesh-1",
   "name": "pt-1",
   "creationTime": "2020-05-12T12:31:45.606217+02:00",
   "modificationTime": "2020-05-12T12:31:45.606217+02:00",
   "selectors": [
    {
     "match": {
      "service": "backend"
     }
    }
   ],
   "conf": {
    "imports": [
     "default-proxy"
    ],
    "resources": [
     {
      "name": "raw-name",
      "version": "raw-version",
      "resource": "'@type': type.googleapis.com/envoy.api.v2.Cluster\nconnectTimeout: 5s\nloadAssignment:\n  clusterName: localhost:8443\n  endpoints:\n    - lbEndpoints:\n        - endpoint:\n            address:\n              socketAddress:\n                address: 127.0.0.1\n                portValue: 8443\nname: localhost:8443\ntype: STATIC\n"
     }
    ]
   }
  }
 ],
 "next": "http://localhost:5681/meshes/mesh-1/proxytemplates?offset=1"
}
```

### Delete Proxy Template
Request: `DELETE /meshes/{mesh}/proxytemplates/{name}`

Response: `200 OK`

Example:
```bash
curl -XDELETE http://localhost:5681/meshes/mesh-1/proxytemplates/pt-1
```

## Traffic Permission

### Get Traffic Permission
Request: `GET /meshes/{mesh}/traffic-permissions/{name}`

Response: `200 OK` with Traffic Permission entity

Example:
```bash
curl http://localhost:5681/meshes/mesh-1/traffic-permissions/tp-1
```
```json
{
 "type": "TrafficPermission",
 "mesh": "mesh-1",
 "name": "tp-1",
 "creationTime": "2020-05-12T12:31:45.606217+02:00",
 "modificationTime": "2020-05-12T12:31:45.606217+02:00",
 "sources": [
  {
   "match": {
    "service": "backend"
   }
  }
 ],
 "destinations": [
  {
   "match": {
    "service": "redis"
   }
  }
 ]
}
```

### Create/Update Traffic Permission
Request: `PUT /meshes/{mesh}/trafficpermissions/{name}` with Traffic Permission entity in body

Response: `201 Created` when the resource is created and `200 OK` when it is updated

Example:
```bash
curl -XPUT http://localhost:5681/meshes/mesh-1/traffic-permissions/tp-1 --data @trafficpermission.json -H'content-type: application/json'
```
```json
{
  "type": "TrafficPermission",
  "name": "tp-1",
  "mesh": "mesh-1",
  "sources": [
    {
      "match": {
        "service": "backend"
      }
    }
  ],
  "destinations": [
    {
      "match": {
        "service": "redis"
      }
    }
  ]
}
```

### List Traffic Permissions
Request: `GET /meshes/{mesh}/traffic-permissions`

Response: `200 OK` with body of Traffic Permission entities

Example:
```bash
curl http://localhost:5681/meshes/mesh-1/traffic-permissions
```
```json
{
 "items": [
  {
   "type": "TrafficPermission",
   "mesh": "mesh-1",
   "name": "tp-1",
   "creationTime": "2020-05-12T12:31:45.606217+02:00",
   "modificationTime": "2020-05-12T12:31:45.606217+02:00",
   "sources": [
    {
     "match": {
      "service": "backend"
     }
    }
   ],
   "destinations": [
    {
     "match": {
      "service": "redis"
     }
    }
   ]
  }
 ],
 "next": "http://localhost:5681/meshes/mesh-1/traffic-permissions?offset=1"
}
```

### Delete Traffic Permission
Request: `DELETE /meshes/{mesh}/traffic-permissions/{name}`

Response: `200 OK`

Example:
```bash
curl -XDELETE http://localhost:5681/meshes/mesh-1/traffic-permissions/pt-1
```

## Traffic Log

### Get Traffic Log
Request: `GET /meshes/{mesh}/traffic-logs/{name}`

Response: `200 OK` with Traffic Log entity

Example:
```bash
curl http://localhost:5681/meshes/mesh-1/traffic-logs/tl-1
```
```json
{
 "type": "TrafficLog",
 "mesh": "mesh-1",
 "name": "tl-1",
 "creationTime": "2020-05-12T12:31:45.606217+02:00",
 "modificationTime": "2020-05-12T12:31:45.606217+02:00",
 "sources": [
  {
   "match": {
    "service": "web",
    "version": "1.0"
   }
  }
 ],
 "destinations": [
  {
   "match": {
    "service": "backend"
   }
  }
 ],
 "conf": {
  "backend": "file"
 }
}
```

### Create/Update Traffic Log
Request: `PUT /meshes/{mesh}/traffic-logs/{name}` with Traffic Log entity in body

Response: `201 Created` when the resource is created and `200 OK` when it is updated

Example:
```bash
curl -XPUT http://localhost:5681/meshes/mesh-1/traffic-logs/tl-1 --data @trafficlog.json -H'content-type: application/json'
```
```json
{
  "type": "TrafficLog",
  "mesh": "mesh-1",
  "name": "tl-1",
  "sources": [
    {
      "match": {
        "service": "web",
        "version": "1.0"
      }
    }
  ],
  "destinations": [
    {
      "match": {
        "service": "backend"
      }
    }
  ],
  "conf": {
    "backend": "file"
  }
}
```

### List Traffic Logs
Request: `GET /meshes/{mesh}/traffic-logs`

Response: `200 OK` with body of Traffic Log entities

Example:
```bash
curl http://localhost:5681/meshes/mesh-1/traffic-logs
```
```json
{
 "items": [
  {
   "type": "TrafficLog",
   "mesh": "mesh-1",
   "name": "tl-1",
   "creationTime": "2020-05-12T12:31:45.606217+02:00",
   "modificationTime": "2020-05-12T12:31:45.606217+02:00",
   "sources": [
    {
     "match": {
      "service": "web",
      "version": "1.0"
     }
    }
   ],
   "destinations": [
    {
     "match": {
      "service": "backend"
     }
    }
   ],
   "conf": {
    "backend": "file"
   }
  }
 ],
 "next": "http://localhost:5681/meshes/mesh-1/traffic-logs?offset=1"
}
```

### Delete Traffic Log
Request: `DELETE /meshes/{mesh}/traffic-logs/{name}`

Response: `200 OK`

Example:
```bash
curl -XDELETE http://localhost:5681/meshes/mesh-1/traffic-logs/tl-1
```

## Traffic Route

### Get Traffic Route
Request: `GET /meshes/{mesh}/traffic-routes/{name}`

Response: `200 OK` with Traffic Route entity

Example:
```bash
curl http://localhost:5681/meshes/mesh-1/traffic-routes/web-to-backend
```
```json
{
 "type": "TrafficRoute",
 "mesh": "mesh-1",
 "name": "web-to-backend",
 "creationTime": "2020-05-12T12:31:45.606217+02:00",
 "modificationTime": "2020-05-12T12:31:45.606217+02:00",
 "sources": [
  {
   "match": {
    "region": "us-east-1",
    "service": "web",
    "version": "v10"
   }
  }
 ],
 "destinations": [
  {
   "match": {
    "service": "backend"
   }
  }
 ],
 "conf": [
  {
   "weight": 90,
   "destination": {
    "region": "us-east-1",
    "service": "backend",
    "version": "v2"
   }
  },
  {
   "weight": 10,
   "destination": {
    "service": "backend",
    "version": "v3"
   }
  }
 ]
}
```

### Create/Update Traffic Route
Request: `PUT /meshes/{mesh}/traffic-routes/{name}` with Traffic Route entity in body

Response: `201 Created` when the resource is created and `200 OK` when it is updated

Example:
```bash
curl -XPUT http://localhost:5681/meshes/mesh-1/traffic-routes/web-to-backend --data @trafficroute.json -H'content-type: application/json'
```
```json
{
 "type": "TrafficRoute",
 "name": "web-to-backend",
 "mesh": "mesh-1",
 "sources": [
  {
   "match": {
    "region": "us-east-1",
    "service": "web",
    "version": "v10"
   }
  }
 ],
 "destinations": [
  {
   "match": {
    "service": "backend"
   }
  }
 ],
 "conf": [
  {
   "weight": 90,
   "destination": {
    "region": "us-east-1",
    "service": "backend",
    "version": "v2"
   }
  },
  {
   "weight": 10,
   "destination": {
    "service": "backend",
    "version": "v3"
   }
  }
 ]
}
```

### List Traffic Routes
Request: `GET /meshes/{mesh}/traffic-routes`

Response: `200 OK` with body of Traffic Route entities

Example:
```bash
curl http://localhost:5681/meshes/mesh-1/traffic-routes
```
```json
{
 "items": [
  {
   "type": "TrafficRoute",
   "mesh": "mesh-1",
   "name": "web-to-backend",
   "creationTime": "2020-05-12T12:31:45.606217+02:00",
   "modificationTime": "2020-05-12T12:31:45.606217+02:00",
   "sources": [
    {
     "match": {
      "region": "us-east-1",
      "service": "web",
      "version": "v10"
     }
    }
   ],
   "destinations": [
    {
     "match": {
      "service": "backend"
     }
    }
   ],
   "conf": [
    {
     "weight": 90,
     "destination": {
      "region": "us-east-1",
      "service": "backend",
      "version": "v2"
     }
    },
    {
     "weight": 10,
     "destination": {
      "service": "backend",
      "version": "v3"
     }
    }
   ]
  }
 ],
 "next": "http://localhost:5681/meshes/mesh-1/traffic-routes?offset=1"
}
```

### Delete Traffic Route
Request: `DELETE /meshes/{mesh}/traffic-routes/{name}`

Response: `200 OK`

Example:
```bash
curl -XDELETE http://localhost:5681/meshes/mesh-1/traffic-routes/web-to-backend
```

## Traffic Trace

### Get Traffic Trace
Request: `GET /meshes/{mesh}/traffic-traces/{name}`

Response: `200 OK` with Traffic Trace entity

Example:
```bash
curl http://localhost:5681/meshes/mesh-1/traffic-traces/tt-1
```
```json
{
 "type": "TrafficTrace",
 "mesh": "mesh-1",
 "name": "tt-1",
 "creationTime": "2020-05-12T12:31:45.606217+02:00",
 "modificationTime": "2020-05-12T12:31:45.606217+02:00",
 "conf": {
  "backend": "my-zipkin"
 },
 "selectors": [
  {
   "match": {
    "service": "*"
   }
  }
 ]
}
```

### Create/Update Traffic Trace
Request: `PUT /meshes/{mesh}/traffic-traces/{name}` with Traffic Trace entity in body

Response: `201 Created` when the resource is created and `200 OK` when it is updated

Example:
```bash
curl -XPUT http://localhost:5681/meshes/mesh-1/traffic-traces/tt-1 --data @traffictrace.json -H'content-type: application/json'
```
```json
{
 "type": "TrafficTrace",
 "mesh": "mesh-1",
 "name": "tt-1",
 "conf": {
  "backend": "my-zipkin"
 },
 "selectors": [
  {
   "match": {
    "service": "*"
   }
  }
 ]
}
```

### List Traffic Traces
Request: `GET /meshes/{mesh}/traffic-traces`

Response: `200 OK` with body of Traffic Trace entities

Example:
```bash
curl http://localhost:5681/meshes/mesh-1/traffic-traces
```
```json
{
 "items": [
  {
   "type": "TrafficTrace",
   "mesh": "mesh-1",
   "name": "tt-1",
   "creationTime": "2020-05-12T12:31:45.606217+02:00",
   "modificationTime": "2020-05-12T12:31:45.606217+02:00",
   "selectors": [
    {
     "match": {
      "service": "*"
     }
    }
   ],
   "conf": {
    "backend": "my-zipkin"
   }
  }
 ],
 "next": "http://localhost:5681/meshes/mesh-1/traffic-traces?offset=1"
}
```

### Delete Traffic Trace
Request: `DELETE /meshes/{mesh}/traffic-traces/{name}`

Response: `200 OK`

Example:
```bash
curl -XDELETE http://localhost:5681/meshes/mesh-1/traffic-traces/tt-1
```

## Fault Injection

### Get Fault Injection
Request: `GET /meshes/{mesh}/fault-injections/{name}`

Response: `200 OK` with Fault Injection entity

Example:
```bash
curl http://localhost:5681/meshes/default/fault-injections/fi1
```
```json
{
 "type": "FaultInjection",
 "mesh": "default",
 "name": "fi1",
 "creationTime": "2020-05-12T12:31:45.606217+02:00",
 "modificationTime": "2020-05-12T12:31:45.606217+02:00",
 "sources": [
  {
   "match": {
    "protocol": "http",
    "service": "frontend",
    "version": "0.1"
   }
  }
 ],
 "destinations": [
  {
   "match": {
    "protocol": "http",
    "service": "backend"
   }
  }
 ],
 "conf": {
  "delay": {
   "percentage": 50.5,
   "value": "5s"
  },
  "abort": {
   "percentage": 50,
   "httpStatus": 500
  },
  "responseBandwidth": {
   "percentage": 50,
   "limit": "50 mbps"
  }
 }
}
```

### Create/Update Fault Injection
Request: `PUT /meshes/{mesh}/fault-injections/{name}` with Fault Injection entity in body

Response: `201 Created` when the resource is created and `200 OK` when it is updated

Example:
```bash
curl -XPUT http://localhost:5681/meshes/default/fault-injections/fi1 --data @faultinjection.json -H'content-type: application/json'
```
```json
{
  "type": "FaultInjection",
  "mesh": "default",
  "name": "fi1",
  "sources": [
    {
      "match": {
        "service": "frontend",
        "version": "0.1",
        "protocol": "http"
      }
    }
  ],
  "destinations": [
    {
      "match": {
        "service": "backend",
        "protocol": "http"
      }
    }
  ],
  "conf": {
    "delay": {
      "percentage": 50.5,
      "value": "5s"
    },
    "abort": {
      "httpStatus": 500,
      "percentage": 50
    },
    "responseBandwidth": {
      "limit": "50 mbps",
      "percentage": 50
    }
  }
}
```

### List Fault Injections
Request: `GET /meshes/{mesh}/fault-injections`

Response: `200 OK` with body of Fault Injection entities

Example:
```bash
curl http://localhost:5681/meshes/default/fault-injections
```
```json
{
 "items": [
  {
   "type": "FaultInjection",
   "mesh": "default",
   "name": "fi1",
   "creationTime": "2020-05-12T12:31:45.606217+02:00",
   "modificationTime": "2020-05-12T12:31:45.606217+02:00",
   "sources": [
    {
     "match": {
      "protocol": "http",
      "service": "frontend",
      "version": "0.1"
     }
    }
   ],
   "destinations": [
    {
     "match": {
      "protocol": "http",
      "service": "backend"
     }
    }
   ],
   "conf": {
    "delay": {
     "percentage": 50.5,
     "value": "5s"
    },
    "abort": {
     "percentage": 50,
     "httpStatus": 500
    },
    "responseBandwidth": {
     "percentage": 50,
     "limit": "50 mbps"
    }
   }
  }
 ],
 "next": "http://localhost:5681/meshes/default/fault-injections?offset=1"
}
```

### Delete Fault Injection
Request: `DELETE /meshes/{mesh}/fault-injections/{name}`

Response: `200 OK`

Example:
```bash
curl -XDELETE http://localhost:5681/meshes/default/fault-injections/fi1
```

::: tip
The [`kumactl`](../kumactl) CLI under the hood makes HTTP requests to this API.
:::
