---
title: "Progressive Web App"
sidebar_position: 7
---

# PWA Implementation Architecture Documentation

## Overview
The application implements Progressive Web App (PWA) functionality with offline capabilities, focusing on content creation and management. The implementation uses Workbox for service worker management and IndexedDB for offline data storage.

## PWA Configuration Philosophy

The application implements a granular configuration system for PWA capabilities, allowing precise control over what content is cached and made available offline:

```javascript
{
  _EnablePWA: false, // Master switch for PWA functionality
  _PWACacheConfig: {
    publishedListing: true,    // Cache published content listings
    publishedLanding: false,   // Cache individual published pages
    myUserProfile: true,      // Cache user profile data
    tpls: true,              // Cache content templates
    tagTypes: true,          // Cache taxonomy data
  }
}
```

### Configuration Philosophy

1. Granular Control
   - Each major feature can be individually configured for offline availability
   - Allows for fine-tuned performance optimization
   - Enables gradual PWA rollout strategies
   - Facilitates testing and debugging

2. Content-Type Awareness
   - Different types of content can have different caching rules
   - Critical content can be prioritized
   - Heavy content can be selectively excluded
   - User-specific content can be managed separately

3. Resource Management
   - Prevents unnecessary caching of rarely-accessed content
   - Optimizes storage usage on user devices
   - Balances offline capability with device limitations
   - Manages cache size through selective caching

4. Implementation Strategy
   - Global master switch (`_EnablePWA`)
   - Feature-level toggles for specific functionality
   - Content-type specific controls
   - User-data specific settings

### Usage Guidelines

1. Platform Configuration
   ```javascript
   if (platformConfigs.deployment._EnablePWA) {
     // Check specific feature flags
     if (_PWACacheConfig.publishedListing) {
       // Cache listings
     }
     if (_PWACacheConfig.myUserProfile) {
       // Cache user data
     }
   }
   ```

2. Feature Considerations
   - `publishedListing`: Cache content listings for offline browsing
   - `publishedLanding`: Cache individual content pages (higher storage impact)
   - `myUserProfile`: Cache user-specific data for offline functionality
   - `tpls`: Cache templates for offline content creation
   - `tagTypes`: Cache taxonomy for offline categorization

3. Best Practices
   - Enable caching for frequently accessed content
   - Disable caching for rapidly changing content
   - Consider device storage limitations
   - Balance offline capabilities with performance

This configuration system allows for precise control over the PWA's offline capabilities while maintaining performance and user experience.

## Key Components

### 1. Service Worker Registration and Update Management

#### Deployment Update Mechanism
A crucial part of the PWA implementation is ensuring users receive updates when new versions are deployed. This is handled through a deployment script:

```javascript
// changeSW.js
const fs = require("fs");

const swPath = './client/src/sw.js';

fs.readFile(swPath, function read(err, data) {
  if (err) {
    return console.log(err);
  }
  fs.createWriteStream(swPath).write(Buffer.concat([data, Buffer.from('// appended so that SW updates on deploy')]));
});
```

Integration in deployment pipeline:
```json
{
  "scripts": {
    "deployDev": "npm run buildDev --prefix client && npm run changeSW && git add . && git commit -m \"CHANGE SW AND DEPLOY\" && gcloud config set project ok-framework && gcloud app deploy dev.yaml",
    "deployStaging": "npm run buildStaging --prefix client && npm run changeSW && git add . && git commit -m \"CHANGE SW AND DEPLOY\" && gcloud config set project ok-framework && gcloud app deploy staging.yaml",
    "deployProd": "npm run buildProd --prefix client && npm run changeSW && git add . && git commit -m \"CHANGE SW AND DEPLOY\" && gcloud config set project ok-framework && gcloud app deploy prod.yaml",
    "changeSW": "node changeSW"
  }
}
```

This mechanism:
1. Automatically modifies the service worker file during deployment
2. Forces the service worker to be different in each deployment
3. Triggers the update flow for users with cached versions
4. Prompts users to update their application

#### Build Configuration
The application uses `react-app-rewired` to customize the service worker build process. This configuration is crucial for proper PWA functionality as it handles the injection of the service worker into the build:

