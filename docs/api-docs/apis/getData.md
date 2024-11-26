---
title: "Get Data & Filters"
---

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

GET https://okf-be-prod-dot-ok-framework.el.r.appspot.com/api/discovery/getData

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

| Header                    | Type           | Required | Description                                                                                                                                                                                                                                             |
| ------------------------- | -------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contentTypes`            | Array          | Yes      | The types of content to be retrieved.                                                                                                                                                                                                                   |
| `profileTypes`            | Array          | No       | The types of profiles to be retrieved.                                                                                                                                                                                                                  |
| `activeFilters`           | Object         | No       | Active filters applied to the query.                                                                                                                                                                                                                    |
| `activeSort`              | Object         | No       | Sorting options for the retrieved data. It is similar to mongodb sort. Read more: https://www.mongodb.com/docs/manual/reference/operator/aggregation/sort/                                                                                              |
| `searchTerm`              | String         | No       | The search term used to filter results.                                                                                                                                                                                                                 |
| `facet`                   | Object         | No       | Facet configuration for filtering data. Read more: https://www.mongodb.com/docs/v6.1/reference/operator/aggregation/facet/                                                                                                                              |
| `population`              | Object         | No       | It is similar to mongodb populate. Read more: https://mongoosejs.com/docs/populate.html data.                                                                                                                                                           |
| `projection`              | Object         | No       | Specifies the fields to include or exclude from the result set.                                                                                                                                                                                         |
| `findQuery`               | Object         | No       | The query object used to retrieve data.                                                                                                                                                                                                                 |
| `populateTaggedResources` | Boolean/Object | No       | Indicates whether to populate the \_ids within the taggedResources property                                                                                                                                                                             |
| `lookupConfig`            | Object         | No       | Configuration object for performing lookups on external resources. Read more: https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/                                                                                                |
| `limit`                   | Number         | No       | The maximum number of records to retrieve.                                                                                                                                                                                                              |
| `skip`                    | Number         | No       | The number of records to skip before starting to retrieve results.                                                                                                                                                                                      |
| `countData`               | Boolean        | No       | Flag to indicate if the response should include the count of retrieved data.                                                                                                                                                                            |
| `ksConfig`                | Object         | No       | Configuration settings related to keyword search.                                                                                                                                                                                                       |
| `combineFields`           | Boolean        | No       | Flag to combine multiple fields during the query.                                                                                                                                                                                                       |
| `taggedResourcesCount`    | Array          | No       | Indicates whether to count tagged resources in the response.                                                                                                                                                                                            |
| `useAggregation`          | Boolean/Object | No       | Specifies if aggregation queries should be used for counting.                                                                                                                                                                                           |
| `useCountDAL`             | Boolean        | No       | Indicates if a Data Access Layer should be used for counting.                                                                                                                                                                                           |
| `pluginId`                | String         | No       | If you choose to run a post processing on the data after it is retrieved from the DB, and a plugin for the same exists in the code, then you can use the plugId id property to run it.                                                                  |
| `activeLang`              | String         | No       | If autotranslate is enabled on this particular tenant, then you can use the activeLang property to fetch the data in that particular language. Node that, language codes should should be ISO 639, and it should be supported on this particular tenant |
| `countDataViaAggregate`   | Boolean        | No       | countDataViaAggregate works only if we ‘useAggregation’ is not false (i.e we are using the aggregation pipeline to fetch data). countDataViaAggregate will return the count of the response documents after applying the aggregation configs.           |

### Query Parameters for countdata

- `useCountDal`
- `contentType/profileTypes`
- `findQuery`
- `limit`
- `skip`
- `facet`

### Query Parameters for findData

- `contentType / profileTypes`
- `findQuery`
- `activeSort`
- `population`
- `projection`
- `populateTaggedResources`
- `limit`
- `skip`
- `countData`

### Query Parameters for aggregateData

- `useAggregation`
- `contentType / profileTypes`
- `findQuery`
- `activeSort`
- `facet`
- `projection`
- `populateTaggedResources`
- `lookupConfig`
- `limit`
- `skip`
- `taggedResourcesCount`
- `combineFields`
- `countData`
- `countDataViaAggregate`

## elasticSearch

- `contentType / profileTypes`
- `searchTerm`
- `useCountDAL`
- `ksConfig`
- `skip`
- `limit`
- `findQuery`
- `taggedResourcesCount`

# Sample Request

## countdata

```
configs: {"contentTypes":["newsReports","tenderDocuments","surveyReports","proceedings","caseReports","guidelines"],"findQuery":{"kp_published_status":"published"},"queryOptions":{},"useCountDAL":true,"activeLang":"en"}

