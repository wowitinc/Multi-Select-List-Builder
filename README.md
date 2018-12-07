# Multi-Select-List-Builder (using Bootstrap 4)  
**MSLB allows customisation of master list entries in addition to selection of elements for current use.**  

**This project is licensed under the terms of the MIT license.**  
**NOTE: At time of publishing, only Chrome has been validated.  Other browser validation is in progress.**

## Demo:
See it work, **[click here for the demo.](https://wowitinc.github.io/Multi-Select-List-Builder/source/index.html)**  

## Overview:
Three lists are displayed:
  1. Master list ("Status List") - customisable list of all possible selections
  1. Current list ("Calculations") - elements chosed from the master list for current use
  1. Reporting list ("Reporting Categories") - naming convention to represent the elements in the current list (multiple elements can be combined in the current list but represented with one description in the reporting list).  
![alt text](https://wowitinc.github.io/Multi-Select-List-Builder/source/images/MSLB.jpg "MSLB main page")
## Installation:
Folder Structure:
  1. Root folder, file = "index.html"
  1. Folder = "images", files = "favicon.ico" and "wowit.jpg"
  1. Folder = "scripts", file = "app.js"
  1. Folder = "styles", file = "styles.css"  

Dependencies:
  1. Bootstrap 4, Version: 4.0.0
  1. Font Awesome, Version: 5.0.9
  1. jQuery, Version: 3.3.1
  1. jQuery CSV, Version: 0.8.9
  1. HTML5 expected
## Usage:
  1. The Master list ("Status List") contains a default selection of entries but is customisable (Add / Delete entries).
  1. The Current list ("Calculations") is populated from the Master list either by single element or selecting all.  In addition, single elements from the Master list can be added together (using the Plus button) for population in the Current list.
  1. The Reporting list ("Reporting Categories") also contains a default selection of entries and is customisable (Add / Delete entries).  The Reporting list allows for different terms to be used to represent the selections in the Current list.  NOTE: There must be the same number of list elements in the Current list as in the Reporting list.
  1. The customised lists can be saved (CSV file) locally and later uploaded again for re-use.
  1. All warning / information / error messages are written to the console.  
## License:
This project is licensed under the terms of the MIT license.  
WOWIT Enterprises Inc. - D Woodworth