```javascript
// config-overrides.js
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const { babelInclude, override } = require("customize-cra");
const path = require("path");
const { customAlphabet } = require("nanoid");

const genRevisionId = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyz",
  32
);

module.exports = {
  webpack: override(
    babelInclude([
      path.resolve('src'),
      path.resolve('node_modules/@react-leaflet'),
      path.resolve('node_modules/react-leaflet')
    ]),
    (config, env) => {
      config.plugins = config.plugins.map((plugin) => {
        if (plugin.constructor.name === 'GenerateSW') {
          return new WorkboxWebpackPlugin.InjectManifest({
            swSrc: './src/sw.js',
            swDest: 'service-worker.js',
          });
        }
        return plugin;
      });
      return config;
    }
  ),
};
```

Key aspects of the build configuration:

1. Workbox Integration
   - Replaces default Create React App service worker generator
   - Uses `InjectManifest` plugin for custom service worker
   - Maintains source file path at `./src/sw.js`
   - Outputs final service worker as `service-worker.js`

2. Build Process
   - Override's CRA's default webpack configuration
   - Handles proper transpilation for React Leaflet dependencies
   - Maintains custom service worker source
   - Enables full control over service worker functionality

This configuration works in conjunction with the deployment update mechanism to ensure proper service worker compilation and distribution. The `InjectManifest` plugin allows us to maintain our custom service worker logic while still getting the benefits of Workbox's precaching and runtime caching capabilities.

#### Registration Entry Point
```javascript
// serviceWorkerRegistration/index.js
export function register(config) {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    if (__isPublicUrlMismatch()) return;

    const windowLoadCallback = () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (__isLocalhost()) {
        __checkIsSWValid(swUrl, config, registerValidSW);
      } else {
        registerValidSW(swUrl, config);
      }
    };

    if (document.readyState === "complete") {
      windowLoadCallback();
    } else {
      window.addEventListener("load", windowLoadCallback);
    }
  }
}
```

#### Validation Functions
```javascript
// serviceWorkerRegistration/function.js
export const __isLocalhost = () =>
  Boolean(
    window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

export const __isPublicUrlMismatch = () => {
  const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
  return publicUrl.origin !== window.location.origin;
};

export const __checkIsSWValid = (swUrl, config, registerCallback) => {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerCallback(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
};
```


#### Core Registration Logic
```javascript
function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      // Handle waiting worker
      let waitingWorker = registration.waiting;
      if (waitingWorker && waitingWorker.state === 'installed') {
        config.broadcastUpdateAvailable(registration);
      }

      // Setup update detection
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                config.broadcastUpdateAvailable(registration);
              } else {
                config.broadcastFirstSWStatusMsg('installed');
              }
            }
          };
        }
      };

      // Setup communication channel
      const messageChannel = new MessageChannel();
      
      navigator.serviceWorker.ready.then((_registration) => {
        _registration.active.postMessage(
          { type: "PORT_INITIALIZATION" },
          [messageChannel.port2]
        );

        messageChannel.port1.onmessage = (event) => {
          switch (event.data.type) {
            case "SW_ACTIVATED":
              config.handleNewSWActivated(event.data.payload.wasAWaitingWorker);
              break;
            case "DATA_SAVED_TO_DB":
              config.onSavedToDb && config.onSavedToDb(event.data.payload);
              break;
          }
        };
      });
    });
}
```

#### React Hook Integration
```javascript
export const useRegisterSw = ({platformConfigs, enabled}) => {
  const { SET_INFO_BANNER } = useBannerContext();
  
  useEffect(() => {
    if (enabled) {
      const { _EnablePWA } = platformConfigs.deployment;
      if (!_EnablePWA) {
        serviceWorkerRegistration.unregister();
      } else {
        serviceWorkerRegistration.register({
          handleNewSWActivated: (wasAWaitingWorker) => {
            SET_INFO_BANNER({
              id: 'broadcastSWStatusMsg',
              color: "grey",
              msg: wasAWaitingWorker ? "New Updates Activated!" : "Website is Offline Ready!", 
              timeOut: 3000
            });
            __CachePublicApis();
            __getUserDataAndPrecachePrivateApis({SET_INFO_BANNER});
          },

          broadcastUpdateAvailable: (registration) => {
            SET_INFO_BANNER({
              id: 'broadcastSWStatusMsg',
              color: "grey",
              msg: "New Updates Ready!",
              cta: {
                text: "Update Now",
                action: () => __handleLoadWaitingServiceWorker(registration)
              },
              hideCloseButton: true
            });
          },

          broadcastSecondSWStatusMsg: (state) => {
            SET_INFO_BANNER({
              id: 'broadcastSWStatusMsg',
              color: 'grey', 
              msg: state === 'installing' 
                ? 'New Updates are installing...' 
                : state === 'activating'
                  && 'New Updates are activating..'
            });
          }
        });
      }
    }
  }, [enabled]);
};
```


