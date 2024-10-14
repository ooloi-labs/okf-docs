# Api reference for GetData Endpoint:

## Overview

The `GET /api/discovery/getData` API endpoint retrieves discovery data based on specified configurations, including content types, filters, sorting options, and other parameters.

### Points to remember

- ContentTypes and ProfileTypes both should not be provided at the same time. Only one at a time.

- For countData queries, `useCountDAL` should be `true`.
- For aggregation queries, `useAggregation` should be `true`

- For simple queries, - `useCountDAL, useAggregation, searchTerm should be either falsy or undefined`
- For elastic search queries, `searchTerm should be truthy and useCountDAL should be falsy`

## Endpoint

GET https://okf-be-staging-dot-ok-framework.el.r.appspot.com/api/discovery/getData

## Request

### Request Headers

| Header         | Type   | Required | Description                                   |
| -------------- | ------ | -------- | --------------------------------------------- |
| `tenant`       | String | Yes      | Identifier for the tenant making the request. |
| `x-auth-token` | String | No       | The token for authenticating the request.     |

### Query Parameters

| Parameter Name | Type | Required | Description                                                                                                                                 |
| -------------- | ---- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `configs`      | JSON | Yes      | A JSON string containing various configuration options for the query, including content types, filters, sorting, population data, and more. |

### Configs Keys Description

