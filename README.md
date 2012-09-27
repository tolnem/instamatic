# Instamatic

A quick and simple instagram visualization based on search for a tag

## Configuration

Go to http://instagram.com/developer/ and register an application.
You will get a client ID. Change the `clientID` variable at the top of the
instamatic.js file to this value.

Modify the `tag` variable to search for whatever tag you want.

If you want to tweak the timing for when to load new images or to animate
the ones that are currently loaded, change the `loadTimeout` and `animTimeout`
variables. `relayoutTimeout` is how long the script waits before doing a
relayout after a new image has been loaded, in case another image is loaded
just after and would trigger a new relayout.

`cutOff` limits the number of images to display on the page.
