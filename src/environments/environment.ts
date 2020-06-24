/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  firebaseConfig : {
    apiKey: "AIzaSyCFCvibThfKCZ9WjnVHggmXbNNUowdyPmM",
    authDomain: "dln-covid-control.firebaseapp.com",
    databaseURL: "https://dln-covid-control.firebaseio.com",
    projectId: "dln-covid-control",
    storageBucket: "dln-covid-control.appspot.com",
    messagingSenderId: "1034892410447",
    appId: "1:1034892410447:web:7f955a2a3649439c93b43a",
    measurementId: "G-XLFQQFKTWK"
  }
};
