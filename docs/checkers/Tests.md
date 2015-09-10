Tests Checker
==============

This checker is used to assess various practices around testing for packages.

## test_folder_exists **[10.0]**

Within the package there should be a folder "test" that contains test scripts and data for the package. The decision of the name is based on what is currently most common on the NPM registry. Use of a folder is preferred for simple separation of concerns.

## test_script_is_not_default **[10.0]**

When initially creating a package using `npm init`, a default "test" script is inserted into package.json. This check ensures that the script has been changed from this spurious default.

