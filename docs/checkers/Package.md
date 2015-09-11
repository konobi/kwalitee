Package Checker
==============

This checker is used to statically assess a package's **package.json** to ensure that it follows community best practices.

## packagename_does_not_include_node **[1.0]**

Node and NPM have commonly stated that it is redundant to use "node" in the name of a package, since it will be installed from a registry for node. The following patterns will be cause a negative scoring:
```
node-shinypackage
node_shinypackage
shinypackage-node
shinypackage_node
```

## packagename_does_not_include_js **[1.0]**

Node and NPM have commonly stated that it is redundant to use a "js" prefix or suffix in the name of a package, since it is a given that it is JS. The following patterns will be cause a negative scoring:
```
js-shinypackage
js_shinypackage
shinypackage-js
shinypackage_js
```

## package_has_repo **[1.0]**

Packages that are published to the NPM registry should have a repository assigned in package.json so that users can refer to commit history, changes, branches, etc.

(**NB:** This check does not currently check formatting of the repository, but over time, will be updated to check for specific formatting as NPM requires.)

## package_has_sufficient_description **[2.0]**

When browsing through the NPM registry, the description assigned in package.json is used to show the purpose of the package. Unfortunately, many authors provide little to no information in this description that is useful for users. This check makes sure that there is at least a reasonable description.

(**NB:** Currently this is a very simple check, however in the future it is expected that this will become more complex.)

## package_has_spdx_license **[3.0 or 4.0]**

NPM now expects the license field in package.json to match [SPDX specifications](http://spdx.org/) for license names. This check ensures that the license assigned in package.json is formatted appropriately, with extra credit for use of a license that is OSI approved.

## package_has_valid_semver **[6.0]**

The version field now needs to comply with the [Semantic Versioning](http://semver.org) specifications. Since this field is used for version comparisons for dependencies, etc. it is scored highly to encourage authors to switch to this versioning method as soon as possible.

## package_has_minimum_keywords **[2.0]**

Packages on the NPM registry use keywords assigned from the "keywords" fields for extra information for searching and to provide extra indicators as to a packages use. As many packages may have similar names but entirely different uses, we want to make sure that we have at least a few keywords for a package.

(**NB:** Currently the minimum is set at **3** keywords, but this may change in future. It is best to add as many appropriate keywords that you see fit to indicate your packages use.)

## package_has_author **[1.0]**

NPM prefers to have the package author to be defined in the package.json.

(**NB:** This currently only accepts the "object" format of a "person" and not the shorthand string version. This is based on a preference from NPM staff.)

## package_has_test_script **[5.0]**

Well tested packages are a great boon for users, however there are many different test frameworks all with different ways to invoke tests to be run. To help all users, we want to be able to run all applicable tests by invoking `npm test` for a package. This check ensures that the "test" npm script is defined in the package.json.


