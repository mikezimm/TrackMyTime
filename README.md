## Transfering this repo to [TrackMyTime7](https://github.com/mikezimm/TrackMyTime7)
Please see that for latest everything.






## track-my-time

This is where you include your WebPart documentation.

### Additional npm installs
```
//Copied from Pivot-Tiles
npm install @pnp/logging @pnp/common @pnp/odata @pnp/sp --save ( Done Dec 11 )
npm install @microsoft/sp-page-context ( Done Dec 11 )
npm install @pnp/spfx-property-controls ( Dec 13 )
npm install @pnp/sp  ( Required to get list items from web )
npm install @pnp/spfx-controls-react --save --save-exact (Dec 18 - for react ListView of history items)
npm install --save @pnp/polyfill-ie11 ( Required for Internet Explorer Expand/Select calls )
npm install @pnp/spfx-controls-react --save --save-exact
npm install @microsoft/sp-webpart-base (Required for all Prop Pane Panel files)
npm install @microsoft/sp-core-library (Required for base web part.ts)

```

### Get pre-configured options from Pivot-Tiles


### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO
