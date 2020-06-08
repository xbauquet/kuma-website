# CentOS

To install and run Kuma on CentOS (**x86_64**) execute the following steps:

### 1. Download and run Kuma

You can download Kuma from [here](https://kong.bintray.com/kuma/kuma-0.4.0-centos-amd64.tar.gz) or by running:

```sh
$ wget https://kong.bintray.com/kuma/kuma-0.4.0-centos-amd64.tar.gz
```

You can extract the archive and check the contents of the `bin` folder by running:

```sh
$ tar xvzf kuma-0.4.0-centos-amd64.tar.gz
$ cd bin/ && ls
envoy   kuma-dp   kuma-tcp-echo   kuma-cp   kuma-prometheus-sd   kumactl
```

As you can see Kuma already ships with an [envoy](http://envoyproxy.io) executable ready to use.

To run Kuma execute:

```sh
$ ./kuma-cp run
```

Kuma automatically creates a [`Mesh`](../../policies/mesh) entity with name `default`. 

By default this will run Kuma with a `memory` [backend](../../documentation/backends), but you can change this to use PostgreSQL by updating the `conf/kuma-cp.conf` file.

### 2. Start the Data-Plane

::: tip
Before starting the sidecar proxy data-plane, the service should **already** be running. For demo purposes, we can start a sample TCP server that comes bundled with Kuma and that echoes back the requests we are sending to it:

```sh
$ ./kuma-tcp-echo -port 9000
```

You can then consume the service by making requests to `127.0.0.1:9000`, like: `curl http://127.0.0.1:9000/` or `nc 127.0.0.1 9000`
:::

We now have our control-plane and services running. For each service we can now provision a [`Dataplane Entity`](../documentation/dps-and-data-model/#dataplane-entity) that configures the inbound and outbound networking configuration:

```sh
$ echo "type: Dataplane
mesh: default
name: dp-echo-1
networking:
  address: 127.0.0.1
  inbound:
  - port: 10000
    servicePort: 9000
    tags:
      service: echo" | ./kumactl apply -f -
```

Next, generate a data-plane token that is used by the control-plane to verify identity of the data-plane:
```sh
$ ./kumactl generate dataplane-token --dataplane=dp-echo-1 > /tmp/kuma-dp-echo-1
```

And run the actual data-plane process with:

```sh
$ ./kuma-dp run \
  --name=dp-echo-1 \
  --mesh=default \
  --cp-address=http://127.0.0.1:5681 \
  --dataplane-token-file=/tmp/kuma-dp-echo-1
```

You can now consume the service on port `10000`, which will be internally redirected to the service on port `9000`:

```sh
$ curl http://127.0.0.1:10000
GET / HTTP/1.1
Host: 127.0.0.1:10000
User-Agent: curl/7.54.0
Accept: */*
```

### 3. Apply Policies

Now you can start applying [Policies](../../policies/introduction) to your `default` Service Mesh, like [Mutual TLS](../../policies/mutual-tls):

```sh
$ echo "type: Mesh
name: default
mtls:
  enabled: true 
  ca:
    builtin: {}" | ./kumactl apply -f -
```

With mTLS enabled, all traffic is restricted by default unless we specify a [Traffic Permission](../../policies/traffic-permissions) policy that enables it again. For example, we can apply the following permissive policy to enable all traffic across every data-plane again:

```sh
$ echo "type: TrafficPermission
name: enable-all-traffic
mesh: default
sources:
  - match:
      service: '*'
destinations:
  - match:
      service: '*'" | ./kumactl apply -f -
```

### 4. Done!

::: tip
You can configure `kumactl` to point to any remote `kuma-cp` instance by running:

```sh
$ kumactl config control-planes add --name=XYZ --address=http://address.to.kuma:5681
```
:::

If you consume the service again on port `10000`, you will now notice that the communication requires now a TLS connection.

You can now review the entities created by Kuma by using the [`kumactl`](../../documentation/kumactl) CLI. For example you can list the Meshes and the Traffic Permissions:

```sh
$ ./kumactl get meshes
NAME      mTLS   CA        METRICS
default   on     builtin   off

$ ./kumactl get traffic-permissions
MESH      NAME
default   enable-all-traffic
```

and you can list the data-planes that have been registered, and their status:

```sh
$ ./kumactl get dataplanes
MESH      NAME        TAGS
default   dp-echo-1   service=echo

$ ./kumactl inspect dataplanes
MESH      NAME        TAGS              STATUS   LAST CONNECTED AGO   LAST UPDATED AGO   TOTAL UPDATES   TOTAL ERRORS
default   dp-echo-1   service=echo      Online   19s                  18s                2               0
```
