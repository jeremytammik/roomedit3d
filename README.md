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

Now that this text is growing even more, here is a full table of contents:

- [Connecting desktop and cloud](#1)
- [Interactive Model Modification in the View and Data API Viewer](#2)
- [Communication Path Back from Viewer Client to Node.js Web Server to Desktop BIM](#3)
- [Test](#4)
- [Setting Up Your Own Model](#5)
- [Roomedit3dV2 Using OAuth2 to Edit any Model](#6)
- [Detailed Documentation on the Blogs](#7)
- [Author](#98)
- [License](#99)



## <a name="1"></a>Connecting desktop and cloud

Roomedit3d is a member of the suite of samples connecting the desktop and the cloud.

Each of the samples consists of a C# .NET Revit API desktop add-in and a web server:

- [RoomEditorApp](https://github.com/jeremytammik/RoomEditorApp) and  the [roomeditdb](https://github.com/jeremytammik/roomedit) CouchDB
	database and web server demonstrating real-time round-trip graphical editing of furniture family instance location and rotation plus textual editing of element properties in a simplified 2D representation of the 3D BIM.
- [FireRatingCloud](https://github.com/jeremytammik/FireRatingCloud) and
	the [fireratingdb](https://github.com/jeremytammik/firerating) node.js
	MongoDB web server demonstrating real-time round-trip editing of Revit element shared parameter values.
- [Roomedit3dApp](https://github.com/jeremytammik/Roomedit3dApp) and
  the [roomedit3d](https://github.com/jeremytammik/roomedit3d) Forge Viewer extension demonstrating translation of furniture family instances in the viewer and updating the Revit BIM in real time via a socket.io broadcast.


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

The dedicated C# .NET Revit add-in [Roomedit3dApp](https://github.com/jeremytammik/Roomedit3dApp) subscribes to the socket.io channel, retrieves the updating data and raises an external event to obtain a valid Revit API context and apply it to the BIM.


## <a name="4"></a>Test

The roomedit3d web server displaying the View and Data API viewer and broadcasting the modified element translations is hosted on Heroku
at [roomedit3d.herokuapp.com](http://roomedit3d.herokuapp.com). Look at the model displayed there. You can select and move arbitrary building elements.

If the Roomedit3dApp is up and running in Revit with the same model and subscribed to receiving the broadcast events, it will update the BIM accordingly.


## <a name="5"></a>Setting Up Your Own Model

In a [comment](http://thebuildingcoder.typepad.com/blog/2016/05/roomedit3d-live-real-time-bim-update-recording.html#comment-2714887080)
on The Building Coder discussion of
the [roomedit3d live real-time socket.io BIM update](http://thebuildingcoder.typepad.com/blog/2016/05/roomedit3d-live-real-time-bim-update-recording.html),
Danny Bentley asked:

> This is very cool.
> I got everything downloaded and started going through the SocketTest and it worked great.
> I want to try the Roomedit3dApp, but in my zip file I don't seem to have the .rvt file of the room.
> Where could I find this file?

Answer: You can take any Revit RVT you like.

It does not have to have anything to do with rooms at all, really, since any element will be accepted, moved, and the translation communicated back via the socket to the Revit add-in running in the same model.

Translate your RVT for the Forge viewer using your own credentials.

Adapt the roomedit3d viewer server to load it by specifying your own credentials and your translated model URN.

That is all all I can think of.

With that done, you should be ready to go.

Since I provided that answer, however, things have got easier still:


## <a name="6"></a>Roomedit3dV2 Using OAuth2 to Edit any Model

The Forge platform has now been redesigned and the View and Data API renamed.

To be more precise, what we so far considered the View and Data API has been restructured more cleanly into separate REST API endpoint collections:

- [Authentication](https://developer.autodesk.com/en/docs/oauth/v2/overview)
- [Data Management API](https://developer.autodesk.com/en/docs/data/v2/overview)
- [Model Derivative API](https://developer.autodesk.com/en/docs/model-derivative/v2/overview)
- [Viewer](https://developer.autodesk.com/en/docs/viewer/v2/overview)

I implemented a new version of Roomedit3d adapted to fit into that structure:
[Roomedit3dV2](https://github.com/jeremytammik/model.derivative.api-nodejs-sample-roomedit3d).

You can test it live
at [roomedit3dv2.herokuapp.com](http://roomedit3dv2.herokuapp.com).

In that version, you can log into
your [own A360 account](https://myhub.autodesk360.com), obviously exercising
the [Authentication API](https://developer.autodesk.com/en/docs/oauth/v2/overview).

The sample uses
the [Data Management API](https://developer.autodesk.com/en/docs/data/v2/overview) to
list all hubs you have access to and the hierarchy of projects, folders, items and versions within them.

When you select a specific version,
the [Model Derivative API](https://developer.autodesk.com/en/docs/model-derivative/v2/overview) provides
access to the internal CAD seed file structure, translates it for the viewer, and enables geometry export of selected elements.

Within the viewer, the `Roomedit3dTranslationTool` can be turned on an behaves just as before:

- Select an element
- Transform its location
- Report the data back from the viewer to the web server via a REST API call
- Broadcast the data from the web server to the C# .NET clients to update the BIM


## <a name="7"></a>Detailed Documentation on the Blogs

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



## <a name="98"></a>Author

- [Philippe Leefsma](http://adndevblog.typepad.com/cloud_and_mobile/philippe-leefsma.html), Autodesk Developer Network.
- Jeremy Tammik,
[The Building Coder](http://thebuildingcoder.typepad.com) and
[The 3D Web Coder](http://the3dwebcoder.typepad.com),
[ADN](http://www.autodesk.com/adn)
[Open](http://www.autodesk.com/adnopen),
[Autodesk Inc.](http://www.autodesk.com)


## <a name="99"></a>License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT).
Please see the [LICENSE](LICENSE) file for full details.