### 2. Offline Content Management

#### Content Creation Flow
When creating content offline, we generate temporary structures:

```javascript
const genOfflineContent = ({content, userData}) => ({
  ...(content || {}),
  _id: '00' + customAlphabet('1234567890', 22)(),
  kp_published_status: 'draft',
  main: {
    title: `offline_draft_${customAlphabet('1234567890', 4)()}`
  },
  meta: {
    ...(content?.meta || {}),
    kp_contributed_by: { _id: userData.user._id }
  }
});

// Usage in mutation hook
export const useCreateContent = () => {
  const userData = useGetQueryData('userData');
  
  return useMutation(
    ({ contentType, content: _content = {} }) => {
      const content = !isDeviceOnline()
        ? genOfflineContent({content: _content, userData})
        : _content;
      return axios.post(
        `/api/content/createContent/${contentType}`,
        content,
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
  );
};
```

#### Offline Content ID Synchronization
The application maintains ID continuity between offline-created content and backend storage through a coordinated ID handling system:

Frontend Generation:
```javascript
const genOfflineContent = ({content, userData}) => ({
  ...(content || {}),
  _id: '00' + customAlphabet('1234567890', 22)(), // Generate temporary ID for offline content
  // ... other content fields
});
```

Backend Handling:
```javascript
// Backend content payload generator
const genContentPayload = ({
  action = "CREATE",
  contributedById,
  contentType,
  // ... other params
  *id,  // Special param for PWA background sync
  prevContent,
}) => {
  return {
    ...(_id ? { _id } : {}), // Preserve offline-generated ID if present
    main: main || {},
    meta: {
      // ... meta fields
    },
    // ... other content fields
  };
};
```

Key Implementation Details:
1. ID Generation Flow
   - Frontend generates temporary ID for offline content
   - ID is preserved in IndexedDB during offline state
   - Background sync passes this ID to backend
   - Backend maintains the same ID for consistency

2. Benefits
   - Maintains data consistency across online/offline states
   - Prevents duplicate content creation
   - Enables seamless sync without content loss
   - Facilitates offline content management

3. ID Format
   - Frontend prefix: '00' for offline-generated content
   - 22 digits of random numbers
   - Consistent format for tracking and management

This system ensures that content created offline maintains its identity when synchronized with the backend, preventing duplicates and maintaining data integrity throughout the online/offline lifecycle.

#### Content Retrieval System
Complete implementation of offline content retrieval:

```javascript
const getOfflineDocs = async () => {
  const db = await openDB('workbox-background-sync');
  let store;
  try {
    store = db.transaction('requests', 'readwrite').objectStore('requests');
  } catch(err) {
    setOfflineDrafts([]);
    return;
  }
  
  let results = await store.getAll();
  
  const urlBodyPairs = results
    .map(d => ({
      url: d.requestData.url,
      body: JSON.parse(bufToStr(d.requestData.body)).Contribution || JSON.parse(bufToStr(d.requestData.body))
    }));
    
  const segUrlBodyPairs = segrigateDocs(urlBodyPairs, 'body._id');
  const idbDocs = Object.values(segUrlBodyPairs).reduce((a,b) => {
    return [
      ...a, 
      b.find(d => d.url.includes('api/contributions')) || 
      b.find(d => d.url.includes('content/createContent/'))
    ]
  }, []).map(d => d.body);
  
  setOfflineDrafts(idbDocs);
};
```

### 3. Background Sync
Complete implementation of the background sync system:

