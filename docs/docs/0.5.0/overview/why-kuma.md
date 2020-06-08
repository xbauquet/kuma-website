---
title: Why Kuma?
---

# Why Kuma?

When building any modern digital application, we will inevitably introduce services that will communicate with each other by making requests on the network. 

<center>
<img src="/images/docs/diagram-before-after-full.png" alt="" style="padding-top: 20px; padding-bottom: 10px;"/>
</center>

For example, think of any application that communicates with a database to store or retrieve data, or think of a more complex microservice-oriented application that makes many requests across different services to execute its operations:

<center>
<img src="/images/docs/0.5.0/diagram-02.jpg" alt="" style="width: 550px; padding-top: 20px; padding-bottom: 10px;"/>
</center>

Every time our services communicate over the network, we put the end-user experience at risk. As we all know the network between different services can be slow and unpredictable. It can be insecure, hard to trace, and pose many other problems (e.g., routing, versioning, canary deployments). In one sentence, our applications are one step away from being unreliable.

Usually, at this point, developers take one of the following actions to remedy the situation:

* **Write more code**: Developers write code - sometimes in the form of a *smart* client - that every service will have to utilize when making requests to another service. Usually, this approach introduces a few problems: 
  - It creates more technical debt
  - It is typically language-specific; therefore, it prevents innovation 
  - Multiple implementations of the library exist, which creates fragmentation in the long run.

* **Sidecar proxy**: The services delegate all the connectivity and observability concerns to an out-of-process runtime, that will be on the execution path of every request. It will proxy all the outgoing connections and accept all the incoming ones. And of course it will execute traffic policies at runtime, like routing or logging. By using this approach, developers don't have to worry about connectivity and focus entirely on their services and applications.

::: tip
**Sidecar Proxy**: It's called *sidecar* proxy because the proxy it's another process running alongside our service process on the same underlying host. There is going to be one instance of a sidecar proxy for each running instance of our services, and because all the incoming and outgoing requests - and their data - always go through the sidecar proxy, it is also called a data-plane (DP) since it sits on the data path.
:::

Since we are going to be having many instances for our services, we are also going to be having an equal number of sidecar proxies: that's a lot of proxies! Therefore the sidecar proxy model **requires** a control plane that allows a team to configure the behavior of the proxies dynamically without having to manually configure them. The data planes will initiate a connection with the control plane in order to receive new configuration, while the control plane will - at runtime - provide them with the most updated configuration.

Teams that adopt the sidecar proxy model will either build a control plane from scratch or use existing general-purpose control planes available on the market, such as Kuma. [Compare Kuma with other CPs](../kuma-vs-xyz).

Unlike a data-plane proxy (DP), the control-plane (CP) is never on the execution path of the requests that the services exchange with each other, and it's being used as a source of truth to dynamically configure the underlying data-plane proxies that in the meanwhile ha.

<center>
<img src="/images/docs/0.5.0/diagram-03.jpg" alt="" style="width: 550px; padding-top: 20px; padding-bottom: 10px;"/>
</center>

::: tip
**Service Mesh**: An architecture made of sidecar proxies deployed next to our services (the data-planes, or DPs), and a control plane (CP) controlling those DPs, is called Service Mesh. Usually, Service Mesh appears in the context of Kubernetes, but anybody can build Service Meshes on any platform (including VMs and Bare Metal).
:::

With Kuma, our main goal is to reduce the code that has to be written and maintained to build reliable architectures. Therefore, Kuma embraces the sidecar proxy model by leveraging Envoy as its sidecar data-plane technology.

By outsourcing all the connectivity, security, and routing concerns to a sidecar proxy, we benefit from our enhanced ability to: 
- build applications faster
- focus on the core functionality of our services to drive more business
- build a more secure and standardized architecture by reducing fragmentation

By reducing the code that our teams create and maintain, we can modernize our applications piece by piece without ever needing to bite more than we can chew.

<center>
<img src="/images/docs/0.5.0/diagram-04.jpg" alt="" style=" padding-top: 20px; padding-bottom: 10px;"/>
</center>

[Learn more](../enabling-modernization) about how Kuma enables modernization within our existing architectures.