// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  fcmUrl: 'https://fcm.googleapis.com/fcm/send',
  fcmServerKey:
  'AAAACBcogEU:APA91bERTAvOE9uYQh0eIM9i9i7YEWzrGX_AAGDqykQT0tC1N4qOngE0AZgeFqEb34vB6w_yO1VRBI2YKrfKfy168AqVRz9VRCSCJsmMPfn21s5s9GUx4t2VpIsJHzQwz0HhReMaCv_m',
    
  // eslint-disable-next-line max-len
  firebase: {
    projectId: 'pps-2do-parcial',
    appId: '1:34748268613:web:bd1cb6a0a701b94161e32c',
    storageBucket: 'pps-2do-parcial.appspot.com',
    apiKey: 'AIzaSyCNr5Efj4hyqSfi0l7Z_N4XnnHRa_1pT1s',
    authDomain: 'pps-2do-parcial.firebaseapp.com',
    messagingSenderId: '34748268613',
  },
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
