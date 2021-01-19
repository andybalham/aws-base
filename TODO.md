# TODO

Q. Do we need to put the Step Function in an asset bucket?

Q. What queries do we need to run against the files?
* List all results for a configuration, e.g. client
* For each result
    * description, e.g. Scenario: Two applicants, both employed, Product: Fixed 2yr 3%
    * scenario - loaded by lambda (https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-lambda-resolvers.html)
    * productSummary - this would be loaded by a lambda

Q. Should we just return the keys?

* TestResultTable

Q. What will we be querying via the AppSync API?
Q. What would we want instant feedback on?
* Results, but how would we refresh the results?
* We would want a subscription to a set of test results
* We would need to have a mutation to change the results
* Should be results be in DynamoDB?

## Document storage

* S3 should just contain content
* DynamoDB should contain the following:
DocumentIndex
```json
{
    "id": "string (Table PK)",
    "type": ["content", "link"], // Table SK
}
```
DocumentContentIndex
```json
{
    "contentType": ["configuration", "scenario", "etc"],
    "description": "string",
    "s3BucketName": "string (GSI PK)",
    "s3Key": "string (GSI SK)",
    "s3ETag": "string",
}
```
DocumentLinkIndex
```json
{
    "linkType": ["parent", "child"],
    "linkId": "string",
}
```

Q. What should we store for results? Just the maximumLoanAmount (for now)?


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