| Header                             | Type    | Required | Description                                                                                                                                              |
| ---------------------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contentTypes`                     | Array   | Yes       | The types of content to be retrieved.                                                                                                                    |
| `profileTypes`                     | Array   | No       | The types of profiles to be retrieved.                                                                                                                   |
| `activeFilters`                    | Object  | No       | Active filters applied to the query.                                                                                                                     |
| `activeSort`                       | Object  | No       | Sorting options for the retrieved data.                                                                                                                  |
| `searchTerm`                       | String  | No       | The search term used to filter results.                                                                                                                  |
| `facet`                            | Object  | No       | Facet configuration for filtering data. Read more: https://www.mongodb.com/docs/v6.1/reference/operator/aggregation/facet/                               |
| `population`                       | Boolean | No       | Flag to indicate whether to populate related data.                                                                                                       |
| `projection`                       | Object  | No       | Specifies the fields to include or exclude from the result set.                                                                                          |
| `findQuery`                        | Object  | No       | The query object used to retrieve data.                                                                                                                  |
| `populateTaggedResources`          | Boolean | No       | Indicates whether to populate resources tagged in the response.                                                                                          |
| `lookupConfig`                     | Object  | No       | Configuration object for performing lookups on external resources. Read more: https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/ |
| `limit`                            | Number  | No       | The maximum number of records to retrieve.                                                                                                               |
| `skip`                             | Number  | No       | The number of records to skip before starting to retrieve results.                                                                                       |
| `countData`                        | Boolean | No       | Flag to indicate if the response should include the count of retrieved data.                                                                             |
| `ksConfig`                         | Object  | No       | Configuration settings related to keyword search.                                                                                                        |
| `combineFields`                    | Boolean | No       | Flag to combine multiple fields during the query.                                                                                                        |
| `taggedResourcesCount`             | Array   | No       | Indicates whether to count tagged resources in the response.                                                                                             |
| `taggedResourcesCount_unoptimized` | Array   | No       | Indicates whether to count tagged resources without optimization.                                                                                        |
| `useAggregation`                   | Boolean | No       | Specifies if aggregation queries should be used for counting.                                                                                            |
| `useCountDAL`                      | Boolean | No       | Indicates if a Data Access Layer should be used for counting.                                                                                            |
| `env`                              | String  | No       | Environment context for the request (e.g., "prod", "dev", "staging").                                                                                    |
| `pluginId`                         | String  | No       | Identifier for the plugin making the request.                                                                                                            |
| `activeLang`                       | String  | No       | Specifies the active language for the response.                                                                                                          |
| `countDataViaAggregate`            | Boolean | No       | Flag to indicate if the count should be done using an aggregate function.                                                                                |

# There are 4 types of data access methods:

## countdata (simply returns the count of documents)

This type of query is done to get the count of documents meeting specific conditions

### Query Parameters speciic to this

| Header                       | Type    | Required | Description                                                                                                                |
| ---------------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `useCountDal`                | Boolean | Yes      | A flag indicating whether to use useCountDal methods in the query. Its value will be `true` in this case.                  |
| `contentType / profileTypes` | Array   | Yes       | The type(s) of content or profiles to be retrieved, mutually exclusive.                                                    |
| `findQuery`                  | Object  | No       | The query object used to retrieve data.                                                                                    |
| `limit`                      | Number  | No       | The maximum number of records to retrieve.                                                                                 |
| `skip`                       | Number  | No       | The number of records to skip before starting to retrieve results.                                                         |
| `facet`                      | Object  | No       | Facet configuration for filtering data. Read more: https://www.mongodb.com/docs/v6.1/reference/operator/aggregation/facet/ |
| `env`                        | String  | No       | Environment context for the request (e.g., "prod", "dev", "staging").                                                      |

## findData (uses mongodb .find()) //projection

`useCountDAL, useAggregation, searchTerm should be either falsy or undefined`

### Query Parameters

| Header                       | Type    | Required | Description                                                                  |
| ---------------------------- | ------- | -------- | ---------------------------------------------------------------------------- |
| `contentType / profileTypes` | Array   | Yes       | The type(s) of content or profiles to be retrieved, mutually exclusive.      |
| `findQuery`                  | Object  | No       | The query object used to retrieve data.                                      |
| `activeSort`                 | Object  | No       | Sorting options for the retrieved data.                                      |
| `population`                 | Boolean | No       | Flag to indicate whether to populate related data.                           |
| `projection`                 | Object  | No       | Specifies the fields to include or exclude from the result set.              |
| `populateTaggedResources`    | Boolean | No       | Indicates whether to populate resources tagged in the response.              |
| `limit`                      | Number  | No       | The maximum number of records to retrieve.                                   |
| `skip`                       | Number  | No       | The number of records to skip before starting to retrieve results.           |
| `tenant`                     | String  | Yes      | Identifier for the tenant making the request.                                |
| `countData`                  | Boolean | No       | Flag to indicate if the response should include the count of retrieved data. |

## aggregateData (uses aggregation pipeline) //lookup

### Query Parameters

| Header                             | Type    | Required | Description                                                                                                                                              |
| ---------------------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useAggregation`                   | Boolean | Yes       | Specifies if aggregation queries should be used for counting.                                                                                            |
| `contentType / profileTypes`       | Array   | Yes       | The type(s) of content or profiles to be retrieved, mutually exclusive.                                                                                  |
| `findQuery`                        | Object  | No       | The query object used to retrieve data.                                                                                                                  |
| `activeSort`                       | Object  | No       | Sorting options for the retrieved data.                                                                                                                  |
| `facet`                            | Object  | No       | Facet configuration for filtering data. Read more: https://www.mongodb.com/docs/v6.1/reference/operator/aggregation/facet/                               |
| `projection`                       | Object  | No       | Specifies the fields to include or exclude from the result set.                                                                                          |
| `populateTaggedResources`          | Boolean | No       | Indicates whether to populate resources tagged in the response.                                                                                          |
| `lookupConfig`                     | Object  | No       | Configuration object for performing lookups on external resources. Read more: https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/ |
| `limit`                            | Number  | No       | The maximum number of records to retrieve.                                                                                                               |
| `skip`                             | Number  | No       | The number of records to skip before starting to retrieve results.                                                                                       |
| `tenant`                           | String  | Yes      | Identifier for the tenant making the request.                                                                                                            |
| `taggedResourcesCount`             | Array   | No       | Indicates whether to count tagged resources in the response.                                                                                             |
| `taggedResourcesCount_unoptimized` | Array   | No       | Indicates whether to count tagged resources without optimization.                                                                                        |
| `combineFields`                    | Boolean | No       | Flag to combine multiple fields during the query.                                                                                                        |
| `countData`                        | Boolean | No       | Flag to indicate if the response should include the count of retrieved data.                                                                             |
| `countDataViaAggregate`            | Boolean | No       | Flag to indicate if the count should be done using an aggregate function.                                                                                |

## elasticSearch

useCountDal should be false and searcg

| Header                                                    | Type    | Required | Description                                                                |
| --------------------------------------------------------- | ------- | -------- | -------------------------------------------------------------------------- |
| `contentType / profileTypes`                              | Array   | Yes       | The type(s) of content or profiles to be retrieved, mutually exclusive.    |
| `searchTerm`                                              | String  | Yes       | The search term used to filter results.                                    |
| `useCountDAL`                                             | Boolean | No       | Should be `false`.                                                         |
| `ksConfig`                                                | Object  | No       | Configuration settings related to keyword search.                          |
| `tenant`                                                  | String  | Yes      | Identifier for the tenant making the request.                              |
| `skip`                                                    | Number  | No       | The number of records to skip before starting to retrieve results.         |
| `limit`                                                   | Number  | No       | The maximum number of records to retrieve.                                 |
| `findQuery`                                               | Object  | No       | The query object used to retrieve data.                                    |
| `taggedResourcesCount / taggedResourcesCount_unoptimized` | Array   | No       | Indicates whether to count tagged resources, with or without optimization. |

