# Roomedit3d

View and Data API extension to move furniture family instances and update the Revit BIM in real-time using [socket.io](http://socket.io).

Based on the [boilerplate project for View & Data API using a node server](https://github.com/leefsmp/view.and.data-boilerplate).

A Revit BIM model is translated for and displayed to the user by the
[Forge](http://forge.autodesk.com)
[View and Data API](https://developer.autodesk.com/api/view-and-data-api).

A View and Data API extension client app enables user interaction to move selected elements around on screen.

The updated elements and their new locations are transferred to the [node.js](https://nodejs.org) server via a REST API call.

The server uses [socket.io](http://socket.io) to broadcast the updates.

This broadcast is picked up by the [Roomedit3dApp](https://github.com/jeremytammik/Roomedit3dApp) C# .NET Revit add-in client.

Currently hardwired for a specific model; the selected element is identified via its Revit UniqueId.

This sample demonstrates two interesting aspects:

- [Interactive model modification in the View and Data API viewer](#2)
- [Communication path back from viewer client to node.js web server to desktop BIM](#3)

See below for further pointers to [more detailed documentation](#4).


## <a name="2"></a>Interactive Model Modification in the View and Data API Viewer

The [Roomedit3dTranslationTool](https://github.com/jeremytammik/roomedit3d/blob/master/www/js/extensions/Roomedit3dTranslationTool.js) implements
a View and Data API viewer extension that enables the user to select a component and interactively move it around on the screen, defining a translation to be applied to it and communicated back to the source CAD model.


## <a name="3"></a>Communication Path Back from Viewer Client to Node.js Web Server to Desktop BIM

The View and Data API provides view functionality only, no edit.

The pre-defined communication path goes from the desktop to the cloud, from the source CAD model to the translated View and Data API buckets and JSON data bubbles.

This sample demonstrates an interactive modification of the three.js graphics presented by the View and Data API viewer, and a communication path to send updated element location information back to the desktop product in real time.

In this case, the source desktop CAD model is a Revit BIM, and the modifications applied are furniture family instance translations.

The viewer client in the browser uses [fetch](https://github.com/github/fetch) to implement a REST API POST call to communicate the modified element external id and translation back to the node.js server.

The node.js server uses a [socket.io](http://socket.io) broadcast to notify the desktop of the changes.

The dedicated C# .NET Revit add-in [Roomedit3dApp]() subscribes to the socket.io channel, retrieves the updating data and raises an external event to obtain a valid Revit API context and apply it to the BIM.


## <a name="4"></a>Detailed Documentation on the Blogs

The full detailed project documentation with detailed implementation description is provided
by [The 3D Web Coder](http://the3dwebcoder.typepad.com)
and [The Building Coder](http://thebuildingcoder.typepad.com).

The 3D Web Coder discusses the Revit-independent aspects in the article on
the [Roomedit3d viewer extension, POST and socket.io](http://the3dwebcoder.typepad.com/blog/2016/05/roomedit3d-viewer-translation-extension-post-and-socket.html),
which also points to
a [six-minute demo recording](https://youtu.be/5IBd-L3cD3Y) showing:

- View and Data API viewer running locally
- The viewer extension
- The viewer echoing the translation data in the JavaScript debugger console
- The node server logging the POST data received from the viewer when running locally, and forwarding it to the socket.io broadcast
- The same steps running Heroku-hosted in the cloud
- The console app connecting to the cloud and logging the translation messages as they are sent and received

The Building Coder summarises the entire state of the project today in the article on
the [Roomedit3d live real-time socket.io BIM update](http://thebuildingcoder.typepad.com/blog/2016/05/roomedit3d-live-real-time-bim-update-recording.html),
which also points to
a [five-minute video recording](https://youtu.be/EbtyAZPX8Bc) showing the system up and running with the live connection from the View and Data API viewer directly into the Revit BIM.



## Author

- [Philippe Leefsma](http://adndevblog.typepad.com/cloud_and_mobile/philippe-leefsma.html), Autodesk Developer Network.
- Jeremy Tammik,
[The Building Coder](http://thebuildingcoder.typepad.com) and
[The 3D Web Coder](http://the3dwebcoder.typepad.com),
[ADN](http://www.autodesk.com/adn)
[Open](http://www.autodesk.com/adnopen),
[Autodesk Inc.](http://www.autodesk.com)


## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT).
Please see the [LICENSE](LICENSE) file for full details.
