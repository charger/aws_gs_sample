//http://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_GetMetricStatistics.html
function GetCloudWatchMetricStatistics(payload) {
  var service = 'monitoring'
  //var content_type = 'application/x-amz-json-1.0'
  var content_type = 'application/x-www-form-urlencoded'
  
  var t = new Date()
  var amz_date = (t.toISOString().slice(0,19) + 'Z').replace(/[-:]/g,"")
  var date_stamp = amz_date.substring(0,8) // Date w/o time, used in credential scope
  var region = 'us-east-1'
  var p = PropertiesService.getScriptProperties()
  var secret_access_key = p.getProperty('secret_access_key')
  var access_key_id = p.getProperty('access_key_id')
  var headers = { 'content_type': content_type, 'x-amz-date': amz_date, 'Accept': 'application/json' }

  payload["Action"] = "GetMetricStatistics"
  payload["AWSAccessKeyId"] = access_key_id
  payload["SignatureMethod"] = "HmacSHA256"
  payload["SignatureVersion"] = '4'
  payload["Version"] = '2010-08-01'
  
  var payload_str = arrToBody(payload)
  
  var payload_hash =  sha256Hash(payload_str);
  var canonical_headers = "content-type:" + content_type + "\n" + "host:monitoring.us-east-1.amazonaws.com" + "\n" + "x-amz-date:" + amz_date + '\n'
  var signed_headers = "content-type;host;x-amz-date"
  var canonical_request =
      "POST" + '\n' + //HTTPRequestMethod
       "/" + '\n' + //CanonicalURI
       "" + '\n' + //CanonicalQueryString
       canonical_headers + '\n' +
       signed_headers + '\n' + 
       payload_hash
  
  var algorithm = 'AWS4-HMAC-SHA256'
  var credential_scope = date_stamp + '/' + region + '/' + service + '/' + 'aws4_request'
  var string_to_sign = algorithm + '\n' +  amz_date + '\n' +  credential_scope + '\n' + sha256Hash(canonical_request)
  var signing_key = getSignatureKey(secret_access_key, date_stamp, region, service)
  var signature = sign(signing_key, string_to_sign, "HEX")
  
  var authorization_header = algorithm + ' ' + 'Credential=' + access_key_id + '/' + credential_scope + ', ' +  'SignedHeaders=' + signed_headers + ', ' + 'Signature=' + signature
  headers["Authorization"] = authorization_header

  var options =
  {
    "method" : "post",
    "contentType": content_type,
    "headers": headers,
    "payload" : payload_str,
    "muteHttpExceptions": true,
  };

  return UrlFetchApp.fetch("http://monitoring.us-east-1.amazonaws.com", options)
  }

function getSignatureKey(key, date_stamp, regionName, serviceName){
  kDate = sign('AWS4' + key, date_stamp, "TEXT")
  kRegion = sign(kDate, regionName, "HEX")
  kService = sign(kRegion, serviceName, "HEX")
  kSigning = sign(kService, 'aws4_request', "HEX")
  return kSigning
}

function sign(key, msg, key_type ) {
  var shaObj = new jsSHA('SHA-256', "TEXT");
  shaObj.setHMACKey(key, key_type);
  shaObj.update(msg);
  return shaObj.getHMAC("HEX");
}

function sha256Hash(data){
  var shaObj = new jsSHA("SHA-256", "TEXT");
  shaObj.update(data);
  return shaObj.getHash("HEX"); //B64, HEX, or BYTES
}

function arrToBody(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}
