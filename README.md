# Roomedit3d

View and Data API extension to move furniture family instances and update the Revit BIM

## Description

Basic boilerplate project for View & Data API using a node server

## Setup/Usage Instructions

* Request your own API keys from our developer portal: [developer.autodesk.com](http://developer.autodesk.com)
* Replace the placeholders with your own keys in config-view-and-data.js or use ENV variables:<br />
  ```
  ConsumerKey: process.env.CONSUMERKEY || '<replace with your consumer key>',
  ConsumerSecret: process.env.CONSUMERSECRET || '<replace with your consumer secret>',
  ```

* Upload one of your models to your account and get its URN using another workflow sample, for example:
  - Windows: [.NET WPF application workflow sample](https://github.com/Developer-Autodesk/workflow-wpf-view.and.data.api)
  - Mac: [Mac OS Swift workflow sample](https://github.com/Developer-Autodesk/workflow-macos-swift-view.and.data.api)
  - Browser: [models.autodesk.io web page](http://models.autodesk.io) or [javalmvwalkthrough web page](http://javalmvwalkthrough-vq2mmximxb.elasticbeanstalk.com)

* Copy the URN which was generated in the previous step in file /www/js/viewer.js <br />
  ```
  var urn = '<replace with your encoded urn>';
  ```
* Install node dependencies, by running the following command: <br />
  ```
  npm install
  ```
* Run the server from the Node.js console, by running the following command: <br />
  ```
  node server.js
  ```

* Connect to you local server using a WebGL-compatible browser: [http://localhost:3000/](http://localhost:3000/)

## License

[MIT License](http://opensource.org/licenses/MIT).

## Written by

Written by [Philippe Leefsma](http://adndevblog.typepad.com/cloud_and_mobile/philippe-leefsma.html)
Autodesk Developer Network.
