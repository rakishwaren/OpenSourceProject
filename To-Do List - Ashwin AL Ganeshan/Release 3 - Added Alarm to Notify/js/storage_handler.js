var container = document.getElementById('do_list');
var counter = document.getElementById('total_reminders');
var del_btn = document.getElementById('del_do');
var add_btn = document.getElementById('add_do');
var store = localStorage;

function getList() {
  var data = JSON.parse(store.to_do).data;

  container_refresh(data);
}

/**
 *
 * @param {number} position
 */
function removeNode(position) {
  var data = JSON.parse(store.to_do).data;

  chrome.alarms.get('alarm_' + data[position].t + '_' + position, function(
    alarm
  ) {
    if (alarm != null) {
      chrome.alarms.clear('alarm_' + data[position].t + '_' + position);
    }
  });

  data.splice(position, 1);

  store.to_do = JSON.stringify({ data: data });
  container_refresh(data);
  counter.innerText = this.getLength();
}

/**
 *
 * @param {number} position
 */
function setDone(position) {
  var data = JSON.parse(store.to_do).data;

  data[position].done = true;

  store.to_do = JSON.stringify({ data: data });
  container_refresh(data);

  chrome.alarms.get('alarm_' + data[position].t + '_' + position, function(
    alarm
  ) {
    if (alarm != null) {
      chrome.alarms.clear('alarm_' + data[position].t + '_' + position);
    }
  });
}

/**
 *
 * @param {number} position
 * @returns {Object}
 */
function getSpecificNode(position) {
  var data = JSON.parse(store.to_do).data;

  return data[position];
}

/**
 *
 * @param {String} title
 * @param {String} desc
 * @param {number} priority
 * @param {String} time
 */
function setList(title, desc, priority, time) {
  var data = JSON.parse(store.to_do).data;
  var now_time = NowDateTime();
  data.push({
    t: title,
    d: desc,
    p: priority,
    duration: time,
    start: now_time,
    done: false
  });

  store.to_do = JSON.stringify({ data: data });
  container_refresh(data);
  counter.innerText = this.getLength();

  if (time != 'no') {
    AddAlarm('alarm_' + (data.length - 1) + '_' + title, time);
  }
}

/**
 * @returns {number}
 */
function getLength() {
  return JSON.parse(store.to_do).data.length;
}

function init() {
  if ('to_do' in store) {
    var data = JSON.parse(store.to_do).data;

    if (data.length > 0) {
      container_refresh(data);
    } else {
      container.innerHTML =
        '<div class="text-center text-danger">No TO-DO Added!</div>';
    }
  } else {
    store.to_do = JSON.stringify({ data: [] });
    container.innerHTML =
      '<div class="text-center text-danger">No TO-DO Added!</div>';
  }
}

/**
 *
 * @param {Array} new_data
 */
