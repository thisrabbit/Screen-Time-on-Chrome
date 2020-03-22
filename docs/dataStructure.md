### settings
```js
let init = {
  // The data format version, in case format changes.
  version: 1,
  // After reach the limit, user can apply an extra period of time (no more than 10 minutes).
  extraTime: 1,
}
```

### map
```js
let init = {}
```
```js
let normal = {
  'www.google.com': 'google.com',
  'www.bing.com': 'bing.com',
}
```
```js
// NOT ALLOWED
let caseReclusive = {
  'www.google.com': 'www.bing.com',
  'www.bing.com': 'Search Engine',
}
```

### policy
```js
let init = {}
```
```js
let normal = {
  'google.com': {
    tracked: true,
    limited: true,
    // Limit time by minutes.
    maxLimitTime: 10 * 60,
    // Alternative: An array which sets limit time in a week separately (From Sunday).
    // maxLimitTime: [60, 60, 60, 60, 60, 60, 60]
  }
}
```

### history
> Only store up to 5 weeks data. Outdated data will be deleted.
> Needs long-term keep
```js
let init = Array(35)
```
```js
let normal = [
  // A day's record, containing today.
  {
    date: '2020-03-22',
    'google.com': {
      screenTime: {
        // hour (from 0)-usedTime (minutes) as key-value
        '16': 60,
        '17': 10,
      },
      openTimes: {
        '16': 6,
        '17': 2,
      }
    }
  },
]
```

### runtime
> Refresh every day
```js
let init = {}
```
```js
let normal = {
  date: '2020-03-22',
  'google.com': {
    // Used time in second.
    usedSecond: 124,
    // If user is using an extra period of time (can be configured, 1 min by default).
    inExtraTime: false,
  }
}
```
