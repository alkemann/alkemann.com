# h.l.app

**h.l** single purpose, website baseline for serving semi static content and 
rich frontends.
Contains base folder structure and starting composer.json to get started with H.L 

## What h.l is NOT
  * a web application
  * or a web application framework
  * a CMS (in the traditional web app sense)
  * a replacement of any of the above

## What does that mean?

It means that every effort will be made to keep this from bloating into one of
those things above that it was described as not being. It also means that it
will come with tools that helps with the serving of seemingly static, highly
cacheable content. It will not support or require server databases, but try to
take advantage of such features on the client , where available. It will also
include tools to ease the serving the same content to multiple devices and APIs.

## How will it achieve this?

  * a minimal amount of PHP classes for handling requests, smart view/layout rendering and header setting, as well as serving the same content in multiple formats.
  * including in a smart, ready to use way, small OSS libraries 
  * like Slickmap, krumo
