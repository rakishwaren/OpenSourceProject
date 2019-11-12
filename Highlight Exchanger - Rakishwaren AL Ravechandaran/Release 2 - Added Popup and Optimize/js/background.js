chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.sendRequest(tab.id, { method: "getSelection" }, callbacks);
});

function callbacks(response) {
  var subject = typeof response === "undefined" ? "" : response.subject;
  var body = typeof response === "undefined" ? "" : response.body;

  if (body == "") {
    alert(
      "Nothing highlighted! Please highlight text before make conversion. (Alt+Shift+M Shortcut Key)"
    );
  } else {
    console.log("Input text: " + body);
    if (isNaN(parseFloat(body))) {
      alert("Not a number! Please highlight correctly.");
    } else {
      var convert_from = prompt(
        "Please enter convert source. (Supported: USD, MYR, THB, SGD, TWD, AUD)",
        "USD"
      );

      if (convert_from == null) return;

      if (check_currency_input(convert_from.trim()) == false) {
        alert("Invalid currency naming input");
        return;
      }

      var convert_to = prompt(
        "Please enter convert target. (Supported: USD, MYR, THB, SGD, TWD, AUD)",
        "MYR"
      );

      if (convert_to == null) return;

      if (check_currency_input(convert_to.trim()) == false) {
        alert("Invalid currency naming input");
        return;
      }
    }
  }
}

/**
 *
 * @param {String} input
 * @returns {Boolean}
 */
function check_currency_input(input) {
  return input.length == 3 && /^[a-zA-Z]+$/.test(input);
}
