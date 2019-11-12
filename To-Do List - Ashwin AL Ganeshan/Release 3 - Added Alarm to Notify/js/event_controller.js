var select_field = document.getElementById('selected_ind');
var add_field = document.getElementById('add_field');
var add_state = false;

var ttl_field = document.getElementById('new_title');
var desc_field = document.getElementById('new_desc');
var priority_field = document.getElementById('new_priority');
var alert_field = document.getElementById('new_time');

/**
 *
 * @param {String} pos
 */
function SelectToDo(pos) {
  select_field.value = pos;

  var event = new Event('change');
  select_field.dispatchEvent(event);
}

function AddToDo() {}

select_field.onchange = function(e) {
  var vals = select_field.value;

  if (vals.length > 0) {
    del_btn.removeAttribute('disabled');
    var selected = parseInt(vals.slice(5));
    del_btn.innerHTML = 'Delete TO-DO (' + getSpecificNode(selected).t + ')';
  } else {
    del_btn.setAttribute('disabled', 'disabled');
    del_btn.innerHTML = 'Delete TO-DO';
  }
};

del_btn.onclick = function(e) {
  if (add_state == false) {
    var selected = select_field.value;
    selected = parseInt(selected.slice(5));

    if (
      window.confirm(
        'Are you sure want to remove? (To-Do: ' +
          getSpecificNode(selected).t +
          ')'
      )
    ) {
      removeNode(selected);

      select_field.value = '';
      var event = new Event('change');
      select_field.dispatchEvent(event);
    }
  } else {
    StateChange();
  }
};

add_btn.onclick = function() {
  if (add_state == true) {
    if (ttl_field.value.length < 6) {
      alert('TO-DO title required! (min 6)');
      ttl_field.focus();
      return;
    }

    if (desc_field.value.length < 10) {
      alert('TO-DO description required! (min 10)');
      desc_field.focus();
      return;
    }

    if (window.confirm('Are you sure?')) {
      setList(
        ttl_field.value,
        desc_field.value,
        priority_field.value,
        alert_field.value
      );
    }
  }

  StateChange();
};

function StateChange() {
  if (add_state == false) {
    add_state = true;

    add_btn.innerText = 'Apply Changes';
    del_btn.innerText = 'Discard Changes';
    add_field.style.display = 'inherit';
    del_btn.removeAttribute('disabled');
  } else {
    add_state = false;

    add_btn.innerText = 'Add';
    del_btn.innerText = 'Delete';
    add_field.style.display = 'none';

    ttl_field.value = '';
    desc_field.value = '';
    priority_field.selectedIndex = 0;
    alert_field.selectedIndex = 0;

    if (select_field.value.length > 0) {
      del_btn.removeAttribute('disabled');

      var vals = select_field.value;
      var selected = parseInt(vals.slice(5));
      del_btn.innerHTML = 'Delete TO-DO (' + getSpecificNode(selected).t + ')';
    } else {
      del_btn.setAttribute('disabled', 'disabled');
    }
  }
}
