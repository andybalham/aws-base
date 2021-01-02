# TODO

* Rather than have ApiVersion, perhaps have AppVersion? Or AssetVersion?

Q. What queries do we need to run against the files?
* Get all scenarios
* Get all products

* TestResultTable

Q. What will we be querying via the AppSync API?
Q. What would we want instant feedback on?
* Results, but how would we refresh the results?
* We would want a subscription to a set of test results
* We would need to have a mutation to change the results
* Should be results be in DynamoDB?

* AffordabilityApi
* AffordabilityApiFunction

## Next

* Have an S3-based configuration repository, /configuration/{stage}-Configuration.json

## Future

* Have an S3-based product repository, /product/{productId}-Product.json
* Store the calculation results and return an id to access them
* Implement a GET method to retrieve the calculation results

## Done

Q. How do we upload the scenarios and products?
A. API

* DocumentApi
* DocumentApiFunction
    * POST /document/{type}
    * POST /document/{type}/{id}
    * GET /document/{type}
    * GET /document/{type}/{id}

Thoughts on S3 structure:

* /configuration
    * configuration_{configurationId}.json
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

See: https://github.com/ai/nanoid/

How could we structure the documents?

Do we have a DocumentRepository?

```
{
    metadata: {
        id: "Client",
        type: "Configuration",
        description: "The client-specific configuration"
    },
    content: {

    }
}
```

