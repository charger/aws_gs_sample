# aws_gs_sample
Bare example how import data from AWS Cloudwatch (GetMetricStatistics) using Google Script. AWS JS SDK doesn't work in Google Script because ASD rely on object like `windows` and Google Script doesn't provide such object.

# Installation
* Open [this spreadsheet](https://docs.google.com/spreadsheets/d/1mNV9S_sp7IER28lOo389GHjdR0dFaCb0DTdE_8PzCJM)
* `File` -> `Create copy`
* `Tools` -> `Script editor`
* in script editor `File` -> `Project properties` -> tab `Script properties`
* add rows `access_key_id` and `secret_access_key` with your credentials

# Run
* specify your details in `code.gs` by setting variable `payload`
* run function `dataFromCloudWatch` and then open `View`->`Execution transription` to read results.
* you can change script and write result data to spreadsheet, if you want.