```javascript
// sw.js
const queue = new workbox.backgroundSync.Queue("pendingContrPosts", {
  onSync: ({ queue }) => setTimeout(() => syncFn2({queue}), 3000),
});

const syncFn2 = async ({queue}) => {
  const entry = await queue.shiftRequest();
  if(entry) {
    try {
      console.log("request shape:", entry.request);
      let body = await entry.request.clone().json();
      body = { ...body, isOfflineDoc: true };
      let response = await fetch(entry.request.clone(), {
        body: JSON.stringify(body),
        credentials: "omit"
      });
      
      if (!response.ok) {
        console.log("err response from server", response);
        await queue.unshiftRequest({ request: entry.request.clone() });
      } else {
        console.log("Response OK", response);
        communicationPort && !entry.request.url.includes('/createContent/') &&
          communicationPort.postMessage({
            type: "DATA_SAVED_TO_DB",
            payload: {
              msg: "Data Saved TO Database",
              Contribution: body.Contribution,
            },
          });
        await syncFn2({queue});
      }
    } catch(err) {
      console.error("Replay failed for request", entry.request.clone(), error);
      await queue.unshiftRequest({ request: entry.request.clone() });
      return;
    }
  }
};
```


### 4. Caching Strategies

```javascript
// sw.js
const matchCondition = (url, matchApisList, ignoreApisList) => {
  return (
    matchApisList.some((str) => (url.pathname + url.search).includes(str)) &&
    ignoreApisList.every((str) => !(url.pathname + url.search).includes(str))
  );
};

const staleWhileRevalidateMatchCb = ({ url }) => {
  const matchApisList = [
    "/api/contributions",
    "/api/discovery",
    "/api/users",
  ];

  const ignoreApisList = [];

  return matchCondition(url, matchApisList, ignoreApisList);
};

const networkFirstMatchCb = ({ url }) => {
  const matchApisList = [
    "/api/platformConfigs",
    "/api/tpl/getAllTpls",
    "/api/auth",
    "/api/userProfiles",
  ];

  const ignoreApisList = [];

  return matchCondition(url, matchApisList, ignoreApisList);
};

workbox.routing.registerRoute(
  staleWhileRevalidateMatchCb,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "staleWhileRevalidate_apis_v1",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
    ],
  })
);

workbox.routing.registerRoute(
  networkFirstMatchCb,
  workbox.strategies.networkFirst({
    cacheName: "networkFirst_apis_v1",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
    ],
  })
);

workbox.routing.registerNavigationRoute(
  workbox.precaching.getCacheKeyForURL("/index.html"),
  {
    blacklist: [new RegExp("/api/"), new RegExp("/shareLink/"), new RegExp("__MANIFEST__")],
  }
);
```

#### Authentication-Aware API Caching
The application implements a sophisticated caching strategy for authenticated APIs that triggers when a user first loads the application:

```javascript
// In auth hooks
export const useUserLoad = (options) => {
  const { platformConfigsLoading, platformConfigs, enabled } = options;
  const {SET_INFO_BANNER} = useBannerContext();
  
  const query = useQuery("userData", fetchCurrentUser, {
    enabled,
    onSuccess: ({ user }) => {
      // Cache authenticated APIs after successful user load
      if (
        process.env.NODE_ENV === "production" &&
        !platformConfigsLoading &&
        platformConfigs.deployment._EnablePWA
      ) {
        __precachePrivateApis({
          thisUserProfileType: user.profileType, 
          thisUserId: user._id,
          SET_INFO_BANNER
        });
      }
    },
  });
  
  return {
    ...query,
    isAuthenticated: query.status === "success"
  };
};
```

This mechanism ensures:
1. Private API caching only occurs after successful authentication
2. User-specific content is cached appropriately
3. PWA functionality respects platform configuration
4. Users receive visual feedback about the caching process

Key Implementation Details:
- Triggered on initial user load
- Respects platform PWA configuration flag
- Only runs in production environment
- Provides user feedback via banner system
- Caches user-specific endpoints based on profile type and ID

This authentication-aware caching complements the general caching strategies by:
- Ensuring private data is only cached for authenticated users
- Maintaining security of user-specific endpoints
- Optimizing offline functionality for authenticated sections
- Managing cache invalidation for private data

### 5. User Interface Integration

