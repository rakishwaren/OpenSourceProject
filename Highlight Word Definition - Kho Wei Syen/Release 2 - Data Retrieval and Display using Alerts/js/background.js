var tab_id = null;

chrome.browserAction.onClicked.addListener(function(tab) {
  tab_id = tab.id;
  chrome.tabs.sendRequest(tab.id, { method: "getSelection" }, callbacks);
});

chrome.commands.onCommand.addListener(function(command) {
  if (command == "checks") {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      tab_id = tabs[0].id;

      chrome.tabs.sendRequest(
        tabs[0].id,
        { method: "getSelection" },
        callbacks
      );
    });
  }
});

function callbacks(response) {
  var body = typeof response === "undefined" ? "" : response.body;

  if (body == "") {
    alert(
      "Nothing highlighted! Please highlight text before check definition. (Alt+Shift+D Shortcut Key)"
    );
  } else {
    json_request(body);
  }
}

/**
 *
 * @param {String} input
 */
function json_request(input) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.withCredentials = true;

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == this.DONE && this.status == 200) {
      var data = JSON.parse(this.responseText);
      var texts = "";

      if ("results" in data) {
        var result = data.results;

        texts =
          "Text to search: " +
          input +
          " (Pronunce To: " +
          data.pronunciation.all +
          ")" +
          "\n\n";

        alert(texts + "\n\n" + result);
      } else {
        texts =
          "Text to search: " +
          input +
          "<br /><br />" +
          "Error: No definition found!";
      }

      chrome.tabs.sendRequest(
        tab_id,
        { method: "setContent", data: texts },
        function(r) {}
      );

      console.log(texts);
    } else if (this.status == 404 || this.status == 500) {
      alert("Server error!");
    }
  };

  var url = "https://wordsapiv1.p.rapidapi.com/words/".concat(input);

  xmlhttp.open("GET", url);
  xmlhttp.setRequestHeader("x-rapidapi-host", "wordsapiv1.p.rapidapi.com");
  xmlhttp.setRequestHeader(
    "x-rapidapi-key",
    "2a80b961bdmsh4c6b10152a99a70p16b5f6jsne79037c1f732"
  );

  xmlhttp.send(null);
}
