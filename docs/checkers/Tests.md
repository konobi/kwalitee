Tests Checker
==============

This checker is used to assess various practices around testing for packages.

## package_json_has_directories_test **[10.0]**

Package.json should have the "directories.test" key, which should point to the directory containing the test scripts and data for the package. 

## test_folder_exists **[10.0]**

The folder specified by package.json's "directories.test" should exist. If it doesn't, the directory "test" is used as a default.

## test_script_is_not_default **[10.0]**

When initially creating a package using `npm init`, a default "test" script is inserted into package.json. This check ensures that the script has been changed from this spurious default.