#### Status Indicators
```javascript
const H_SaveStatus = () => (
  <_SaveStatus
    status={_Locale(
      isAutoSaved
        ? !isDeviceOnline()
          ? "Saved Offline"
          : "Saved!"
        : isAutoSaving
        ? !isDeviceOnline()
          ? "Saving Offline..."
          : "Saving..."
        : ""
    )}
  />
);
```

#### Offline Mode UI
```javascript
const createDraftsList = () => {
  let draftContrsToShow = allDrafts.filter((d) =>
    offlineDrafts.every((dd) => dd._id !== d._id)
  );
  
  return [...offlineDrafts, ...draftContrsToShow].map(d => ({
    ...d,
    titleForDisplayOnListElement: getText(d?.main?.title) || _Locale('Untitled'),
    lastEdited: `last edited : ${createContentCardDate(
      d.kp_date_last_saved,
      null,
      null,
      { switchDisplayFormatAfter: 1 }
    )}`,
    statusTag: offlineDrafts.some(dd => dd._id === d._id) && 'Saved On Phone'
  }));
};

const replayBackgroundSync = () => {
  const messageChannel = new MessageChannel();
  let worker = navigator.serviceWorker?.controller;
  worker && worker.postMessage(
    { type: 'REPLAY_BG_SYNC_REQUESTS' }, 
    [messageChannel.port2]
  );
};
```


### 6. Service Worker Communication
```javascript
// sw.js
self.addEventListener("message", (event) => {
  if (event.data) {
    switch (event.data.type) {
      case "PORT_INITIALIZATION":
        communicationPort = event.ports[0];
        if (swActivated) {
          communicationPort.postMessage({
            type: "SW_ACTIVATED",
            payload: { wasAWaitingWorker: isAWaitingWorker },
          });
          isAWaitingWorker = false;
          swActivated = false;
        }
        break;

      case "REPLAY_BG_SYNC_REQUESTS":
        setTimeout(() => syncFn2({queue}), 3000);
        break;

      case "SKIP_WAITING_AND_RELOAD":
        self.skipWaiting();
        let skipWaitingComsPort = event.ports[0];
        isAWaitingWorker = true;
        skipWaitingComsPort.postMessage({ type: "REFRESH_PAGE" });
        break;
    }
  }
});
```

## Implementation Considerations

### Security
1. Authentication State
   - Secure storage of auth tokens
   - Permission validation in offline mode
   - Encrypted data storage

2. Data Protection
   - Sanitization of offline data
   - Secure sync mechanisms
   - Protected cache access

### Performance
1. Caching Strategy Optimization
   - Selective caching based on content type
   - Cache size management
   - Cache invalidation rules

2. Background Sync
   - Batched sync operations
   - Retry mechanisms
   - Conflict resolution

### User Experience
1. Status Indicators
   - Clear online/offline status
   - Sync progress indication
   - Update notifications

2. Error Handling
   - Graceful offline fallbacks
   - Clear error messages
   - Recovery mechanisms

## Future Development Notes

### 1. Upgrade Considerations
- Migration to newer Workbox versions
- React 18+ compatibility updates
- Modern service worker features
- Enhanced caching patterns

### 2. Potential Improvements
- Advanced conflict resolution
- Better offline editing capabilities
- Enhanced sync status reporting
- More granular cache control
- Real-time collaboration support

### 3. Deployment Process Improvements
- Automated version tracking
- Gradual rollout capability
- Rollback mechanisms
- Update analytics
- A/B testing support

## Best Practices Learned

1. Service Worker Updates
   - Always force updates on deployment
   - Clear update notification system
   - Graceful update process
   - Version tracking

2. Offline Data Management
   - Careful handling of offline data
   - Clear sync status indication
   - Proper conflict resolution
   - Data integrity checks

3. User Communication
   - Clear status messages
   - Consistent notification system
   - Progress indicators
   - Error feedback

4. Performance Optimization
   - Strategic caching
   - Efficient background sync
   - Resource prioritization
   - Network request management

5. Development Workflow
   - Automated deployment process
   - Version control integration
   - Testing procedures
   - Monitoring systems

## Conclusion
This PWA implementation provides a robust foundation for offline-capable web applications, with careful consideration for user experience, data integrity, and performance. The system's modular design allows for future enhancements while maintaining current functionality.