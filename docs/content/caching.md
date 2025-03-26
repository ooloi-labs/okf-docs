---
title: "Caching"
description: "Description goes here"
sidebar_position: 8
---


# Redis Caching for Tpls and PlatformConfigs

This module provides a Redis-based caching layer for MongoDB collections. It optimizes database access by storing frequently accessed documents in Redis and implementing MongoDB-like query capabilities against the cache.

## Exported Functions

### 1. `connectRedis()`
Establishes a connection to Redis and initializes the cache by loading data from MongoDB collections by using loadCollectionsToCache function.

### 2. `findInCache({ tenant, modelName, type, query })`
Retrieves documents from Redis cache based on MongoDB-like query parameters. Falls back to MongoDB if data isn't cached.

### 3. `loadCollectionsToCache()`
Populates the Redis cache with data from configured MongoDB collections for all tenants.

### 4. `setInCache({ tenant, modelName, type, val })`
Stores a document in the Redis cache with the appropriate key.

### 5. `invalidateCache({ tenant, modelName, type, newVal })`
Removes a document from cache and replaces it with a new value if provided.

## Key Structure

Redis keys are structured as follows:

```
{environment}:{tenant}:{modelName}:{type}
```

Where:
- `environment`: The current environment (development, staging, production)
- `tenant`: The tenant identifier (e.g., "gelabs")
- `modelName`: The MongoDB collection name (e.g., "tpl")
- `type`: The document type, determined by the `typeKey` field in the collection configuration. The  `typeKey` for `tpl` is `kp_content_type` and for `platformConfigs` it is `type`

This hierarchical key structure enables efficient organization and retrieval of cached data across multiple environments, tenants, and collections.

## Detailed Function Analysis

### `findInCache` Function

The `findInCache` function retrieves documents from Redis cache based on MongoDB-like queries:

1. **Key Generation**:
   - Constructs a key prefix based on environment, tenant, and model name
   - Uses wildcard matching (`*`) when type is not specified to retrieve all documents of a model

2. **Cache Miss Handling**:
   - If no keys match the prefix, it's considered a cache miss
   - The function falls back to MongoDB, retrieving data using the provided query
   - For specific tenants (those in `listOfAllTenants`), it populates the cache with the retrieved data

3. **Document Retrieval**:
   - For cache hits, fetches all matching documents from Redis
   - Parses the JSON string values back into JavaScript objects

4. **Query Filtering**:
   - If no query is provided, returns all fetched documents
   - Otherwise, filters documents using the `matchesQuery` helper function
   - Supports MongoDB-like query operators (`$ne`, `$in`) and nested property paths

5. **Error Handling**:
   - Catches and logs errors, rethrowing them to the caller

The function provides a seamless interface that transparently handles cache misses, making the caching layer mostly invisible to application code.


### invalidateCache Function

The `invalidateCache` function manages cache consistency when documents are modified:

```javascript
invalidateCache({ tenant, modelName, type, newVal })
```

#### Process Flow:

1. **Key Determination**:
   - Generates the Redis key for the specific document using tenant, modelName, and type

2. **Cache Deletion**:
   - Removes the existing document from the cache using the `clearAsync` function

3. **Optional Update**:
   - If `newVal` is provided, attempts to store the updated document in the cache
   - Error handling ensures that cache update failures are logged but don't interrupt the process

#### Note:
  According to the current usecases this function is called only after a database operation.
  We should include this function call within the MongoDB transaction.
  Otherwise, if the database operation succeeds but cache deletion fails, the cache will hold the outdated data.

This approach implements a "write-through" cache pattern, where writes go to both the database and cache, helping maintain cache coherence in a distributed system.


