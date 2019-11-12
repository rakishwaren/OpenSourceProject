/**
 * Gets the HTML of the user's selection
 */
function getSelectionHTML() {
  var userSelection;
  if (window.getSelection) {
    // W3C Ranges
    userSelection = window.getSelection();
    // Get the range:
    if (userSelection.getRangeAt) var range = userSelection.getRangeAt(0);
    else {
      var range = document.createRange();
      range.setStart(userSelection.anchorNode, userSelection.anchorOffset);
      range.setEnd(userSelection.focusNode, userSelection.focusOffset);
    }
    // And the HTML:
    var clonedSelection = range.cloneContents();
    var div = document.createElement('div');
    div.appendChild(clonedSelection);
    return div.innerHTML;
  } else if (document.selection) {
    // Explorer selection, return the HTML
    userSelection = document.selection.createRange();
    return userSelection.htmlText;
  } else {
    return '';
  }
}
/**
 * Listens for a request from the button in the browser.
 * When it sees the getSelection request, it returns the selection HTML, as well as the URL and title of the tab.
 */
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.method == 'getSelection') {
    var selection = window.getSelectionHTML();
    sendResponse({ body: selection, subject: document.title });
  } else if (request.method == 'setContent') {
    var data = request.data;

    var dialog = document.createElement('dialog');

    var title = document.createElement('div');
    title.textContent = 'Highlight Word Definition';
    title.style.fontSize = '16pt';
    title.style.fontWeight = '600';
    title.style.marginBottom = '15px';

    var footer = document.createElement('div');
    footer.textContent = 'Data provided by WordsAPI from RapidAPI';
    footer.style.marginTop = '15px';
    footer.style.fontWeight = '600';

    var main_content = document.createElement('div');
    main_content.innerHTML = data;
    main_content.style.maxHeight = '300px';
    main_content.style.maxWidth = '400px';
    main_content.style.overflowY = 'scroll';

    var button = document.createElement('button');
    button.style.cssFloat = 'right';
    button.style.marginTop = '20px';
    button.textContent = 'Close';

    dialog.appendChild(title);
    dialog.appendChild(main_content);
    dialog.appendChild(footer);
    dialog.appendChild(button);

    button.addEventListener('click', function() {
      dialog.close();
      dialog.remove();
    });

    document.body.appendChild(dialog);
    dialog.showModal();
  } else sendResponse({ body: '', subject: '' }); // snub them.
});
