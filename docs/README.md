# kwalitee
### Version 1.0.0-rc1

## Description

This package is designed to give a community biased and opinionated metric to packages on NPM.

Over time, the community has built up a series of best practices in regards to what constitutes great packaging on NPM. As a lot of these are practices are unwritten or unknown to new comers (or even old comers); this tool should provide them with a great way in which to incrementally improve their package for wider use by the community.

This module is **EXPECTED** to change over time, with new metrics, improved metrics and perhaps even complete reversal on metrics that may be considered bad in future.

The hope is that this information will be used by the NPM registry directly so that the "_kwalitee_" metric can be tracked over time and improve with community involvement.

> **NB**  The `kwalitee` package is "**self-hosting**". kwalitee is run against itself to ensure that it is held to it's own opinions.

Please see [Bugs](#Bugs) if you have questions or concerns about these metrics.

## Introduction

Use the kwalitee script with a path to a directory containing an NPM package. This directory _must_ contain a package.json file.

    kwalitee <path>
    
      Options:
        --help:       Display this usage information
        --verbose:    Display extended information about kwalitee scoring
        --no-color:   Don't display scoring information with color
        --parseable:  Print scoring information in a machine readable way

The default output from the script is a percentage based on the score of the package out of the possible scoring available. For a breakdown of how the scoring was put together, use the `verbose` flag to get a full listing.

### Checkers

Kwalitee uses a group of "checkers" to validate packages. These are broken out into functional aspects like so:

 * [Package](docs/checkers/Package.md): static checks based on package.json
 * [Tests](docs/checkers/Tests.md): checks based around package testing

## Additional

### Bugs

Please report any bugs, issues or feature requests to [the github repository](https://github.com/konobi/kwalitee/issues/) for the project. The project author and collaborators will be notified.

### Author

Scott "konobi" McWhirter (npm: konobi)

### Copyright & License

© 2015 Cloudtone and Contributors, All rights reserved.

This software package is released under the conditions of the **MIT** license. Please see the _"LICENSE"_ file distributed within this package for details.