fetch("https://okf-be-prod-dot-ok-framework.el.r.appspot.com/api/discovery/getData?configs=%7B%22contentTypes%22:[%22newsReports%22,%22tenderDocuments%22,%22surveyReports%22,%22proceedings%22,%22caseReports%22,%22guidelines%22],%22findQuery%22:%7B%22kp_published_status%22:%22published%22%7D,%22queryOptions%22:%7B%7D,%22useCountDAL%22:true,%22activeLang%22:%22en%22%7D", {
  "headers": {
    "tenant": "ved",
    "x-auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1lhMzAzMDgwZjU4ODM1In0sImlhdCI6MTcyODY0MTQwMCwiZXhwIjoxNzM3MjgxNDAwfQ._pMZLXvqcJQb7R1u-UheGFZORe1ByBMfgBjUrK6lyb4",
  },
  "method": "GET"
});

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
configs: {"contentTypes":["states"],"findQuery":{"kp_published_status":"published","$or":[{"taggedResources.newsReports.data.0":{"$exists":true}}]},"queryOptions":{"enabled":true},"activeLang":"en"}

fetch("https://okf-be-prod-dot-ok-framework.el.r.appspot.com/api/discovery/getData?configs=%7B%22contentTypes%22:[%22states%22],%22findQuery%22:%7B%22kp_published_status%22:%22published%22,%22$or%22:[%7B%22taggedResources.newsReports.data.0%22:%7B%22$exists%22:true%7D%7D]%7D,%22queryOptions%22:%7B%22enabled%22:true%7D,%22activeLang%22:%22en%22%7D", {
  "headers": {
    "tenant": "ved",
    "x-auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1TlhMzAzMDgwZjU4ODM1In0sImlhdCI6MTcyODY0MTQwMCwiZXhwIjoxNzM3MjgxNDAwfQ._pMZLXvqcJQb7R1u-UheGFZORe1ByBMfgBjUrK6lyb4",
  },
  "method": "GET"
});
```

## useAggregation

```
configs: {"contentTypes":["caseReports"],"activeFilters":[],"activeSort":{"kp_date_published":-1},"searchTerm":"","population":[{"path":"meta.kp_contributed_by","model":"user","select":["name","avatar"]}],"findQuery":{"kp_published_status":"published"},"lookupConfig":[{"$lookup":{"from":"users","localField":"meta.kp_contributed_by","foreignField":"_id","as":"meta.kp_contributed_by","pipeline":[{"$project":{"name":1,"avatar":1}}]}},{"$unwind":{"path":"$meta.kp_contributed_by","preserveNullAndEmptyArrays":true}}],"ksConfig":"","useAggregation":true,"activeLang":"en","skip":0}

