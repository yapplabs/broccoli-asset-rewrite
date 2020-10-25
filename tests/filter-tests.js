const fs       = require('fs');
const assert   = require('assert');
const fixture = require('broccoli-fixture');
const AssetRewrite  = require('..');

describe('broccoli-asset-rev', function() {
  it('uses the provided assetMap to replace strings', async function(){
    let inputNode = new fixture.Node({
      'encoded-meta-tag.html': `<meta name="ember-sample/config/environment" content="%7B%22modulePrefix%22%3A%22ember-sample%22%2C%22environment%22%3A%22development%22%2C%22baseURL%22%3A%22/%22%2C%22locationType%22%3A%22auto%22%2C%22marked%22%3A%7B%22js%22%3A%22/foo/bar/widget.js%22%2C%22highlights%22%3Afalse%7D%2C%22EmberENV%22%3A%7B%22FEATURES%22%3A%7B%7D%7D%2C%22APP%22%3A%7B%22name%22%3A%22ember-sample%22%2C%22version%22%3A%220.0.0.bb29331f%22%7D%2C%22contentSecurityPolicyHeader%22%3A%22Content-Security-Policy-Report-Only%22%2C%22contentSecurityPolicy%22%3A%7B%22default-src%22%3A%22%27none%27%22%2C%22script-src%22%3A%22%27self%27%20%27unsafe-eval%27%22%2C%22font-src%22%3A%22%27self%27%22%2C%22connect-src%22%3A%22%27self%27%22%2C%22img-src%22%3A%22%27self%27%22%2C%22style-src%22%3A%22%27self%27%22%2C%22media-src%22%3A%22%27self%27%22%7D%2C%22exportApplicationGlobal%22%3Atrue%7D" />`,
      'fonts.css': `@font-face {
        font-family: OpenSans;
        font-weight: 100;
        font-style: normal;
        src: url('fonts/OpenSans/Light/OpenSans-Light.eot');
        src: url('fonts/OpenSans/Light/OpenSans-Light.eot?#iefix') format('embedded-opentype'), url('fonts/OpenSans/Light/OpenSans-Light.woff') format('woff'), url('fonts/OpenSans/Light/OpenSans-Light.ttf') format('truetype'), url('fonts/OpenSans/Light/OpenSans-Light.svg#OpenSans') format('svg');
      }
      
      @font-face {
        font-family: OpenSans;
        font-weight: 200;
        font-style: normal;
        src: url('fonts/OpenSans/Medium/OpenSans-Medium.eot?#iefix');
        src: url('fonts/OpenSans/Medium/OpenSans-Medium.eot?#iefix') format('embedded-opentype'), url('fonts/OpenSans/Medium/OpenSans-Medium.woff') format('woff'), url('fonts/OpenSans/Medium/OpenSans-Medium.ttf') format('truetype'), url('fonts/OpenSans/Medium/OpenSans-Medium.svg#OpenSans') format('svg');
      }
      `,
      'quoted-script-tag.html': `<script src="foo/bar/widget.js"></script>`,
      'unquoted-script-tag.html': `<script src=foo/bar/widget.js></script>`,
      'unquoted-url-in-styles.css': `.sample-img{width:50px;height:50px;background-image:url(images/sample.png)}`,
    });
    let node = new AssetRewrite(inputNode, {
      assetMap: {
        'foo/bar/widget.js': 'blahzorz-1.js',
        'images/sample.png': 'images/fingerprinted-sample.png',
        'fonts/OpenSans/Light/OpenSans-Light.eot': 'fonts/OpenSans/Light/fingerprinted-OpenSans-Light.eot',
        'fonts/OpenSans/Light/OpenSans-Light.woff': 'fonts/OpenSans/Light/fingerprinted-OpenSans-Light.woff',
        'fonts/OpenSans/Light/OpenSans-Light.ttf': 'fonts/OpenSans/Light/fingerprinted-OpenSans-Light.ttf',
        'fonts/OpenSans/Light/OpenSans-Light.svg': 'fonts/OpenSans/Light/fingerprinted-OpenSans-Light.svg',
        'fonts/OpenSans/Medium/OpenSans-Medium.eot': 'fonts/OpenSans/Medium/fingerprinted-OpenSans-Medium.eot',
        'fonts/OpenSans/Medium/OpenSans-Medium.woff': 'fonts/OpenSans/Medium/fingerprinted-OpenSans-Medium.woff',
        'fonts/OpenSans/Medium/OpenSans-Medium.ttf': 'fonts/OpenSans/Medium/fingerprinted-OpenSans-Medium.ttf',
        'fonts/OpenSans/Medium/OpenSans-Medium.svg': 'fonts/OpenSans/Medium/fingerprinted-OpenSans-Medium.svg'
      }
    });

    let outputHash = await fixture.build(node);
    assert.deepStrictEqual(outputHash, {
      'encoded-meta-tag.html': `<meta name="ember-sample/config/environment" content="%7B%22modulePrefix%22%3A%22ember-sample%22%2C%22environment%22%3A%22development%22%2C%22baseURL%22%3A%22/%22%2C%22locationType%22%3A%22auto%22%2C%22marked%22%3A%7B%22js%22%3A%22/foo/bar/widget.js%22%2C%22highlights%22%3Afalse%7D%2C%22EmberENV%22%3A%7B%22FEATURES%22%3A%7B%7D%7D%2C%22APP%22%3A%7B%22name%22%3A%22ember-sample%22%2C%22version%22%3A%220.0.0.bb29331f%22%7D%2C%22contentSecurityPolicyHeader%22%3A%22Content-Security-Policy-Report-Only%22%2C%22contentSecurityPolicy%22%3A%7B%22default-src%22%3A%22%27none%27%22%2C%22script-src%22%3A%22%27self%27%20%27unsafe-eval%27%22%2C%22font-src%22%3A%22%27self%27%22%2C%22connect-src%22%3A%22%27self%27%22%2C%22img-src%22%3A%22%27self%27%22%2C%22style-src%22%3A%22%27self%27%22%2C%22media-src%22%3A%22%27self%27%22%7D%2C%22exportApplicationGlobal%22%3Atrue%7D" />`,
      'fonts.css': `@font-face {
        font-family: OpenSans;
        font-weight: 100;
        font-style: normal;
        src: url('fonts/OpenSans/Light/fingerprinted-OpenSans-Light.eot');
        src: url('fonts/OpenSans/Light/fingerprinted-OpenSans-Light.eot?#iefix') format('embedded-opentype'), url('fonts/OpenSans/Light/fingerprinted-OpenSans-Light.woff') format('woff'), url('fonts/OpenSans/Light/fingerprinted-OpenSans-Light.ttf') format('truetype'), url('fonts/OpenSans/Light/fingerprinted-OpenSans-Light.svg#OpenSans') format('svg');
      }
      
      @font-face {
        font-family: OpenSans;
        font-weight: 200;
        font-style: normal;
        src: url('fonts/OpenSans/Medium/fingerprinted-OpenSans-Medium.eot?#iefix');
        src: url('fonts/OpenSans/Medium/fingerprinted-OpenSans-Medium.eot?#iefix') format('embedded-opentype'), url('fonts/OpenSans/Medium/fingerprinted-OpenSans-Medium.woff') format('woff'), url('fonts/OpenSans/Medium/fingerprinted-OpenSans-Medium.ttf') format('truetype'), url('fonts/OpenSans/Medium/fingerprinted-OpenSans-Medium.svg#OpenSans') format('svg');
      }
      `,
      'quoted-script-tag.html': `<script src="blahzorz-1.js"></script>`,
      'unquoted-script-tag.html': `<script src=blahzorz-1.js></script>`,
      'unquoted-url-in-styles.css': `.sample-img{width:50px;height:50px;background-image:url(images/fingerprinted-sample.png)}`,
    });
  })

  it('ignore option tell filter what files should not be processed', async function(){
    let inputNode = new fixture.Node({
      'ignore-this-file': `<script src="foo/bar/widget.js"></script>`,
      'quoted-script-tag.html': `<script src="foo/bar/widget.js"></script>`,
      'unquoted-script-tag.html': `<script src=foo/bar/widget.js></script>`,
      'unquoted-url-in-styles.css': `.sample-img{width:50px;height:50px;background-image:url(images/fingerprinted-sample.png)}`,
    });

    let node = new AssetRewrite(inputNode, {
      assetMap: {
        'foo/bar/widget.js': 'blahzorz-1.js',
        'images/sample.png': 'images/fingerprinted-sample.png',
      },
      ignore: ['ignore-this-file.html']
    });
    let outputHash = await fixture.build(node);
    assert.deepStrictEqual(outputHash, {
      'ignore-this-file': `<script src="foo/bar/widget.js"></script>`,
      'quoted-script-tag.html': `<script src="blahzorz-1.js"></script>`,
      'unquoted-script-tag.html': `<script src=blahzorz-1.js></script>`,
      'unquoted-url-in-styles.css': `.sample-img{width:50px;height:50px;background-image:url(images/fingerprinted-sample.png)}`,
    });
  });

  it('rewrites relative urls', async function() {
    let inputNode = new fixture.Node({
      'assets': {
        'url-in-styles.css': `.sample-img{width:50px;height:50px;background-image:url('images/foobar.png')}

        .sample-img2{width:50px;height:50px;background-image:url('./images/baz.png')}
        `
      },
      'quoted-script-tag.html': `<script src="foo/bar/widget.js"></script>`,
      'unquoted-script-tag.html': `<script src=foo/bar/widget.js></script>`,
      'unquoted-url-in-styles.css': `.sample-img{width:50px;height:50px;background-image:url(images/sample.png)}

      .sample-img2{width:50px;height:50px;background-image:url(./images/sample.png)}
      `,
    });
    let node = new AssetRewrite(inputNode, {
      assetMap: {
        'foo/bar/widget.js': 'blahzorz-1.js',
        'images/sample.png': 'images/fingerprinted-sample.png',
        'assets/images/foobar.png': 'assets/images/foobar-fingerprint.png',
        'assets/images/baz.png': 'assets/images/baz-fingerprint.png'
      }
    });

    let outputHash = await fixture.build(node);
    assert.deepStrictEqual(outputHash, {
      'assets': {
        'url-in-styles.css': `.sample-img{width:50px;height:50px;background-image:url('images/foobar-fingerprint.png')}

        .sample-img2{width:50px;height:50px;background-image:url('./images/baz-fingerprint.png')}
        `,
      },
      'quoted-script-tag.html': `<script src="blahzorz-1.js"></script>`,
      'unquoted-script-tag.html': `<script src=blahzorz-1.js></script>`,
      'unquoted-url-in-styles.css': `.sample-img{width:50px;height:50px;background-image:url(images/fingerprinted-sample.png)}

      .sample-img2{width:50px;height:50px;background-image:url(./images/fingerprinted-sample.png)}
      `,
    });
  });

  it('rewrites relative urls with prepend', async function() {
    let inputNode = new fixture.Node({
      'assets': {
        'no-fingerprint.html': `<script src="dont/fingerprint/me.js"></script>`,
        'url-in-styles.css': `.sample-img{width:50px;height:50px;background-image:url('images/foobar.png')}

        .sample-img2{width:50px;height:50px;background-image:url('../img/saturation.png')}
        `
      },
      'quoted-script-tag.html': `<script src="foo/bar/widget.js"></script>`,
      'unquoted-script-tag.html': `<script src=foo/bar/widget.js></script>`,
      'unquoted-url-in-styles.css': `.sample-img{width:50px;height:50px;background-image:url(images/sample.png)}`,
    });

    let node = new AssetRewrite(inputNode, {
      assetMap: {
        'foo/bar/widget.js': 'blahzorz-1.js',
        'dont/fingerprint/me.js': 'dont/fingerprint/me.js',
        'images/sample.png': 'images/fingerprinted-sample.png',
        'assets/images/foobar.png': 'assets/images/foobar-fingerprint.png',
        'img/saturation.png': 'assets/img/saturation-fingerprint.png'
      },
      prepend: 'https://cloudfront.net/'
    });
    let outputHash = await fixture.build(node);
    assert.deepStrictEqual(outputHash, {
      'assets': {
        'no-fingerprint.html': `<script src="https://cloudfront.net/dont/fingerprint/me.js"></script>`,
        'url-in-styles.css': `.sample-img{width:50px;height:50px;background-image:url('https://cloudfront.net/assets/images/foobar-fingerprint.png')}

        .sample-img2{width:50px;height:50px;background-image:url('https://cloudfront.net/assets/img/saturation-fingerprint.png')}
        `,
      },
      'quoted-script-tag.html': `<script src="https://cloudfront.net/blahzorz-1.js"></script>`,
      'unquoted-script-tag.html': `<script src=https://cloudfront.net/blahzorz-1.js></script>`,
      'unquoted-url-in-styles.css': `.sample-img{width:50px;height:50px;background-image:url(https://cloudfront.net/images/fingerprinted-sample.png)}`,
    });
  });

  it('replaces the correct match for the file extension', async function () {
    let inputNode = new fixture.Node({
      'styles.css': `@font-face {
        font-family: 'RobotoRegular';
        src: url('fonts/roboto-regular.eot');
        src: url('fonts/roboto-regular.eot?#iefix') format('embedded-opentype'),
          url('fonts/roboto-regular.woff2') format('woff2'),
          url('fonts/roboto-regular.woff') format('woff'),
          url('fonts/roboto-regular.ttf') format('truetype'),
          url('fonts/roboto-regular.svg#robotoregular') format('svg');
        font-weight: normal;
        font-style: normal;
      }
      `
    });

    let node = new AssetRewrite(inputNode, {
      assetMap: {
        'fonts/roboto-regular.eot': 'fonts/roboto-regular-f1.eot',
        'fonts/roboto-regular.woff': 'fonts/roboto-regular-f3.woff',
        'fonts/roboto-regular.ttf': 'fonts/roboto-regular-f4.ttf',
        'fonts/roboto-regular.svg': 'fonts/roboto-regular-f5.svg',
        'fonts/roboto-regular.woff2': 'fonts/roboto-regular-f2.woff2'
      }
    });

    let outputHash = await fixture.build(node);
    assert.deepStrictEqual(outputHash, {
      'styles.css': `@font-face {
        font-family: 'RobotoRegular';
        src: url('fonts/roboto-regular-f1.eot');
        src: url('fonts/roboto-regular-f1.eot?#iefix') format('embedded-opentype'),
          url('fonts/roboto-regular-f2.woff2') format('woff2'),
          url('fonts/roboto-regular-f3.woff') format('woff'),
          url('fonts/roboto-regular-f4.ttf') format('truetype'),
          url('fonts/roboto-regular-f5.svg#robotoregular') format('svg');
        font-weight: normal;
        font-style: normal;
      }
      `
    });
  });

  it('replaces source map URLs', async function () {
    let inputNode = new fixture.Node({
      'abs.js': `(function x(){return 42})//# sourceMappingURL=http://absolute.com/source.map`,
      'sample.js': `(function x(){return 42})//# sourceMappingURL=the.map`
    });

    let node = new AssetRewrite(inputNode, {
      replaceExtensions: ['js'],
      assetMap: {
        'the.map' : 'the-other-map',
        'http://absolute.com/source.map' : 'http://cdn.absolute.com/other-map'
      }
    });
    let outputHash = await fixture.build(node);
    assert.deepStrictEqual(outputHash, {
      'abs.js': `(function x(){return 42})//# sourceMappingURL=http://cdn.absolute.com/other-map`,
      'sample.js': `(function x(){return 42})//# sourceMappingURL=the-other-map`
    });
  });

  it('replaces source map URLs with prepend', async function () {
    let inputNode = new fixture.Node({
      'abs.js': `(function x(){return 42})//# sourceMappingURL=http://absolute.com/source.map`,
      'sample.js': `(function x(){return 42})//# sourceMappingURL=the.map`
    });

    let node = new AssetRewrite(inputNode, {
      replaceExtensions: ['js'],
      assetMap: {
        'the.map' : 'the-other-map',
        'http://absolute.com/source.map' : 'http://cdn.absolute.com/other-map'
      },
      prepend: 'https://cloudfront.net/'
    });
    let outputHash = await fixture.build(node);
    assert.deepStrictEqual(outputHash, {
      'abs.js': `(function x(){return 42})//# sourceMappingURL=http://cdn.absolute.com/other-map`,
      'sample.js': `(function x(){return 42})//# sourceMappingURL=https://cloudfront.net/the-other-map`
    });
  });

  it('maintains fragments', async function () {
    let inputNode = new fixture.Node({
      'svg-tag.html': `<svg><use xlink:href="/images/defs.svg#plus"></use></svg>`,
      'unquoted-url-in-styles.css': `.sample-img{width:50px;height:50px;background-image:url(/images/defs.svg#plus)}`
    });

    let node = new AssetRewrite(inputNode, {
      assetMap: {
        'images/defs.svg': 'images/fingerprinted-defs.svg'
      }
    });
    let outputHash = await fixture.build(node);
    assert.deepStrictEqual(outputHash, {
      'svg-tag.html': `<svg><use xlink:href="/images/fingerprinted-defs.svg#plus"></use></svg>`,
      'unquoted-url-in-styles.css': `.sample-img{width:50px;height:50px;background-image:url(/images/fingerprinted-defs.svg#plus)}`
    });
  });

  it('maintains fragments with prepend', async function () {
    let inputNode = new fixture.Node({
      'svg-tag.html': `<svg><use xlink:href="/images/defs.svg#plus"></use></svg>`,
      'unquoted-url-in-styles.css': `.sample-img{width:50px;height:50px;background-image:url(/images/defs.svg#plus)}`
    });

    let node = new AssetRewrite(inputNode, {
      assetMap: {
        'images/defs.svg': 'images/fingerprinted-defs.svg'
      },
      prepend: 'https://cloudfront.net/'
    });
    let outputHash = await fixture.build(node);
    assert.deepStrictEqual(outputHash, {
      'svg-tag.html': `<svg><use xlink:href="https://cloudfront.net/images/fingerprinted-defs.svg#plus"></use></svg>`,
      'unquoted-url-in-styles.css': `.sample-img{width:50px;height:50px;background-image:url(https://cloudfront.net/images/fingerprinted-defs.svg#plus)}`
    });
  });

  it('replaces absolute URLs with prepend', async function () {
    let inputNode = new fixture.Node({
      'img-tag.html': `<img src="/my-image.png">`,
      'no-fingerprint.html': `<script src="dont/fingerprint/me.js"></script>`,
      'unquoted-url-in-styles.css': `.sample-img{width:50px;height:50px;background-image:url(/my-image.png)}`
    });
    let node = new AssetRewrite(inputNode, {
      assetMap: {
        'my-image.png': 'my-image-fingerprinted.png',
        'dont/fingerprint/me.js': 'dont/fingerprint/me.js'
      },
      prepend: 'https://cloudfront.net/'
    });
    
    let outputHash = await fixture.build(node);
    assert.deepStrictEqual(outputHash, {
      'img-tag.html': `<img src="https://cloudfront.net/my-image-fingerprinted.png">`,
      'no-fingerprint.html': `<script src="https://cloudfront.net/dont/fingerprint/me.js"></script>`,
      'unquoted-url-in-styles.css': `.sample-img{width:50px;height:50px;background-image:url(https://cloudfront.net/my-image-fingerprinted.png)}`
    });
  });
  
  it('handles URLs with query parameters in them', async function () {
    let inputNode = new fixture.Node({
      'script-tag-with-query-parameters.html': `<script src="foo/bar/widget.js?hello=world"></script>
      <script src="foo/bar/widget.js?hello=world&amp;foo=bar"></script>
      <script src=foo/bar/widget.js?hello=world></script>
      <script src=foo/bar/widget.js?hello=world async></script>
      `
    });
    let node = new AssetRewrite(inputNode, {
      assetMap: {
        'foo/bar/widget.js': 'foo/bar/fingerprinted-widget.js',
        'script-tag-with-query-parameters.html': 'script-tag-with-query-parameters.html',
      },
    });
    let outputHash = await fixture.build(node);
    assert.deepStrictEqual(outputHash, {
      'script-tag-with-query-parameters.html': `<script src="foo/bar/fingerprinted-widget.js?hello=world"></script>
      <script src="foo/bar/fingerprinted-widget.js?hello=world&amp;foo=bar"></script>
      <script src=foo/bar/fingerprinted-widget.js?hello=world></script>
      <script src=foo/bar/fingerprinted-widget.js?hello=world async></script>
      `
    });
  });

  it('handles JavaScript files in a reasonable amount of time', async function () {
    this.timeout(500);
    let fixturePath = `${__dirname}/fixtures/js-perf`;
    let inputNode = new fixture.Node({
      'test-support.js': fs.readFileSync(`${fixturePath}/input/test-support.js`).toString()
    });

    let node = new AssetRewrite(inputNode, {
      assetMap: JSON.parse(fs.readFileSync(`${fixturePath}/asset-map.json`)),
      replaceExtensions: ['js'],
    });

    let outputHash = await fixture.build(node);
    assert.deepStrictEqual(outputHash, {
      'test-support.js': fs.readFileSync(`${fixturePath}/output/test-support.js`).toString()
    });
  });

  it('can optionally use caching', async function() {
    let fixturePath = `${__dirname}/fixtures/js-perf`;
    let inputPath = `${fixturePath}/input`;
    
    let node = new AssetRewrite(inputPath, {
      assetMap: JSON.parse(fs.readFileSync(`${fixturePath}/asset-map.json`)),
      replaceExtensions: ['js'],
      enableCaching: true
    });

    const fixtureBuilder = new fixture.Builder(node);

    const run1Start = process.hrtime()
    let outputHash = await fixtureBuilder.build(node);
    const run1End = process.hrtime(run1Start)
    assert.deepStrictEqual(outputHash, {
      'test-support.js': fs.readFileSync(`${fixturePath}/output/test-support.js`).toString()
    });

    const run2Start = process.hrtime()
    outputHash = await fixtureBuilder.build(node);
    const run2End = process.hrtime(run2Start);
    assert.deepStrictEqual(outputHash, {
      'test-support.js': fs.readFileSync(`${fixturePath}/output/test-support.js`).toString()
    });
    
    const run1DurationMs = (run1End[0] * 1000000000 + run1End[1]) / 1000000;
    const run2DurationMs = (run2End[0] * 1000000000 + run2End[1]) / 1000000;
    assert.ok(run2DurationMs < (run1DurationMs / 2), `cache should make second run (${run2DurationMs}ms) at least twice as fast as first run (${run1DurationMs}ms)`);
    fixtureBuilder.cleanup();
  });

  it('ignores JavaScript comments with URLs', async function () {
    let inputNode = new fixture.Node({
      'snippet.js': `/**
      here's some code.
      
      it does things.
      
      for example:
      
      \`\`\`app/app.js
      do not rewrite this snippet
      \`\`\`
      */
      (function x() { return true; })
      `
    });
    let node = new AssetRewrite(inputNode, {
      replaceExtensions: ['js'],
      assetMap: {
        'the.map': 'the-other-map',
        'app.js': 'http://cdn.absolute.com/app.js'
      },
      prepend: '/'
    });
    let outputHash = await fixture.build(node);
    assert.deepStrictEqual(outputHash, {
      'snippet.js': `/**
      here's some code.
      
      it does things.
      
      for example:
      
      \`\`\`app/app.js
      do not rewrite this snippet
      \`\`\`
      */
      (function x() { return true; })
      `
    });
  });
});
