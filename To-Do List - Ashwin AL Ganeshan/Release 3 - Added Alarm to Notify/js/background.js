chrome.runtime.onStartup.addListener(function() {
  //var diff = Math.abs((new Date().getTime() - start_date.getTime()) / 1000);
});

chrome.alarms.onAlarm.addListener(function(alarms) {
  chrome.alarms.clear(alarms.name);

  var sp = alarms.name.split('_');

  alert('TO-DO ' + sp[2] + ' timeout reached!');
});
