Changelog
=========

# 4.0.3

> 2022-07-12

Security update. Update archieml to v0.5 – thanks [@britthar](https://github.com/brittharr) ([PR #108](https://github.com/mhkeller/indian-ocean/pull/108)). Fix dbf tests returning a slightly different error message on empty.dbf.

* [35a19bbeb5d7951a06612a37f3b3ebd5288f174a](https://github.com/mhkeller/indian-ocean/commit/35a19bbeb5d7951a06612a37f3b3ebd5288f174a)
* [7a0437bc403c9b297102ae2fe075f13dd7d4c104](https://github.com/mhkeller/indian-ocean/commit/7a0437bc403c9b297102ae2fe075f13dd7d4c104)
* [4290fac565c5f269593dc222a745dcbc0a024173](https://github.com/mhkeller/indian-ocean/commit/4290fac565c5f269593dc222a745dcbc0a024173)
* [d8fb901cd792e9fb635546fa7ae9df1e3a4b67bd](https://github.com/mhkeller/indian-ocean/commit/d8fb901cd792e9fb635546fa7ae9df1e3a4b67bd)
* [ef4b92e2c30a39f16150e97fbb4c130394eaa0c9](https://github.com/mhkeller/indian-ocean/commit/ef4b92e2c30a39f16150e97fbb4c130394eaa0c9)
* [bc50626b5be89c910b51dc40bda2355e8277b784](https://github.com/mhkeller/indian-ocean/commit/bc50626b5be89c910b51dc40bda2355e8277b784)
* [3be6e1c82462609d2050188a09114a2b9da69341](https://github.com/mhkeller/indian-ocean/commit/3be6e1c82462609d2050188a09114a2b9da69341)
* [ad6374414dbeb085fa41bd01b75976cad7a78746](https://github.com/mhkeller/indian-ocean/commit/ad6374414dbeb085fa41bd01b75976cad7a78746)
* [01f3f7cc81f7e6e4e1874f21db7bee8a73bfb9f7](https://github.com/mhkeller/indian-ocean/commit/01f3f7cc81f7e6e4e1874f21db7bee8a73bfb9f7)
* [352fc80fe75b740e4e45e0bbb8136fd805a2ae8f](https://github.com/mhkeller/indian-ocean/commit/352fc80fe75b740e4e45e0bbb8136fd805a2ae8f)
* [75b2a9e8d66157654ab13bb233741cc8ca35376d](https://github.com/mhkeller/indian-ocean/commit/75b2a9e8d66157654ab13bb233741cc8ca35376d)

# 4.0.2

> 2021-03-17

Security update to fix some security alerts. Moves the dbf fork off of GitHub and onto a scoped npm package at @mhkeller/dbf

* [7ae3264e288ddf37c43f749c44fd7368bab63369](https://github.com/mhkeller/indian-ocean/commit/7ae3264e288ddf37c43f749c44fd7368bab63369)

# 4.0.0

> 2019-08-21

Removes a few functions that weren't really ever used. Strips BOM characters from CSVs and fixes a bug with double slashes sometimes when using `readdirFilter` functions.

* Remove YAML readers
  * [f0ca10e1b1f49662fbdd175c38016830a6e4f2c5](https://github.com/mhkeller/indian-ocean/commit/f0ca10e1b1f49662fbdd175c38016830a6e4f2c5)
  * [950280f50e0e4eaaa5f23fe56ea7c86714b2675c](https://github.com/mhkeller/indian-ocean/commit/950280f50e0e4eaaa5f23fe56ea7c86714b2675c)
  * [17d0b203e14f6c25922ce897657fb2b2503dcd88](https://github.com/mhkeller/indian-ocean/commit/17d0b203e14f6c25922ce897657fb2b2503dcd88)
  * [7a849ce97fd6b096b305609695f3c158a4d81196](https://github.com/mhkeller/indian-ocean/commit/7a849ce97fd6b096b305609695f3c158a4d81196)
  * [d717838c158e8e027d7258b2a31a2990c2395e50](https://github.com/mhkeller/indian-ocean/commit/d717838c158e8e027d7258b2a31a2990c2395e50)
* Remove `{ detailed: true }` option from `readdirFilter` functions
  * [3ed95d28524dbaf5ec8fedf2ad0ab4776976ae26](https://github.com/mhkeller/indian-ocean/commit/3ed95d28524dbaf5ec8fedf2ad0ab4776976ae26)
  * [c9c130955a1fee4d5dc844eab0416e6b7a332d1d](https://github.com/mhkeller/indian-ocean/commit/c9c130955a1fee4d5dc844eab0416e6b7a332d1d)
* Remove `extend` and `deepExtend` functions
  * [47c06001e8a48cb60e0655380c5844ede329a23d](https://github.com/mhkeller/indian-ocean/commit/47c06001e8a48cb60e0655380c5844ede329a23d)
  * [91cbeff745722b216d3b56131a44a800ef1ea227](https://github.com/mhkeller/indian-ocean/commit/91cbeff745722b216d3b56131a44a800ef1ea227)
* Remove double slashes on `readdirFilter` functions if input dir ends in a slash and `{ fullPath: true }`.
  * [440029a2265e94fb9b1ffc05a10b374392e2bf82](https://github.com/mhkeller/indian-ocean/commit/440029a2265e94fb9b1ffc05a10b374392e2bf82)
* Update test command for getter travis testing and travis-node versions
  * [8e4b23d1d71b137780aa80dc56909ed98e43a2db](https://github.com/mhkeller/indian-ocean/commit/8e4b23d1d71b137780aa80dc56909ed98e43a2db)
  * [0d76d1ce516c8b042f02e724989a1287974e73ab](https://github.com/mhkeller/indian-ocean/commit/0d76d1ce516c8b042f02e724989a1287974e73ab)
  * [5b97b8f8e00fe79c58c7ce8795728e4ffe1384d0](https://github.com/mhkeller/indian-ocean/commit/5b97b8f8e00fe79c58c7ce8795728e4ffe1384d0)
* File readers now strip BOM characters
  * [88ccb5a55bc9ab5ba40be5f8a86a266d11ff8a90](https://github.com/mhkeller/indian-ocean/commit/88ccb5a55bc9ab5ba40be5f8a86a266d11ff8a90)
  * [8bb2259d28dddd69bf95bc03806ffcb5dc7acac3](https://github.com/mhkeller/indian-ocean/commit/8bb2259d28dddd69bf95bc03806ffcb5dc7acac3)

# 3.1.0

> 2018-09-01

Add `verbose` option to `writeData` and `writeDataSync`, which allows you to turn off empty file warnings and also makes the error message more descriptive. Rename the dist output to be `.cjs.js` instead of `.node.js`. Add `skipHidden` and `detailed` options to `readdir` functions.

* Add verbose, closes [#77](https://github.com/mhkeller/indian-ocean/issues/77)
  * [2f2fff19a3282c559a18b502eba9262cef75fafd](https://github.com/mhkeller/indian-ocean/commit/2f2fff19a3282c559a18b502eba9262cef75fafd)
  * [2233598aa3ce4c6df17f1e39da4c397d1796e620](https://github.com/mhkeller/indian-ocean/commit/2233598aa3ce4c6df17f1e39da4c397d1796e620)
* Rename dist output, closes [#73](https://github.com/mhkeller/indian-ocean/issues/73)
  * [013fa6db847f46c984346b37674c232be44f3b5d](https://github.com/mhkeller/indian-ocean/commit/013fa6db847f46c984346b37674c232be44f3b5d)
* Add `skipHidden` option to readdir functions, closes [#76](https://github.com/mhkeller/indian-ocean/issues/76)
  * [cd616f92371ad16f9bae6eecdb6ab067c193cb93](https://github.com/mhkeller/indian-ocean/commit/cd616f92371ad16f9bae6eecdb6ab067c193cb93)
  * [dd0fec83660d101972b0daf1ee51a24f81844788](https://github.com/mhkeller/indian-ocean/commit/dd0fec83660d101972b0daf1ee51a24f81844788)
* Add `detailed` option to readdir functions, closes [#75](https://github.com/mhkeller/indian-ocean/issues/75)
  * [6d76f51f106d5212a6dc45617b0cd902ec6677ae](https://github.com/mhkeller/indian-ocean/commit/6d76f51f106d5212a6dc45617b0cd902ec6677ae)

# 3.0.1

> 2017-10-12

Small bug fix release. Puts `shapefile` library as an external dependency to fix an error on build. Also includes some small style tweaks to the docs, updates to the latest rollup, a few more tests and code coverage.

* Update rollup
  * [054858f23d918c546b25890350d852d658a740ae](https://github.com/mhkeller/indian-ocean/commit/054858f23d918c546b25890350d852d658a740ae)
  * [dd8dae624dbe0e566f186a507df7732c7e74cec8](https://github.com/mhkeller/indian-ocean/commit/dd8dae624dbe0e566f186a507df7732c7e74cec8)
  * [853354ada369d7e899ae56cb82b34229e49609d0](https://github.com/mhkeller/indian-ocean/commit/853354ada369d7e899ae56cb82b34229e49609d0)
* Code coverage
  * [853354ada369d7e899ae56cb82b34229e49609d0](https://github.com/mhkeller/indian-ocean/commit/853354ada369d7e899ae56cb82b34229e49609d0)
* Doc tweaks
  * [cf09315e20fdc8cddf576433d10a9b8cb75b5592](https://github.com/mhkeller/indian-ocean/commit/cf09315e20fdc8cddf576433d10a9b8cb75b5592)
  * [b4b34c9c08dcf183985fffc3e0a278e137796c60](https://github.com/mhkeller/indian-ocean/commit/b4b34c9c08dcf183985fffc3e0a278e137796c60)

# 3.0.0

> 2017-10-11

This is an exciting release because indian-ocean is now broken into es6 modules and brand new documentation. Adds a new `convertData` function which allows for converting from format to format. Aliases `makeDirs` to `makeDirectories` for less typing if you don't feel like typing. There's also an experimental browser bundle and some minor new features.

*This is a breaking change because it drops support below Node 3 and changes the API for `io.discernParser`*

* Support reading dbf files in `readData` by way of separating out file loading from file parsing.
  * [ef9702c6a7e3121956718c1971453835e20c7067](https://github.com/mhkeller/indian-ocean/commit/ef9702c6a7e3121956718c1971453835e20c7067)
* Parsers and formatters are now exposed as public functions
  * [8796820bd7a472f2561c9fff425c38120046201e](https://github.com/mhkeller/indian-ocean/commit/8796820bd7a472f2561c9fff425c38120046201e)
  * [0434c8c71fd7913c7e0991c51b45b8e2ae9f19b1](https://github.com/mhkeller/indian-ocean/commit/0434c8c71fd7913c7e0991c51b45b8e2ae9f19b1)
* Switch to es6 modules and bundle with rollup
  * [bffe689eaac19a3a399fcc832c721c44aba1178e](https://github.com/mhkeller/indian-ocean/commit/bffe689eaac19a3a399fcc832c721c44aba1178e)
  * [02ae3b7b0cfb02c86b05c2a02c29ab872a137d0d](https://github.com/mhkeller/indian-ocean/commit/02ae3b7b0cfb02c86b05c2a02c29ab872a137d0d)
  * [879d17131afe5e65357c1fbad8ca76171b2824e2](https://github.com/mhkeller/indian-ocean/commit/879d17131afe5e65357c1fbad8ca76171b2824e2)
  * [cb8281b5572634cb30a31b86806a3a058eca032e](https://github.com/mhkeller/indian-ocean/commit/cb8281b5572634cb30a31b86806a3a058eca032e)
* Also export a UMD bundle for the browser
  * [4ed78583c617f9cfe1f68949c30ae82db6d8c346](https://github.com/mhkeller/indian-ocean/commit/4ed78583c617f9cfe1f68949c30ae82db6d8c346)
* Thanks to @Rich-Harris, Typescript declarations are being added
  * [807e109c746e337ffb2497a14c6877734f63f28c](https://github.com/mhkeller/indian-ocean/commit/807e109c746e337ffb2497a14c6877734f63f28c)
  * [209646f39cd97b59cbc28ef2e4fb6472f31be9ab](https://github.com/mhkeller/indian-ocean/commit/209646f39cd97b59cbc28ef2e4fb6472f31be9ab)
* Add `convertData` function
  * [a52a6ca50219cbdb7347088b19b370b25e1929aa](https://github.com/mhkeller/indian-ocean/commit/a52a6ca50219cbdb7347088b19b370b25e1929aa)
  * [10e1f637735ff64f08514252fc8c8d308b5ca09b](https://github.com/mhkeller/indian-ocean/commit/10e1f637735ff64f08514252fc8c8d308b5ca09b)
  * [74c6855a88e1b7bfb31ff7ac086629faba98ee00](https://github.com/mhkeller/indian-ocean/commit/74c6855a88e1b7bfb31ff7ac086629faba98ee00)
  * [14606087f81b413a0801f259bd89269506d733c7](https://github.com/mhkeller/indian-ocean/commit/14606087f81b413a0801f259bd89269506d733c7)
  * [8ea37b45f779f390f042f4588b979d408f539779](https://github.com/mhkeller/indian-ocean/commit/8ea37b45f779f390f042f4588b979d408f539779)
  * [672ac65ce8672f4c9436fa0c0860c4fb530b3fa3](https://github.com/mhkeller/indian-ocean/commit/672ac65ce8672f4c9436fa0c0860c4fb530b3fa3)
  * [d9a8f2b66469df9ca22a4d28fb459a6f006c12fe](https://github.com/mhkeller/indian-ocean/commit/d9a8f2b66469df9ca22a4d28fb459a6f006c12fe)
  * [50a972e802a00e0676b8e41b641a39b300ab3c86](https://github.com/mhkeller/indian-ocean/commit/50a972e802a00e0676b8e41b641a39b300ab3c86)
* Add a test for extensions on dotfiles
  * [0acca323de329256fb0879c5cc1a6f105a1d3382](https://github.com/mhkeller/indian-ocean/commit/0acca323de329256fb0879c5cc1a6f105a1d3382)
* Fix tests on newer versions of node that handle JSON error reporting nicer. As a result remove the `json-parse` dependency and remove `nativeParser` option from JSON readers.
  * [4e0bd9ac1dbe62069242d3cc4b51748f4bdd8ed0](https://github.com/mhkeller/indian-ocean/commit/4e0bd9ac1dbe62069242d3cc4b51748f4bdd8ed0)
  * [53bfdbd29fb771133635afd5d208a9186b3f11cc](https://github.com/mhkeller/indian-ocean/commit/53bfdbd29fb771133635afd5d208a9186b3f11cc)
* Clean up dependencies
  * [efec2917264d3951a090bf025608e71b792c97f8](https://github.com/mhkeller/indian-ocean/commit/efec2917264d3951a090bf025608e71b792c97f8)
  * [1b91bb54dbf2d449d472ede92f8c6f882b5ba01b](https://github.com/mhkeller/indian-ocean/commit/1b91bb54dbf2d449d472ede92f8c6f882b5ba01b)
* Add .editorconfig and package-lock.json
  * [7d2a904b131d78f78c23baebd4d3a33e011f6382](https://github.com/mhkeller/indian-ocean/commit/7d2a904b131d78f78c23baebd4d3a33e011f6382)
  * [1a659c50f345078f6372f17b1ce173387d43d61f](https://github.com/mhkeller/indian-ocean/commit/1a659c50f345078f6372f17b1ce173387d43d61f)
* Defer to `fs.existsSync` since newer versions of node brought that back
  * [ca665bf07e4e4ec56e426cf4ab86cb81f8eabd63](https://github.com/mhkeller/indian-ocean/commit/ca665bf07e4e4ec56e426cf4ab86cb81f8eabd63)
* Don't delete keys off of options object. Fixes [#66](https://github.com/mhkeller/indian-ocean/issues/66).
  * [8a6ab3f60fd1ba885c1c198444613477de9b7ce8](https://github.com/mhkeller/indian-ocean/commit/8a6ab3f60fd1ba885c1c198444613477de9b7ce8)
  * [0aceac58d54eb4f20a6d421d4673a032a99605bf](https://github.com/mhkeller/indian-ocean/commit/0aceac58d54eb4f20a6d421d4673a032a99605bf)
  * [c46535a51a21d59e6c4aa724fd8a11a3ec46c8a2](https://github.com/mhkeller/indian-ocean/commit/c46535a51a21d59e6c4aa724fd8a11a3ec46c8a2)
* Rename `shorthandReaders` to `directReaders`. This only affects internal file paths and doc nomenclature
  * [64c62cc42a3ed4b852bcdb9995afa08a4ee2878b](https://github.com/mhkeller/indian-ocean/commit/64c62cc42a3ed4b852bcdb9995afa08a4ee2878b)
* New docs
  * [1eb69af239b3cfc86bef055c178957603dc562f8](https://github.com/mhkeller/indian-ocean/commit/1eb69af239b3cfc86bef055c178957603dc562f8)
  * [7cff646f26cf1a593d7093584ddb402874b2c0fe](https://github.com/mhkeller/indian-ocean/commit/7cff646f26cf1a593d7093584ddb402874b2c0fe)
  * [8db667b98e0e2d2583591c161c628fcca36f2234](https://github.com/mhkeller/indian-ocean/commit/8db667b98e0e2d2583591c161c628fcca36f2234)
  * [78f4ca3a9a301b8705af5f82b8bd77c1bdc189a3](https://github.com/mhkeller/indian-ocean/commit/78f4ca3a9a301b8705af5f82b8bd77c1bdc189a3)
  * [fb1e8f56eb8285a4f2df425d789512d656f9d236](https://github.com/mhkeller/indian-ocean/commit/fb1e8f56eb8285a4f2df425d789512d656f9d236)
  * [ad8855a20225c2cb54dc6cf36fd674affee5eefc](https://github.com/mhkeller/indian-ocean/commit/ad8855a20225c2cb54dc6cf36fd674affee5eefc)
  * [221173e34ccabda7c4f67f765aefec2553415dd5](https://github.com/mhkeller/indian-ocean/commit/221173e34ccabda7c4f67f765aefec2553415dd5)
  * [995d440eefdf4800a5de57ab84a7ba70e4366157](https://github.com/mhkeller/indian-ocean/commit/995d440eefdf4800a5de57ab84a7ba70e4366157)
  * [28d66bed085b92fee74c534f9fca85723c9a4872](https://github.com/mhkeller/indian-ocean/commit/28d66bed085b92fee74c534f9fca85723c9a4872)
  * [998620a85ecbebbec6f715c49a386245af990870](https://github.com/mhkeller/indian-ocean/commit/998620a85ecbebbec6f715c49a386245af990870)
  * [e87cb8b2dbd2c149226acb632da55cb26d5a0b72](https://github.com/mhkeller/indian-ocean/commit/e87cb8b2dbd2c149226acb632da55cb26d5a0b72)
  * [43e1bc0cd40fe0a54eafe4ff3dc1c79ccbe4c550](https://github.com/mhkeller/indian-ocean/commit/43e1bc0cd40fe0a54eafe4ff3dc1c79ccbe4c550)
  * [35c696c6420068a9dfe4b9455d47d1bcf45abc61](https://github.com/mhkeller/indian-ocean/commit/35c696c6420068a9dfe4b9455d47d1bcf45abc61)
  * [619acfa34f1f36334ea82c9278e770fd9d792363](https://github.com/mhkeller/indian-ocean/commit/619acfa34f1f36334ea82c9278e770fd9d792363)
  * [7b9ce9ae986745824e81c8d8efdecdfa63e878c5](https://github.com/mhkeller/indian-ocean/commit/7b9ce9ae986745824e81c8d8efdecdfa63e878c5)
  * [39076cdf47803d66d1af7c3730f4fe1957289f5e](https://github.com/mhkeller/indian-ocean/commit/39076cdf47803d66d1af7c3730f4fe1957289f5e)
  * [e297e8a3042337e7359ded77d4de1a9b86fa8ccb](https://github.com/mhkeller/indian-ocean/commit/e297e8a3042337e7359ded77d4de1a9b86fa8ccb)
  * [2c4ec09d44295412bda3ff9803bdc9db410bf1e7](https://github.com/mhkeller/indian-ocean/commit/2c4ec09d44295412bda3ff9803bdc9db410bf1e7)
* Better .npmignore
  * [98c0c2c89088336b7978f073c765a15b042f21f9](https://github.com/mhkeller/indian-ocean/commit/98c0c2c89088336b7978f073c765a15b042f21f9)
* Don't delete options from the options object
  * [8a6ab3f60fd1ba885c1c198444613477de9b7ce8](https://github.com/mhkeller/indian-ocean/commit/8a6ab3f60fd1ba885c1c198444613477de9b7ce8)
* Alias `makeDirs` option to `makeDirectories`
  * [14fbedec499a3ba42b6f0ad152143ba0600f127e](https://github.com/mhkeller/indian-ocean/commit/14fbedec499a3ba42b6f0ad152143ba0600f127e)
  * [3b4f6bc1694e6d34ab32679bd07edc6030ed40ab](https://github.com/mhkeller/indian-ocean/commit/3b4f6bc1694e6d34ab32679bd07edc6030ed40ab)
* Clean up `discernParser` API. Fixes [#63](https://github.com/mhkeller/indian-ocean/issues/63).
  * [0a5469cc08a1975e3546d443425b222d00012301](https://github.com/mhkeller/indian-ocean/commit/0a5469cc08a1975e3546d443425b222d00012301)

# 2.0.2

> 2017-02-08

* Fix having the callback called inside of the try block
  * [5ffd5a89d5d179bc741543ae4ffc9978658cf894](https://github.com/mhkeller/indian-ocean/commit/5ffd5a89d5d179bc741543ae4ffc9978658cf894)

# 2.0.1

> 2016-11-02

* Fix docs to print custom argument names
  * [5260f6d606b40d0ce89b8f48ad73fd6f6f0e1164](https://github.com/mhkeller/indian-ocean/commit/5260f6d606b40d0ce89b8f48ad73fd6f6f0e1164)

# 2.0.0

> 2016-10-30

* Add tests and allow for parser options
  * [af12b04932cad2d99c2a6403845143c1e13c9643](https://github.com/mhkeller/indian-ocean/commit/af12b04932cad2d99c2a6403845143c1e13c9643)
  * [499cd2e9bab004eb7f83737d5abdd35107216e95](https://github.com/mhkeller/indian-ocean/commit/499cd2e9bab004eb7f83737d5abdd35107216e95)
  * [e43ac2ea55d2574d0352171a070be3b01b71a8b3](https://github.com/mhkeller/indian-ocean/commit/e43ac2ea55d2574d0352171a070be3b01b71a8b3)
  * [79eba7baf184385b22db5a3055ca8daa8f0490b5](https://github.com/mhkeller/indian-ocean/commit/79eba7baf184385b22db5a3055ca8daa8f0490b5)
  * [8a3752b8d96b54b5f65d7871c4fa3b1c5ff32d91](https://github.com/mhkeller/indian-ocean/commit/8a3752b8d96b54b5f65d7871c4fa3b1c5ff32d91)
  * [f30f8551f99c35995fdfeddd9fdee406ae907583](https://github.com/mhkeller/indian-ocean/commit/f30f8551f99c35995fdfeddd9fdee406ae907583)
  * [d17597b55979ae02fd8f1e67698cdd4f040d82a1](https://github.com/mhkeller/indian-ocean/commit/d17597b55979ae02fd8f1e67698cdd4f040d82a1)
  * [1f8779e35be40b156d8d2b9f17b3a4b0c35baf6f](https://github.com/mhkeller/indian-ocean/commit/1f8779e35be40b156d8d2b9f17b3a4b0c35baf6f)
  * [cf7cb58b38522831c75f1ffd6a19cdf08f94e142](https://github.com/mhkeller/indian-ocean/commit/cf7cb58b38522831c75f1ffd6a19cdf08f94e142)
  * [b3cb85af2b02a208d4d2cc5a3dfa09375c66dbf0](https://github.com/mhkeller/indian-ocean/commit/b3cb85af2b02a208d4d2cc5a3dfa09375c66dbf0)
  * [c98cb5df4a590cc54378c9b63b13ac7c55565328](https://github.com/mhkeller/indian-ocean/commit/c98cb5df4a590cc54378c9b63b13ac7c55565328)
  * [705a3d395f480548447ca42ad91c37ced447dfd1](https://github.com/mhkeller/indian-ocean/commit/705a3d395f480548447ca42ad91c37ced447dfd1)
  * [9b3c9f1f04f386faf6effd2b615e97d0078d2a8e](https://github.com/mhkeller/indian-ocean/commit/9b3c9f1f04f386faf6effd2b615e97d0078d2a8e)
  * [b79c0bdbff90bc9ca1b0526dff9faed454aff55f](https://github.com/mhkeller/indian-ocean/commit/b79c0bdbff90bc9ca1b0526dff9faed454aff55f)
  * [977194ab87e4f296b57be8c7bd3733c4dd18fae3](https://github.com/mhkeller/indian-ocean/commit/977194ab87e4f296b57be8c7bd3733c4dd18fae3)
  * [0880df4abb46cd7a585ca3527a3b5f91ec7640bb](https://github.com/mhkeller/indian-ocean/commit/0880df4abb46cd7a585ca3527a3b5f91ec7640bb)
* Internal: Improve doc workflow, update travis versions
  * [355f0c7fd1b837773185c98d3bc12266f8c85cff](https://github.com/mhkeller/indian-ocean/commit/355f0c7fd1b837773185c98d3bc12266f8c85cff)
  * [cf1eb24492dfdcf1533436882e1fcbda81ed5ce6](https://github.com/mhkeller/indian-ocean/commit/cf1eb24492dfdcf1533436882e1fcbda81ed5ce6)
  * [be5119509369aad3f1d3060ab176459be9edad06](https://github.com/mhkeller/indian-ocean/commit/be5119509369aad3f1d3060ab176459be9edad06)
  * [0e9579a348cfa23ff45c0a4f70f99fb1827d60ca](https://github.com/mhkeller/indian-ocean/commit/0e9579a348cfa23ff45c0a4f70f99fb1827d60ca)
  * [9edd0dd283823fbcad5efdeab4602040ee6f8b25](https://github.com/mhkeller/indian-ocean/commit/9edd0dd283823fbcad5efdeab4602040ee6f8b25)
  * [2c7faf5b7ab3a3a89f8cae8ed17e8fa017918270](https://github.com/mhkeller/indian-ocean/commit/2c7faf5b7ab3a3a89f8cae8ed17e8fa017918270)
* Add `.npmignore`
  * [a9815dbe63acee401d77b1ff3705d33f7ae928ac](https://github.com/mhkeller/indian-ocean/commit/a9815dbe63acee401d77b1ff3705d33f7ae928ac)
* Better edge cases for empty files
  * [ff1269e6bcb0131c99ff1e07b5abc4cf4efe5b9b](https://github.com/mhkeller/indian-ocean/commit/ff1269e6bcb0131c99ff1e07b5abc4cf4efe5b9b)
* Allow for deferring to native json parsing
  * [570e6a9b5727110eb8c8d2e7e130040ec5918d31](https://github.com/mhkeller/indian-ocean/commit/570e6a9b5727110eb8c8d2e7e130040ec5918d31)
  * Expose parsers and formatters
* *Breaking changes*
  * Custom delimiters passed to `helpers.discernParser` no longer need to be in an object.
    * Old usage `io.discernParser(null, {delimiter: '_'})`
    * New usage `io.discernParser(null, '_')`
  * Renamed functions
    * `extensionMatches` -> `extMatchesStr`

# 1.1.1

> 2016-02-18

* Fix typo when writing out a file we don't have a parser for
  * [dc422b2f9c3013b0a58272104db536380e559472](https://github.com/mhkeller/indian-ocean/commit/dc422b2f9c3013b0a58272104db536380e559472)

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