# Sample Request

## countdata

```
curl 'https://okf-be-staging-dot-ok-framework.el.r.appspot.com/api/discovery/getData?configs=%7B%22contentTypes%22:\[%22newsReports%22,%22tenderDocuments%22,%22surveyReports%22,%22proceedings%22,%22caseReports%22,%22guidelines%22\],%22findQuery%22:%7B%22kp_published_status%22:%22published%22%7D,%22queryOptions%22:%7B%7D,%22useCountDAL%22:true,%22activeLang%22:%22en%22%7D' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'if-none-match: W/"59-adn5p9Ibizthsb5IsLwZzO88TUw"' \
  -H 'origin: https://ved-staging.ooloilabs.in' \
  -H 'priority: u=1, i' \
  -H 'referer: https://ved-staging.ooloilabs.in/' \
  -H 'sec-ch-ua: "Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: cross-site' \
  -H 'tenant: ved' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36' \
  -H 'x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoimRjZTlhMzAzMDgwZjU4ODM1In0sImlhdCI6MTcyNzkzODAwOCwiZXhwIjoxNzM2NTc4MDA4fQ.5Sqbmyi30cWLRwBfzUS7oF12i2BvNTwdY'
```

### Response

```
[
  {
    "count": 675
  },
  {
    "count": 123
  },
  {
    "count": 78
  },
  {
    "count": 4
  },
  {
    "count": 10
  },
  {
    "count": 46
  }
]

```

## findData

```

curl 'https://okf-be-staging-dot-ok-framework.el.r.appspot.com/api/discovery/getData?configs=%7B%22contentTypes%22:\[%22districts%22\],%22findQuery%22:%7B%22kp_published_status%22:%22published%22,%22$or%22:\[%7B%22taggedResources.caseReports.data.0%22:%7B%22$exists%22:true%7D%7D\],%22tags.states.data._id%22:%7B%22$in%22:\[%2263244f6d5e5676e7181365b5%22\]%7D%7D,%22queryOptions%22:%7B%22enabled%22:true%7D,%22activeLang%22:%22en%22%7D' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'if-none-match: W/"1cc4-zZw4W0n5Ltmc/5EXA0Bzw3pAMjs"' \
  -H 'origin: https://ved-staging.ooloilabs.in' \
  -H 'priority: u=1, i' \
  -H 'referer: https://ved-staging.ooloilabs.in/' \
  -H 'sec-ch-ua: "Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: cross-site' \
  -H 'tenant: ved' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36' \
  -H 'x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7dCI6MTcyNzkzODAwOCwiZXhwIjoxNzM2NTc4MDA4fQ.5SqbmyTwdY'

```

## useAggregation

```
curl 'https://okf-be-staging-dot-ok-framework.el.r.appspot.com/api/discovery/getData?configs=%7B%22contentTypes%22:\[%22caseReports%22\],%22activeFilters%22:\[\],%22activeSort%22:%7B%22kp_date_published%22:-1%7D,%22searchTerm%22:%22%22,%22population%22:\[%7B%22path%22:%22meta.kp_contributed_by%22,%22model%22:%22user%22,%22select%22:\[%22name%22,%22avatar%22\]%7D\],%22findQuery%22:%7B%22kp_published_status%22:%22published%22%7D,%22lookupConfig%22:\[%7B%22$lookup%22:%7B%22from%22:%22users%22,%22localField%22:%22meta.kp_contributed_by%22,%22foreignField%22:%22_id%22,%22as%22:%22meta.kp_contributed_by%22,%22pipeline%22:\[%7B%22$project%22:%7B%22name%22:1,%22avatar%22:1%7D%7D\]%7D%7D,%7B%22$unwind%22:%7B%22path%22:%22$meta.kp_contributed_by%22,%22preserveNullAndEmptyArrays%22:true%7D%7D\],%22ksConfig%22:%22%22,%22useAggregation%22:true,%22activeLang%22:%22en%22,%22skip%22:0%7D' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'if-none-match: W/"9b82-83J7ThxuRwwFnwsBy3w50JzhdoQ"' \
  -H 'origin: https://ved-staging.ooloilabs.in' \
  -H 'priority: u=1, i' \
  -H 'referer: https://ved-staging.ooloilabs.in/' \
  -H 'sec-ch-ua: "Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: cross-site' \
  -H 'tenant: ved' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36' \
  -H 'x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjZjZGEZjU4ODM1In0sImlhdCI6MTcyNzkzODAwOCwiZXhwIjoxNzM2NTc4MDA4fQ.5Sqbmyi9WRXJ16hQl30cWLRwBfzUS7BvNTwdY'

```

