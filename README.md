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
- The root [`openapi.yaml`](openapi.yaml) is the next beta contract, while
  [`openapi/versions/`](openapi/versions/) retains immutable stable releases.

Install decK 1.65.2 and run `./scripts/generate-gateway.sh` after changing an
OpenAPI document or Gateway plugin input. Commit the generated development and
production files. CI regenerates them and rejects drift.

The kongctl manifests use control-plane API implementations and external
auth-strategy lookup. Use kongctl 1.14.0 or later when applying them.

### Development and releases

Normal service PRs edit the beta version in the root `openapi.yaml`. The API's
top-level `version` in `konnect/prod.yaml` selects the stable specification
used for production Catalog and Gateway state; generation scripts read that
selector, so they never need a release-specific edit.

To release the current beta, run the **Prepare API release** workflow with the
stable release version and the next development version. For example, releasing
`0.2.0-beta.N` with inputs `0.2.0` and `0.3.0` opens a service PR that:

1. Retains `openapi/versions/0.2.0.yaml` as an immutable stable contract.
2. Sets `konnect/prod.yaml` current version to `0.2.0` while retaining older
   versions.
3. Advances the root contract to `0.3.0-beta.1`.
4. Regenerates the development and production Gateway artifacts.

Merging that service PR applies the next beta to development and starts the
existing governed production promotion. The trusted
`PLATFORM_PROMOTION_TOKEN` must be able to push a release branch and open a PR
in this service repository so normal pull-request validation runs.