fetch("https://okf-be-prod-dot-ok-framework.el.r.appspot.com/api/discovery/getData?configs=%7B%22contentTypes%22:[%22caseReports%22],%22activeFilters%22:[],%22activeSort%22:%7B%22kp_date_published%22:-1%7D,%22searchTerm%22:%22%22,%22population%22:[%7B%22path%22:%22meta.kp_contributed_by%22,%22model%22:%22user%22,%22select%22:[%22name%22,%22avatar%22]%7D],%22findQuery%22:%7B%22kp_published_status%22:%22published%22%7D,%22lookupConfig%22:[%7B%22$lookup%22:%7B%22from%22:%22users%22,%22localField%22:%22meta.kp_contributed_by%22,%22foreignField%22:%22_id%22,%22as%22:%22meta.kp_contributed_by%22,%22pipeline%22:[%7B%22$project%22:%7B%22name%22:1,%22avatar%22:1%7D%7D]%7D%7D,%7B%22$unwind%22:%7B%22path%22:%22$meta.kp_contributed_by%22,%22preserveNullAndEmptyArrays%22:true%7D%7D],%22ksConfig%22:%22%22,%22useAggregation%22:true,%22activeLang%22:%22en%22,%22skip%22:0%7D", {
  "headers": {
    "tenant": "ved",
    "x-auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1hMzAzMDgwZjU4ODM1In0sImlhdCI6MTcyODY0MTQwMCwiZXhwIjoxNzM3MjgxNDAwfQ._pMZLXvqcJQb7R1u-UheGFZORe1ByBMfgBjUrK6lyb4",
    },
  "method": "GET"
});

```

## elastic search

```
configs: {"contentTypes":["caseReports"],"activeFilters":[],"activeSort":{"kp_date_published":-1},"searchTerm":"patna","population":[{"path":"meta.kp_contributed_by","model":"user","select":["name","avatar"]}],"findQuery":{},"lookupConfig":[{"$lookup":{"from":"users","localField":"meta.kp_contributed_by","foreignField":"_id","as":"meta.kp_contributed_by","pipeline":[{"$project":{"name":1,"avatar":1}}]}},{"$unwind":{"path":"$meta.kp_contributed_by","preserveNullAndEmptyArrays":true}}],"ksConfig":{"query":{"bool":{"must":[{"multi_match":{"fields":["main.subtitle.autoComplete","main.title.autoComplete"],"query":"patna","analyzer":"standard"}}],"filter":[]}},"sort":[{"kp_date_published":{"order":"desc"}}]},"useAggregation":true,"activeLang":"en","skip":0}

fetch("https://okf-be-prod-dot-ok-framework.el.r.appspot.com/api/discovery/getData?configs=%7B%22contentTypes%22:[%22caseReports%22],%22activeFilters%22:[],%22activeSort%22:%7B%22kp_date_published%22:-1%7D,%22searchTerm%22:%22patna%22,%22population%22:[%7B%22path%22:%22meta.kp_contributed_by%22,%22model%22:%22user%22,%22select%22:[%22name%22,%22avatar%22]%7D],%22findQuery%22:%7B%7D,%22lookupConfig%22:[%7B%22$lookup%22:%7B%22from%22:%22users%22,%22localField%22:%22meta.kp_contributed_by%22,%22foreignField%22:%22_id%22,%22as%22:%22meta.kp_contributed_by%22,%22pipeline%22:[%7B%22$project%22:%7B%22name%22:1,%22avatar%22:1%7D%7D]%7D%7D,%7B%22$unwind%22:%7B%22path%22:%22$meta.kp_contributed_by%22,%22preserveNullAndEmptyArrays%22:true%7D%7D],%22ksConfig%22:%7B%22query%22:%7B%22bool%22:%7B%22must%22:[%7B%22multi_match%22:%7B%22fields%22:[%22main.subtitle.autoComplete%22,%22main.title.autoComplete%22],%22query%22:%22patna%22,%22analyzer%22:%22standard%22%7D%7D],%22filter%22:[]%7D%7D,%22sort%22:[%7B%22kp_date_published%22:%7B%22order%22:%22desc%22%7D%7D]%7D,%22useAggregation%22:true,%22activeLang%22:%22en%22,%22skip%22:0%7D", {
  "headers": {
    "tenant": "ved",
    "x-auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJgwZjU4ODM1In0sImlhdCI6MTcyODY0MTQwMCwiZXhwIjoxNzM3MjgxNDAwfQ._pMZLXvqcJQb7R1u-UheGFZORe1ByBMfgBjUrK6lyb4",
  },
  "method": "GET"
});
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