function container_refresh(new_data) {
  if (container.hasChildNodes()) container.innerHTML = '';

  if (new_data.length > 0) {
    for (var i = 0; i < new_data.length; i++) {
      var priority = new_data[i].p;

      var txt_priority =
        priority == 1 ? 'High' : priority == 2 ? 'Medium' : 'Low';

      var code_priority =
        priority == 1
          ? 'bg-danger'
          : priority == 2
          ? 'bg-warning'
          : 'bg-success';

      var parent_card = document.createElement('div');
      parent_card.setAttribute(
        'class',
        'card text-white mb-2 ' + code_priority
      );
      parent_card.setAttribute('do-id', i);

      var card_header = document.createElement('div');
      card_header.setAttribute('class', 'card-header');

      var links = document.createElement('a');
      links.setAttribute('class', 'card-link text-white mr-auto');
      links.setAttribute('data-toggle', 'collapse');
      links.setAttribute('href', '#coll_' + i);
      links.setAttribute('id', 'to_do_link_' + i);
      links.innerText = new_data[i].t + ' (Priority: ' + txt_priority + ')';

      var link_content = document.createElement('div');
      link_content.setAttribute('class', 'd-flex');

      var checkbox_container = document.createElement('div');
      checkbox_container.setAttribute(
        'class',
        'custom-control custom-checkbox'
      );

      var checkbox = document.createElement('input');
      checkbox.setAttribute('type', 'checkbox');
      checkbox.setAttribute('class', 'custom-control-input');
      checkbox.setAttribute('id', 'check_' + i);

      if (new_data[i].done == true) {
        checkbox.setAttribute('checked', 'checked');
        checkbox.setAttribute('disabled', 'disabled');
      }

      var labels = document.createElement('label');
      labels.setAttribute('class', 'custom-control-label');
      labels.setAttribute('for', 'check_' + i);
      labels.innerText = 'Done';

      checkbox_container.appendChild(checkbox);
      checkbox_container.appendChild(labels);

      link_content.appendChild(links);
      link_content.appendChild(checkbox_container);

      card_header.appendChild(link_content);

      var collapsing = document.createElement('div');
      collapsing.setAttribute('id', 'coll_' + i);
      collapsing.setAttribute('class', 'collapse');
      collapsing.setAttribute('data-parent', '#do_list');

      var body = document.createElement('div');
      body.setAttribute('class', 'card-body');
      body.innerHTML =
        'Description: <br />' +
        new_data[i].d +
        '<br /><br />' +
        'TO-DO Date: ' +
        new_data[i].start +
        '<br />' +
        'Alert Date: ' +
        DurationToDate(new_data[i].start, new_data[i].duration);
      collapsing.appendChild(body);

      parent_card.appendChild(card_header);
      parent_card.appendChild(collapsing);

      if (new_data[i].done == true) container.appendChild(parent_card);
      else container.prepend(parent_card);

      document.getElementById('to_do_link_' + i).onclick = function(e) {
        var vals = this.parentNode.parentNode.parentNode.getAttribute('do-id');

        vals = 'coll_' + vals;

        SelectToDo(vals);
        console.log(vals);
      };

      document.getElementById('check_' + i).onclick = function(e) {
        var vals = this.parentNode.parentNode.parentNode.parentNode.getAttribute(
          'do-id'
        );

        if (e.target.checked) {
          setDone(vals);
        }
      };
    }
  } else {
    container.innerHTML =
      '<div class="text-center text-danger">No TO-DO Added!</div>';
  }
}

/**
 *
 * @param {String} start
 * @param {String} duration
 *
 * @returns {String}
 */
function DurationToDate(start, duration) {
  var converted = 'No Set';
  var start_date = new Date(start);

  switch (duration) {
    case '1m':
      start_date.setMinutes(start_date.getMinutes() + 1);
      converted = ConvertDateToString(start_date);
      break;

    case '5m':
      start_date.setMinutes(start_date.getMinutes() + 5);
      converted = ConvertDateToString(start_date);
      break;

    case '10m':
      start_date.setMinutes(start_date.getMinutes() + 10);
      converted = ConvertDateToString(start_date);
      break;

    case '30m':
      start_date.setMinutes(start_date.getMinutes() + 30);
      converted = ConvertDateToString(start_date);
      break;

    case '1h':
      start_date.setHours(start_date.getHours() + 1);
      converted = ConvertDateToString(start_date);
      break;

    case '4h':
      start_date.setHours(start_date.getHours() + 4);
      converted = ConvertDateToString(start_date);
      break;

    case '8h':
      start_date.setHours(start_date.getHours() + 8);
      converted = ConvertDateToString(start_date);
      break;

    case '1d':
      start_date.setDate(start_date.getDate() + 1);
      converted = ConvertDateToString(start_date);
      break;

    case '3d':
      start_date.setDate(start_date.getDate() + 3);
      converted = ConvertDateToString(start_date);
      break;

    case '1w':
      start_date.setDate(start_date.getDate() + 7);
      converted = ConvertDateToString(start_date);
      break;
  }

  return converted;
}

/**
 * @returns {String}
 */
function NowDateTime() {
  var d = new Date();

  return (
    d.getFullYear() +
    '-' +
    (d.getMonth() + 1) +
    '-' +
    d.getDate() +
    ' ' +
    (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) +
    ':' +
    (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) +
    ':' +
    (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds())
  );
}

/**
 * @param {Date} d
 *
 * @returns {String}
 */
function ConvertDateToString(d) {
  return (
    d.getFullYear() +
    '-' +
    (d.getMonth() + 1) +
    '-' +
    d.getDate() +
    ' ' +
    (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) +
    ':' +
    (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) +
    ':' +
    (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds())
  );
}

window.onload = function() {
  container = document.getElementById('do_list');
  counter = document.getElementById('total_reminders');
  this.init();

  counter.innerText = this.getLength();

  del_btn.setAttribute('disabled', 'disabled');
};
