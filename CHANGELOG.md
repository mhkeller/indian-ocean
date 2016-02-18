Changelog
=========

# 1.1.0

> 2016-02-17

* In writeData functions, rename the option `parseWith` to `parser`, while keeping legacy support
  * [11c3bab4f8a0d82e360b1eaad1d2d949b75d1876](https://github.com/mhkeller/indian-ocean/commit/11c3bab4f8a0d82e360b1eaad1d2d949b75d1876)
* Return data when writing out or appending
  * [c430b339c1aa1a6971d8dff25a4c1d3bab6288b3](https://github.com/mhkeller/indian-ocean/commit/c430b339c1aa1a6971d8dff25a4c1d3bab6288b3)
* Better error messages and checks if user attemps writing an object to a dsv since those formats require a list
  * [71cd65b8b40e4846ff389dd5254deff965149877](https://github.com/mhkeller/indian-ocean/commit/71cd65b8b40e4846ff389dd5254deff965149877)
  * [34132d18e401b14c8a7e50d1574cea183547c067](https://github.com/mhkeller/indian-ocean/commit/34132d18e401b14c8a7e50d1574cea183547c067)
* Tests for exists functions
  * [a17643f9a833e109695026d04aa6fad359eff725](https://github.com/mhkeller/indian-ocean/commit/a17643f9a833e109695026d04aa6fad359eff725)
* Add extend, deepExtend and tests for them
  * [cb3fcd6cae66800b1508995729178066a9cc47c3](https://github.com/mhkeller/indian-ocean/commit/cb3fcd6cae66800b1508995729178066a9cc47c3)
  * [c65b78af78508a0ba24bbcf42a1c6639f0bcd3fd](https://github.com/mhkeller/indian-ocean/commit/c65b78af78508a0ba24bbcf42a1c6639f0bcd3fd)
  * [03b05bdb35d84868359c77b8734326352ea7f784](https://github.com/mhkeller/indian-ocean/commit/03b05bdb35d84868359c77b8734326352ea7f784)
* Fix docs css
  * [3da6b4bf412a0169b69cb23f0e1baf256f9152f8](https://github.com/mhkeller/indian-ocean/commit/3da6b4bf412a0169b69cb23f0e1baf256f9152f8)
  * [f7e90b2b932fb7abc964ec7909ebf8ab02a2cd8f](https://github.com/mhkeller/indian-ocean/commit/f7e90b2b932fb7abc964ec7909ebf8ab02a2cd8f)
* Update documentation with yaml on supported list of doc writers
  * [09bf0d33cb95aae0be3b1bf4cc94cb68561c1009](https://github.com/mhkeller/indian-ocean/commit/09bf0d33cb95aae0be3b1bf4cc94cb68561c1009)
* Rename `writeDbfToData` as `convertDbfToData`
  * [98e1d51357e3ff4858a98c3cfda65ec37a859a24](https://github.com/mhkeller/indian-ocean/commit/98e1d51357e3ff4858a98c3cfda65ec37a859a24)
* Add [ArchieML support](http://archieml.org/)
  * [38cabddc6b0804684b1acedb962fbd33882e6fde](https://github.com/mhkeller/indian-ocean/commit/38cabddc6b0804684b1acedb962fbd33882e6fde)
  * [586ef9c943866983961e30cca3a030ec03145d6a](https://github.com/mhkeller/indian-ocean/commit/586ef9c943866983961e30cca3a030ec03145d6a)
* Fix type checking bug when no options are passed to `readdir` functions
  * [d3193a2172931e64423c5b97ce3fbdae74651da2](https://github.com/mhkeller/indian-ocean/commit/d3193a2172931e64423c5b97ce3fbdae74651da2)


# 1.0.3

> 2015-12-04

* When attempting to read an empty file as json, set it to `'[]'` so it will be parsed as an empty list.
  * [c2d11999a1bf60c07707b7b9cc09a68151cfc63c](https://github.com/mhkeller/indian-ocean/commit/c2d11999a1bf60c07707b7b9cc09a68151cfc63c)

# 1.0.2

> 2015-11-30

* Use `===` instead of `==` for code style
  * [da27bfc3bcd4100ca90ab958666efe2556da1216](https://github.com/mhkeller/indian-ocean/commit/da27bfc3bcd4100ca90ab958666efe2556da1216)

# 1.0.1

> 2015-11-30

* Actually fill out the `exists` function
  * [3861d351a2c741c2cdad7612cf382f995da3e3cd](https://github.com/mhkeller/indian-ocean/commit/3861d351a2c741c2cdad7612cf382f995da3e3cd)

# 1.0.0

> 2015-11-16

* Make all options configurable via object parameters instead of arguments
  * Closes [#34](https://github.com/mhkeller/indian-ocean/issues/34)
  * [930381a0ae260779bf8a5a2cd023b08a75267012](https://github.com/mhkeller/indian-ocean/commit/930381a0ae260779bf8a5a2cd023b08a75267012)
* Combine `readdirInclude` and `readdirExlude` functions into `readdirFilter` and `readdirFilterSync`
  * Closes [#36](https://github.com/mhkeller/indian-ocean/issues/36) and [#38](https://github.com/mhkeller/indian-ocean/issues/38)
  * [155a9e692e16ff7a7f8dcd55005af91ec3dabef3](https://github.com/mhkeller/indian-ocean/commit/155a9e692e16ff7a7f8dcd55005af91ec3dabef3)
  * [5a6e59a491d63f9caf87529957de73eeb6ae75bb](https://github.com/mhkeller/indian-ocean/commit/5a6e59a491d63f9caf87529957de73eeb6ae75bb)
  * [fea54208dbfd5fdd20c6197458bd5c09ca0c6bcb](https://github.com/mhkeller/indian-ocean/commit/fea54208dbfd5fdd20c6197458bd5c09ca0c6bcb)
  * [32615fb0bbb5a771d4d36fb5aa0902e335d3e85e](https://github.com/mhkeller/indian-ocean/commit/32615fb0bbb5a771d4d36fb5aa0902e335d3e85e)
  * [e9ce3f65618d0d8abb53d6bcb904851e46384b44](https://github.com/mhkeller/indian-ocean/commit/e9ce3f65618d0d8abb53d6bcb904851e46384b44)
  * [750a149accfd68e17a803b18ecb20952a6d251f0](https://github.com/mhkeller/indian-ocean/commit/750a149accfd68e17a803b18ecb20952a6d251f0)
  * [174aefd7b02b6c584619d8cd4a364da67b04718c](https://github.com/mhkeller/indian-ocean/commit/174aefd7b02b6c584619d8cd4a364da67b04718c)
* Add `skipFiles` and `skipDirectories` options to from `readdirFilter` functions
  * Closes [#37](https://github.com/mhkeller/indian-ocean/issues/37)
  * [86308952c744186e7be5b394f08adc27c27ecaec](https://github.com/mhkeller/indian-ocean/commit/86308952c744186e7be5b394f08adc27c27ecaec)
* Fall back to writing text if file format is unknown
  * Closes [#35](https://github.com/mhkeller/indian-ocean/issues/35)
  * [32469da3b21dfc5c3b855a9105bd3376a470b999](https://github.com/mhkeller/indian-ocean/commit/32469da3b21dfc5c3b855a9105bd3376a470b999)
* Create intermediate directories via config flag when writing or appending data
  * Closes [#27](https://github.com/mhkeller/indian-ocean/issues/27)
  * [6a93e43e0e177b3a0c7cf5376e14b252bcc48383](https://github.com/mhkeller/indian-ocean/commit/6a93e43e0e177b3a0c7cf5376e14b252bcc48383)
  * [1aa7c3979ff812bce4b455cca14abf139f526b14](https://github.com/mhkeller/indian-ocean/commit/1aa7c3979ff812bce4b455cca14abf139f526b14)
* Support writing dbf files
  * Closes [#1](https://github.com/mhkeller/indian-ocean/issues/1)
  * [30d24244177e7c1cef03dd06ef853f6e85bf5b9a](https://github.com/mhkeller/indian-ocean/commit/30d24244177e7c1cef03dd06ef853f6e85bf5b9a)

# 0.7.2

> 2015-09-16

* NPM had an error publishing to it. Bumped version and republished.

# 0.7.1

> 2015-09-16

* Fix missing dependencies
  * Via [#32](https://github.com/mhkeller/indian-ocean/pull/32)

# 0.7.0

> 2015-09-13

* Add support for reading `txt` files both explicitly and as a fallback for when we don't have a supported parser
  * Closes [#5](https://github.com/mhkeller/indian-ocean/issues/5)
  * [89d6b5515ad13c8636ab3e8201258e850563c77f](https://github.com/mhkeller/indian-ocean/commit/89d6b5515ad13c8636ab3e8201258e850563c77f)
* Refactor library by delegating all `read` functions to `readData` / `readDataSync`, which now take parameters to parse with a given parser, not just a given delimiter
  * [33e8cb6e83aad294fe2d508e607570dd1353381b](https://github.com/mhkeller/indian-ocean/commit/33e8cb6e83aad294fe2d508e607570dd1353381b)
* Various documentation fixes
* Yaml read/write support
  * [0ea2f9d2dc81ab7481987ab8feecc4c7efd8ead2](https://github.com/mhkeller/indian-ocean/commit/0ea2f9d2dc81ab7481987ab8feecc4c7efd8ead2)

# 0.6.0

> 2015-09-07

* Add ability for `readdir` functions to take regexes
  * [44bfb9e01c70f7ab856582b48bc93c581dd8c69b](https://github.com/mhkeller/indian-ocean/commit/44bfb9e01c70f7ab856582b48bc93c581dd8c69b)
* Refactor `readdir` functions to call a common function with options.
  * [84e8edf68501b16e75ef59aeaae7fcb42ca46b9d](https://github.com/mhkeller/indian-ocean/commit/84e8edf68501b16e75ef59aeaae7fcb42ca46b9d)
* More stringent tests

# 0.5.0

> 2015-09-01

* Add `exists` and `existsSync` fs
  * [fcbf2b7699287563179bc5919f297cdc85ecf194](https://github.com/mhkeller/indian-ocean/commit/fcbf2b7699287563179bc5919f297cdc85ecf194)
  * [a2e3f415018f85e1c5abb3083fa3753d41b5b52b](https://github.com/mhkeller/indian-ocean/commit/a2e3f415018f85e1c5abb3083fa3753d41b5b52b)
  * [078a22ac995c12364c82c0d47331d250006a01f2](https://github.com/mhkeller/indian-ocean/commit/078a22ac995c12364c82c0d47331d250006a01f2)
* Higher contrast doc theme
  * [be4e73d1f8ac393499ba022f688a3e294c2b6d9a](https://github.com/mhkeller/indian-ocean/commit/be4e73d1f8ac393499ba022f688a3e294c2b6d9a)
* Add Standard JS Style Image
  * [72d586e5ba1359ae797f34ef1dff79ea11a9c9f4](https://github.com/mhkeller/indian-ocean/commit/72d586e5ba1359ae797f34ef1dff79ea11a9c9f4)
* Various travis integration improvements
* Various documentation improvements
* Every function now has an example in documentation
* Tests for readdirInclude and Exclude
  * [65c13281ea6edc099d93c675789cec6f94fe7f6d](https://github.com/mhkeller/indian-ocean/commit/65c13281ea6edc099d93c675789cec6f94fe7f6d)
  * [7e0c8a109a94894c73a78bf8069817c7e5cf2e62](https://github.com/mhkeller/indian-ocean/commit/7e0c8a109a94894c73a78bf8069817c7e5cf2e62)
* Better error messaging when parsing malformed JSON
  * [e905bd0f7be3f0eec47ef8d018204c32b8f16981](https://github.com/mhkeller/indian-ocean/commit/e905bd0f7be3f0eec47ef8d018204c32b8f16981)
* Created Changelog