Addon Checker
==============

This checker is used to assess various practices around native addon packages.

## addon_depends_on_nan_and_bindings **[2.0 or 4.0]**

The core node.js team have declared that using the "nan" and "bindings" package are the suggested way to handle developing and runtime use of native addons. Currently there may be addons that may need to use a mechanism other than "bindings" for loading the addon object, so you can score either half or full points for this check.

