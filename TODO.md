# TODO

Thoughts on S3 structure:

* configuration_client.json
* /request
    * /{requestId}
        * request_{requestId}.json
        * response_{requestId}.json
        * audit_{requestId}.json
* /test
    * /scenario
        * /scenario_{scenarioId}.json
    * /product
        * /product_{productId}.json
    * /result
        * /result_{scenarioId}_{productId}.json

See: https://github.com/ai/nanoid/

How could we structure the documents?

```
{
    metadata: {
        type: "Product",
        name: "3.5x salary special",
        description: "A very special product that allows you to borrow 3.5 times your salary"
    },
    content: {

    }
}
```

## Next

* Have an S3-based configuration repository, /configuration/{stage}-Configuration.json

## Future

* Have an S3-based product repository, /product/{productId}-Product.json
* Store the calculation results and return an id to access them
* Implement a GET method to retrieve the calculation results

## Done