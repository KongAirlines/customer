## Customer Information API

Provides the KongAir customer information service including
payment methods, contact info, frequent flyer, etc...

The API specification can be found in the [openapi.yaml](openapi.yaml) file.

Customers are identified by the `x-consumer-username` header. This username is how the service segments customer information.

**This is an example service only. Proper security measures should be followed in production use cases.**

As of now, this example server does not provide a way to update customer
information, only to retrieve it with a `GET` request. The server loads
example customer information from the [customer.json](customer.json) file.

### Security

See [Security](SECURITY.md) for information on how to report security vulnerabilities.


### Prerequisites

* `node` : tested with `v22.13.0`
* `npm`  : tested with `10.9.2`

### Server usage

To install dependencies:
```
npm install
```

The repository provides a `Makefile` with common usage.

#### To run unit tests

```
make test
```

#### To run the server on the default port

```
make run
```

For the run command, the default port is read from the `KONG_AIR_CUSTOMER_PORT`
env var which is loaded via the parent [base.mk](../../base.mk) file.

#### To run a development server

A development server will detect and autoloads code changes.

```
npm run dev
```

### Example client requests

Read all customer information for the user `dfreese`:
```
curl -s localhost:3000/customer -H "x-consumer-username: dfreese"
```

## Konnect Reference Platform

This repository owns the Customer Information API contract and its federated
Konnect desired state. It is a protected-API example for the
[Konnect Reference Platform](https://developer.konghq.com/konnect-reference-platform/).

- [`konnect/dev.yaml`](konnect/dev.yaml) owns the private development Catalog
  API and applies this service's Gateway state to `customer-data-dev`.
- [`konnect/prod.yaml`](konnect/prod.yaml) owns the public production Catalog
  API. Production Gateway state is promoted to the
  [platform repository](https://github.com/KongAirlines/platform) for review.
- [`gateway/plugins/ace.yaml`](gateway/plugins/ace.yaml) installs service-scoped
  Access Control Enforcement with `match_policy: required`.
- [`openapi/versions/`](openapi/versions/) retains production release
  specifications while the root `openapi.yaml` remains mutable for development.

Install decK 1.65.2 and run `./scripts/generate-gateway.sh` after changing an
OpenAPI document or Gateway plugin input. Commit the generated development and
production files. CI regenerates them and rejects drift.

The kongctl manifests intentionally exercise control-plane API implementations
and external auth-strategy lookup. They require the corresponding federated
declarative support in kongctl, including
[Kong/kongctl#1992](https://github.com/Kong/kongctl/pull/1992).
