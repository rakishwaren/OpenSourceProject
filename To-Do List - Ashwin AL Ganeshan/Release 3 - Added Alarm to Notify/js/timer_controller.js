/**
 *
 * @param {String} item
 * @param {String} duration
 */
function AddAlarm(item, duration) {
  chrome.alarms.create(item, {
    when: AddTime(duration)
  });
}

/**
 *
 * @param {String} name
 */
function RemoveAlarm(name) {
  chrome.alarms.clear(name, function(cleared) {});
}

/**
 *
 * @param {String} duration
 *
 * @returns {number}
 */
function AddTime(duration) {
  var start_date = new Date();

  switch (duration) {
    case '1m':
      start_date.setMinutes(start_date.getMinutes() + 1);
      break;

    case '5m':
      start_date.setMinutes(start_date.getMinutes() + 5);
      break;

    case '10m':
      start_date.setMinutes(start_date.getMinutes() + 10);
      break;

    case '30m':
      start_date.setMinutes(start_date.getMinutes() + 30);
      break;

    case '1h':
      start_date.setHours(start_date.getHours() + 1);
      break;

    case '4h':
      start_date.setHours(start_date.getHours() + 4);
      break;

    case '8h':
      start_date.setHours(start_date.getHours() + 8);
      break;

    case '1d':
      start_date.setDate(start_date.getDate() + 1);
      break;

    case '3d':
      start_date.setDate(start_date.getDate() + 3);
      break;

    case '1w':
      start_date.setDate(start_date.getDate() + 7);
      break;
  }

  return start_date.getTime();
}
