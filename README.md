Bootstrap Modalbox
=============

Allow you to easy manage modalboxes no matter where the source comes from:

+ html
+ ajax call
+ iframes
+ inline

Overview
-----------

+ Backwards compatible
+ Responsive
+ Stackable
+ Full width
+ Load content via AJAX
+ Disable background scrolling

Installation 
-----------
After including files described in https://github.com/jschr/bootstrap-modal#installation-, you also need to include bootstrap-modalbox.js

Options
-----------
+ **type**
The type of the source for the modalbox: html, ajax, iframe

+ **title**
The title of the modalbox

+ **source**
The source for the content of the modalbox, can be a URL for 'ajax' and 'iframe' types of a string for 'html' and 'inline' types.

+ **buttons**
The buttons that will appear below the content of the modalbox. There are default buttons like 'yes', 'no', 'ok', 'cancel', 'close', 'save', 'submit' or you can create your own buttons by passing the attributes as an object (check http://api.jquery.com/jquery/#jQuery-html-attributes).

**NB.** The submit and save buttons will only work if the form does not have a an element called 'submit'.