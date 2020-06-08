# Amazon Linux

:::tip
If you wish to use Kuma on Amazon EKS please follow the [Kubernetes instructions](/docs/0.5.0/installation/kubernetes/) instead.
:::

To install and run Kuma on Amazon Linux (**x86_64**) execute the following steps:

* [1. Download Kuma](#_1-download-kuma)
* [2. Run Kuma](#_2-run-kuma)
* [3. Use Kuma](#_3-use-kuma)

Finally you can follow the [Quickstart](#_4-quickstart) to take it from here and continue your Kuma journey.

### 1. Download Kuma

Run the following script to automatically detect the operating system and download Kuma:

```sh
$ yum install -y tar gzip
$ curl -L https://kuma.io/installer.sh | sh -
```

or you can [download](https://kong.bintray.com/kuma/kuma-0.5.0-centos-amd64.tar.gz) the distribution manually.

Then extract the archive with:

```sh
$ tar xvzf kuma-0.5.0*.tar.gz
```

### 2. Run Kuma

Once downloaded, you will find the contents of Kuma in the `kuma-0.5.0` folder. In this folder, you will find - among other files - the `bin` directory that stores all the executables for Kuma. 

So we enter the `bin` folder by executing:

```sh
$ cd kuma-0.5.0/bin
```

And we can then proceed to run Kuma with:

```sh
$ ./kuma-cp run
```

We suggest adding the `kumactl` executable to your `PATH` so that it's always available in every working directory. Or - alternatively - you can also create link in `/usr/local/bin/` by executing:

```sh
ln -s ./kumactl /usr/local/bin/kumactl
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
$ kumactl get meshes
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
    type: builtin" | kumactl apply -f -
```

You can configure `kumactl` to point to any remote `kuma-cp` instance by running:

```sh
$ kumactl config control-planes add --name=XYZ --address=http://{address-to-kuma}:5681
```
:::
::::

You will notice that Kuma automatically creates a [`Mesh`](../../policies/mesh) entity with name `default`.

### 4. Quickstart

Congratulations! You have successfully installed Kuma on Amazon Linux 🚀. 

In order to start using Kuma, it's time to check out the [quickstart guide for Universal](/docs/0.5.0/quickstart/universal/) deployments.
