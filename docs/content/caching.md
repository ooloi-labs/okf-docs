---
title: "Caching"
description: "Description goes here"
sidebar_position: 8
---

# MongoDB Caching Architecture
## A Strategic Approach to Performance Optimization

---

## Architecture Overview

```mermaid
flowchart TD
    A[Application] --> B[CacheService]
    B --> C[Cache Store]
    B --> D[MongoDB]
    C -->|Redis| E[Remote Cache]
    
    
    style B fill:#f9f,stroke:#333,stroke-width:2px
    style C fill:#bbf,stroke:#333,stroke-width:2px
    style D fill:#bfb,stroke:#333,stroke-width:2px
```

---

## Configuration Process

```mermaid
flowchart TD
    A[Initialize CacheService] --> E[Register Collections]
    E --> F[Configure Strategy]
    E --> G[Set TTL]
    E --> H[Define Key Generator]
    E --> I[Specify Operations]
    A --> J[Setup Auto-Invalidation]
    A --> K[Apply to Models]
```

---

## Read Operation: Cache-First Strategy

```mermaid
flowchart TD
    A[Query Request] --> B{Check Cache}
    B -->|Cache Hit| C[Return Cached Data]
    B -->|Cache Miss| D[Query Database]
    D --> E[Store in Cache]
    E --> F[Return Fresh Data]
```

---

## Read Operation: Network-First Strategy

```mermaid
flowchart TD
    A[Query Request] --> B[Query Database]
    B -->|Success| C[Store in Cache]
    C --> E[Return Fresh Data]
```

---

## Read Operation: Stale-While-Revalidate

```mermaid
flowchart TD
    A[Query Request] --> B{Check Cache}
    B -->|Cache Hit| C[Return Cached Data]
    B -->|Cache Miss| D[Wait for Database]
    C --> E[Refresh in Background]
    D --> F[Query Database]
    F --> G[Store in Cache]
    F --> H[Return Fresh Data]
```

---

## Write Operations Flow

```mermaid
flowchart TD
    A[Write Operation] --> B[Execute on Database]
    B --> C{Operation Type}
    C -->|Create| D[Post-save Hook]
    C -->|Update| E[Post-update Hook]
    C -->|Delete| F[Post-delete Hook]
    D --> G[Invalidate Collection Cache]
    E --> H[Invalidate Collection Cache]
    F --> I[Invalidate Collection Cache]
    A -->|Bulk Operations| J[Manual Invalidation]
```

---

## Cache Invalidation Process

```mermaid
flowchart TD
    A[Invalidation Request] --> B{Scope}
    B -->|Specific Query| C[Generate Query Hash]
    B -->|Entire Collection| D[Generate Collection Pattern]
    C --> E{Cache Type}
    D --> E
    E -->|Redis| F[Get Matching Keys]
    F --> H[Delete Keys]
```

---

## CRUD Operations + Cache Matrix

```mermaid
flowchart TD
    A[Operation] --> B{Operation Type}
    B -->|Create| C[Execute DB → Invalidate Cache]
    B -->|Read| D{Cache Strategy}
    B -->|Update| E[Execute DB → Invalidate Cache]
    B -->|Delete| F[Execute DB → Invalidate Cache]
    
    D -->|Cache First| G[Check Cache → DB Fallback]
    D -->|Network First| H[Try DB → Cache Fallback]
    D -->|Stale-While-Revalidate| I[Return Cache → Refresh Background]
```

---

## Implementation Steps

```mermaid
flowchart TD
    A[1. Initialize CacheService] --> B[2. Register Collections]
    B --> C[3. Setup Auto-Invalidation]
    C --> D[4. Apply Caching to Models]
    D --> E[5. Use Models Normally]
    E --> F[6. Manual Invalidation When Needed]
```


# Cache Architecture for CRUD Operations

| Operation Phase | Create (C) | Read (R) | Update (U) | Delete (D) |
|----------------|------------|----------|------------|------------|
| **Cache Check** | ✗ | ✓ | ✗ | ✗ |
| **Execute Database Operation** | ✓ | ✗ OR ✓ | ✓ | ✓ |
| **Cache Update** | ✗  | ✗ OR ✓ | ✗ | ✗ |
| **Cache Invalidation** | ✓ | ✗ | ✓ | ✓ |
| **Strategy Application** | ✗ | ✓ | ✗ | ✗ |
| **Background Refresh** (stale-while-revalidate) | ✗ | ✓ | ✗ | ✗ |
| **Auto-Invalidation via Middleware** | ✓ | ✗ | ✓ | ✓ |
| **Manual Invalidation Support** | ✓ | ✗ | ✓ | ✓ |
| **Collection-Level Invalidation** | ✓ | ✗ | ✓ | ✓ |
| **Query-Specific Invalidation** | ✓ | ✗ | ✓ | ✓ |

## Explanation of Operations

1. **Cache Check**: Only performed during read operations to check if data exists in cache before accessing the database.

2. **Execute Database Operation**: All CRUD operations ultimately execute against the database.

3. **Cache Update**: Only read operations update the cache with fresh data (depending on caching strategy).

4. **Cache Invalidation**: Create, update, and delete operations trigger cache invalidation to maintain consistency.

5. **Strategy Application**: Caching strategies (cache-first, network-first, stale-while-revalidate) only apply to read operations.

6. **Background Refresh**: Only applicable in read operations with stale-while-revalidate strategy.

7. **Auto-Invalidation via Middleware**: Mongoose middleware automatically invalidates cache entries for create, update, and delete operations.

8. **Manual Invalidation Support**: Available for create, update, and delete operations when automatic invalidation isn't sufficient.

9. **Collection-Level Invalidation**: Entire collections can be invalidated on bulk create, update, or delete operations.

10. **Query-Specific Invalidation**: Specific queries can be invalidated based on document IDs for targeted create, update, or delete operations.




