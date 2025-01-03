---
title: "Document Status Based Action"
sidebar_position: 9
---

# Document Status Based Action

## Overview

This details the various states a document can be in and the transitions between the states based on user actions and permissions.

## Status Definitions

| Status | Description |
|--------|-------------|
| draft | Initial state of newly created content or modified sent-back content |
| awaitingModeration | Content submitted for review |
| underModeration | Content currently being reviewed by a moderator |
| published | Content approved and visible on the platform (OR directly published by the user if they have permission to publish) |
| sentBack | Content returned to contributor with review notes |
| editPublished | Working copy of a published document being edited |

## Workflow Scenarios

### 1. New Content Creation

#### Users with SUBMIT access
```
   draft --> awaitingModeration --> underModeration --> published
```
   OR
```
   draft --> awaitingModeration --> underModeration --> sentBack --> draft
```
   OR
```
   draft --> awaitingModeration --> underModeration --> awaitingModeration
```

#### Users with PUBLISH Access
```
    draft --> published
```

#### Process Details

1. User creates content (status: `draft`)
2. User submits content for review (status: `awaitingModeration`)
3. Moderator begins review (status: `underModeration`)
4. Moderator decides to:
   - Publish content (status: `published`)
   - Return content with notes (status: `sentBack`)
5. If sent back, any user modifications changes status to `draft` again

### 2. Editing Published Content

#### Users with SUBMIT access
```
   published --> editPublished --> awaitingModeration --> underModeration --> published
```
   OR
```
   published --> editPublished --> awaitingModeration --> underModeration --> sentBack -->  editPublished
```

#### Users with PUBLISH Access
```
   editPublished --> published
```

#### Process Details

1. User initiates edit of published content
2. System creates clone (status: `editPublished`)
3. User submits edited version (status: `awaitingModeration`)
4. Moderator begins review (status: `underModeration`)
5. Moderator decides to:
   - Publish content (status: `published`)
   - Return content with notes (status: `sentBack`)
6. If sent back, any user modifications changes status to `editPublished` again

### 3. Moderator-Initiated Review

```
   published --> underModeration --> published
```
   OR
```
   published --> underModeration --> sentBack --> draft
```

#### Process Details

1. Moderator initiates review of published content
2. Content is removed from platform (status: `underModeration`)
3. Moderator decides to:
   - publish the content after review (status: `published`)
   - Return content with notes (status: `sentBack`)
4. If sent back, any user modifications changes status to `draft`

## Notes

- Content visibility is restricted based on status
- Only published content is visible on the platform
- Users with PUBLISH access bypass the moderation workflow
- Sent-back content must go through the entire workflow again
- When under moderation, published content is temporarily removed from the platform