## elastic search

```
curl 'https://okf-be-staging-dot-ok-framework.el.r.appspot.com/api/discovery/getData?configs=%7B%22contentTypes%22:\[%22caseReports%22\],%22activeFilters%22:\[\],%22activeSort%22:%7B%22kp_date_published%22:-1%7D,%22searchTerm%22:%22dee%22,%22population%22:\[%7B%22path%22:%22meta.kp_contributed_by%22,%22model%22:%22user%22,%22select%22:\[%22name%22,%22avatar%22\]%7D\],%22findQuery%22:%7B%7D,%22lookupConfig%22:\[%7B%22$lookup%22:%7B%22from%22:%22users%22,%22localField%22:%22meta.kp_contributed_by%22,%22foreignField%22:%22_id%22,%22as%22:%22meta.kp_contributed_by%22,%22pipeline%22:\[%7B%22$project%22:%7B%22name%22:1,%22avatar%22:1%7D%7D\]%7D%7D,%7B%22$unwind%22:%7B%22path%22:%22$meta.kp_contributed_by%22,%22preserveNullAndEmptyArrays%22:true%7D%7D\],%22ksConfig%22:%7B%22query%22:%7B%22bool%22:%7B%22must%22:\[%7B%22multi_match%22:%7B%22fields%22:\[%22main.subtitle.autoComplete%22,%22main.title.autoComplete%22\],%22query%22:%22dee%22,%22analyzer%22:%22standard%22%7D%7D\],%22filter%22:\[\]%7D%7D,%22sort%22:\[%7B%22kp_date_published%22:%7B%22order%22:%22desc%22%7D%7D\]%7D,%22useAggregation%22:true,%22activeLang%22:%22en%22,%22skip%22:0%7D' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'origin: https://ved-staging.ooloilabs.in' \
  -H 'priority: u=1, i' \
  -H 'referer: https://ved-staging.ooloilabs.in/' \
  -H 'sec-ch-ua: "Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: cross-site' \
  -H 'tenant: ved' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36' \
  -H 'x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjZjZGE1ZmRjZTlhMzAzMDgwZjU4ODM1In0sImlhdCI6MTcyODY0MTQwMCwiZXhwIjoxNzM3MjgxNDAwfQ._pMZLXvqcJQb7R1u-UheGFZORe1ByBMfgBjUrK6lyb4'
```

<!--
## Response

| Parameter Name      | Type     | Description                                                                                                                                          |
|---------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `count`           | Number     |  The number of documents returned in the data or the size of data array       |
| `skip`           | Number     |  The skip amount for the number of documents, used in pagination requests.      |
| `data`           | JSON Array    |  A JSON Array containing containing the document object resulting from the request.       |


### Sample Response Object

```
{
  "comments": [],
  "kp_date_created": "2022-09-16T10:26:51.245Z",
  "kp_date_last_saved": "2024-01-10T05:31:20.729Z",
  "kp_date_published": "2024-01-10T05:31:20.729Z",
  "kp_published_status": "published",
  "lookup": {
    "newsReports": [
      {
        "_id": "666aa271ee3cad000bcd3c01"
      }
    ]
  },
  "main": {
    "title": "Andaman & Nicobar Island edit"
  },
  "meta": {
    "kp_contributed_by": "64a406ab8112a525b47c815e",
    "kp_content_type": "states"
  },
  "metadata": {
    "contentType": "states",
    "isContentType": "true",
    "segment": "collections"
  },
  "tagId": "andaman_nicobar_island",
  "taggedResources": {
    "surveyReports": {
      "collectionId": "surveyReports"
      // Additional fields...
    },
    "caseReports": {
      "collectionId": "caseReports"
      // Additional fields...
    }
    // Other resource types...
  },
  "taggedResourcesCount": {
    "newsReports": 1,
    "tenderDocuments": 0,
    "surveyReports": 2,
    "proceedings": 1,
    "caseReports": 7
  },
  "updates": [],
  "warnings": [],
  "__v": 0,
  "_id": "63244f6b5e5676e7181365ad"
}


``` -->
