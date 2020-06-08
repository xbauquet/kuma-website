# Fault Injection

`FaultInjection` policy helps you to test your microservices against resiliency. Kuma provides 3 different types of failures that could be imitated in your environment. 
These faults are [Delay](#delay), [Abort](#abort) and [ResponseBandwidth](#responsebandwidth-limit) limit.

On Universal:

```yaml
type: FaultInjection
mesh: default
name: fi1
sources:
    - match:
        service: frontend
        version: "0.1"
        protocol: http
destinations:
    - match:
        service: backend
        protocol: http
conf:        
    abort:
        httpStatus: 500
        percentage: 50
    delay:
        percentage: 50.5
        value: 5s
    responseBandwidth:
        limit: 50 mbps
        percentage: 50    
```

On Kubernetes:

```yaml
apiVersion: kuma.io/v1alpha1
kind: FaultInjection
mesh: default
metadata:
  namespace: default
  name: fi1
spec:
    sources:
        - match:
            service: frontend
            version: "0.1"
            protocol: http
    destinations:
        - match:
            service: backend
            protocol: http
    conf:        
        abort:
            httpStatus: 500
            percentage: 50
        delay:
            percentage: 50.5
            value: 5s
        responseBandwidth:
            limit: 50 mbps
            percentage: 50 
```

### Sources & Destinations
`FaultInjection` is a policy, which is applied to the connection between dataplanes. As most of the policies, `FaultInjection` supports the powerful mechanism of matching, which allows you to precisely match source and destination dataplanes.

::: warning
`FaultInjection` policy available only for L7 HTTP traffic, `protocol: http` is mandatory tag both for source and destination selector.
:::

### HTTP Faults

At least one of the following Faults should be specified.
#### Abort

Abort defines a configuration of not delivering requests to destination service and replacing the responses from destination dataplane by
predefined status code.

- `httpStatus` -  HTTP status code which will be returned to source side
- `percentage` - percentage of requests on which abort will be injected, has to be in [0.0 - 100.0] range

#### Delay

Delay defines configuration of delaying a response from a destination.

- `value` - the duration during which the response will be delayed
- `percentage` - percentage of requests on which delay will be injected, has to be in [0.0 - 100.0] range

#### ResponseBandwidth limit

ResponseBandwidth defines a configuration to limit the speed of responding to the requests.

- `limit` - represented by value measure in gbps, mbps, kbps or bps, e.g. 10kbps
- `percentage` - percentage of requests on which response bandwidth limit will be injected, has to be in [0.0 - 100.0] range
