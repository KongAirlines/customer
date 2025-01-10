## Customer Information API

Provides the KongAir customer information service including
payment methods, contact info, frequent flyer, etc...

The API specification can be found in the [openapi.yaml](openapi.yaml) file.

Customers are identified by the `x-consumer-username` header. This username is how the service segments customer information.

**This is an example service only. Proper security measures should be followed in production use cases.**

As of now, this example server does not provide a way to update customer
information, only to retrieve it with a `GET` request. The server loads
example customer information from the [customer.json](customer.json) file.

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
