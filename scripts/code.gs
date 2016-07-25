// required "access_key_id" and "secret_access_key" script properties in "Project properties"

function dataFromCloudWatch() {
  last = new Date( "7/23/2016 21:52:00" )
  now = new Date()
  var dif_sec = Math.floor((now.getTime() - last.getTime())/1000).toString(10);

  var payload = {
    "Namespace" : "LogMetrics",
    "MetricName" : "Timeouts",
    "StartTime": last.format('isoDateTime') + 'Z',
    "EndTime": now.format('isoDateTime') + 'Z',
    "Period": 300,
    "Statistics.member.1": "SampleCount",
    "Unit": "None",
  };
  var response = GetCloudWatchMetricStatistics(payload)
  
  Logger.log(payload)
  Logger.log(response)
}
