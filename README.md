# Roomedit3d

View and Data API extension to move furniture family instances and update the Revit BIM in real-time using [socket.io](http://socket.io).

Based on the [boilerplate project for View & Data API using a node server](https://github.com/leefsmp/view.and.data-boilerplate).

A Revit BIM model is translated for and displayed to the user by the
[Forge](http://forge.autodesk.com)
[View and Data API](https://developer.autodesk.com/api/view-and-data-api).

A View and Data API extension client app enables user interaction to move selected elements around on screen.

The updated elements and their new locations are transferred to the [node.js](https://nodejs.org) server via a REST API call.

The server uses [socket.io](http://socket.io) to broadcast the updates.

This broadcast is picked up by a yet-to-be-implemented C# .NET Revit add-in client.

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
