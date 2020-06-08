# Docker

To install and run Kuma on Docker execute the following steps:

* [1. Download Kuma](#_1-download-kuma)
* [2. Run Kuma](#_2-run-kuma)
* [3. Use Kuma](#_3-use-kuma)

::: tip
The official Docker images are used by default in the [Kubernetes](/docs/0.5.1/installation/kubernetes/) and [OpenShift](/docs/0.5.1/installation/openshift/) distributions.
:::

### 1. Download Kuma

Kuma provides the following Docker images for all of its executables:

* **kuma-cp**: at `kong-docker-kuma-docker.bintray.io/kuma-cp:0.5.1`
* **kuma-dp**: at `kong-docker-kuma-docker.bintray.io/kuma-dp:0.5.1`
* **kumactl**: at `kong-docker-kuma-docker.bintray.io/kumactl:0.5.1`
* **kuma-prometheus-sd**: at `kong-docker-kuma-docker.bintray.io/kuma-prometheus-sd:0.5.1`

You can freely `docker pull` these images to start using Kuma, as we will demonstrate in the following steps.

### 2. Run Kuma

We can proceed to run Kuma with:

```sh
$ docker run \
    -p 5681:5681 \
    -p 5683:5683 \
    kong-docker-kuma-docker.bintray.io/kuma-cp:0.5.1 run
```

::: tip
**Note**: By default this will run Kuma with a `memory` [backend](../../documentation/backends), but you can use a persistent storage like PostgreSQL by updating the `conf/kuma-cp.conf` file.
:::

### 3. Use Kuma

Kuma (`kuma-cp`) is now running! Now that Kuma has been installed you can access the control-plane via either the GUI, the HTTP API, or the CLI:

:::: tabs :options="{ useUrlFragment: false }"
::: tab "GUI (Read-Only)"

Kuma ships with a **read-only** GUI that you can use to retrieve Kuma resources. By default the GUI listens on port `5683`. 

To access Kuma you can navigate to [`127.0.0.1:5683`](http://127.0.0.1:5683) to see the GUI.

:::
::: tab "HTTP API (Read & Write)"

Kuma ships with a **read and write** HTTP API that you can use to perform operations on Kuma resources. By default the HTTP API listens on port `5681`.

To access Kuma you can navigate to [`127.0.0.1:5681`](http://127.0.0.1:5681) to see the HTTP API.

:::
::: tab "kumactl (Read & Write)"

You can use the `kumactl` CLI to perform **read and write** operations on Kuma resources. The `kumactl` binary is a client to the Kuma HTTP API. For example:

```sh
$ docker run \
    --net="host" \
    kong-docker-kuma-docker.bintray.io/kumactl:0.5.1 kumactl get meshes
NAME          mTLS      METRICS      LOGGING   TRACING
default       off       off          off       off
```

or you can enable mTLS on the `default` Mesh with:

```sh
echo "type: Mesh
name: default
mtls:
  enabledBackend: ca-1
  backends:
  - name: ca-1
    type: builtin" | docker run -i --net="host" \
  kong-docker-kuma-docker.bintray.io/kumactl:0.5.1 kumactl apply -f -
```

**Note**: we are running `kumactl` from the Docker container on the same network as the `host`, but most likely you want to download a compatible version of Kuma for the machine where you will be executing the commands.

You can run the following script to automatically detect the operating system and download Kuma:

```sh
$ curl -L https://kuma.io/installer.sh | sh -
```

or you can download the distribution manually:

* [CentOS](https://kong.bintray.com/kuma/kuma-0.5.1-centos-amd64.tar.gz)
* [RedHat](https://kong.bintray.com/kuma/kuma-0.5.1-rhel-amd64.tar.gz)
* [Debian](https://kong.bintray.com/kuma/kuma-0.5.1-debian-amd64.tar.gz)
* [Ubuntu](https://kong.bintray.com/kuma/kuma-0.5.1-ubuntu-amd64.tar.gz)
* [macOS](https://kong.bintray.com/kuma/kuma-0.5.1-darwin-amd64.tar.gz)

and extract the archive with:

```sh
$ tar xvzf kuma-0.5.1*.tar.gz
```

You will then find the `kumactl` executable in the `kuma-0.5.1/bin` folder.

:::
::::

You will notice that Kuma automatically creates a [`Mesh`](../../policies/mesh) entity with name `default`.

### 4. Quickstart

Congratulations! You have successfully installed Kuma on Docker 🚀. 

In order to start using Kuma, it's time to check out the [quickstart guide for Universal](/docs/0.5.1/quickstart/universal/) deployments. If you are using Docker you may also be interested in checking out the [Kubernetes quickstart](/docs/0.5.1/quickstart/kubernetes/) as well.
