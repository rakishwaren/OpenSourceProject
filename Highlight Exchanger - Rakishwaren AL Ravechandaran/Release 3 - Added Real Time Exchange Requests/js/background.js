chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.sendRequest(tab.id, { method: 'getSelection' }, callbacks);
});

chrome.commands.onCommand.addListener(function(command) {
  if (command == 'opens') {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendRequest(
        tabs[0].id,
        { method: 'getSelection' },
        callbacks
      );
    });
  }
});

function callbacks(response) {
  var subject = typeof response === 'undefined' ? '' : response.subject;
  var body = typeof response === 'undefined' ? '' : response.body;

  if (body == '') {
    alert(
      'Nothing highlighted! Please highlight text before make conversion. (Alt+Shift+M Shortcut Key)'
    );
  } else {
    console.log('Input text: ' + body);
    if (isNaN(parseFloat(body))) {
      alert('Not a number! Please highlight correctly.');
    } else {
      var convert_from = prompt(
        'Please enter convert source. (Supported: USD, MYR, THB, SGD, TWD, AUD)',
        'USD'
      );

      if (convert_from == null) return;

      if (check_currency_input(convert_from.trim()) == false) {
        alert('Invalid currency naming input');
        return;
      }

      var convert_to = prompt(
        'Please enter convert target. (Supported: USD, MYR, THB, SGD, TWD, AUD)',
        'MYR'
      );

      if (convert_to == null) return;

      if (check_currency_input(convert_to.trim()) == false) {
        alert('Invalid currency naming input');
        return;
      }

      convert_from = convert_from.trim().toUpperCase();
      convert_to = convert_to.trim().toUpperCase();

      json_request(convert_from, convert_to, parseFloat(body));
    }
  }
}

/**
 *
 * @param {String} convert_from
 * @param {String} convert_to
 * @param {Number} input
 */
function json_request(convert_from, convert_to, input) {
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);

      if (typeof data.rates === 'undefined') {
        alert('Incorrect source currency code!');
      } else {
        var rates = data.rates;
        var found = false;
        var rate_float = 0.0;

        for (var i in rates) {
          if (i == convert_to) {
            found = true;
            rate_float = rates[i];
            break;
          }
        }

        if (found == true) {
          var try_convert = input * rate_float;

          var result_msg =
            'Convert from ' +
            currency_name(convert_from) +
            ' to ' +
            currency_name(convert_to) +
            '\n' +
            'Rate: 1' +
            convert_from +
            ' - ' +
            rate_float +
            convert_to +
            '\n\n' +
            'Exchanged Rate: ' +
            convert_from +
            ' ' +
            input.toLocaleString('en-US', { minimumFractionDigits: 2 }) +
            ' - ' +
            convert_to +
            ' ' +
            try_convert.toLocaleString('en-US', { minimumFractionDigits: 2 }) +
            '\n\n' +
            'Currencies data provided by ExchangeRate-API.';

          alert(result_msg);
        } else {
          alert('Incorrect target currency code!');
        }
      }
    } else if (this.status == 404 || this.status == 500) {
      alert('Server error!');
    }
  };

  xmlhttp.open(
    'GET',
    'https://api.exchangerate-api.com/v4/latest/'.concat(convert_from),
    true
  );
  xmlhttp.send();
}

/**
 *
 * @param {String} input
 * @returns {Boolean}
 */
function check_currency_input(input) {
  return input.length == 3 && /^[a-zA-Z]+$/.test(input);
}

/**
 * @param {String} code
 * @returns {String}
 */
function currency_name(code) {
  var list = {
    ALL: 'Albania Lek',
    AFN: 'Afghanistan Afghani',
    ARS: 'Argentina Peso',
    AWG: 'Aruba Guilder',
    AUD: 'Australia Dollar',
    AZN: 'Azerbaijan New Manat',
    BSD: 'Bahamas Dollar',
    BBD: 'Barbados Dollar',
    BDT: 'Bangladeshi taka',
    BYR: 'Belarus Ruble',
    BZD: 'Belize Dollar',
    BMD: 'Bermuda Dollar',
    BOB: 'Bolivia Boliviano',
    BAM: 'Bosnia and Herzegovina Convertible Marka',
    BWP: 'Botswana Pula',
    BGN: 'Bulgaria Lev',
    BRL: 'Brazil Real',
    BND: 'Brunei Darussalam Dollar',
    KHR: 'Cambodia Riel',
    CAD: 'Canada Dollar',
    KYD: 'Cayman Islands Dollar',
    CLP: 'Chile Peso',
    CNY: 'China Yuan Renminbi',
    COP: 'Colombia Peso',
    CRC: 'Costa Rica Colon',
    HRK: 'Croatia Kuna',
    CUP: 'Cuba Peso',
    CZK: 'Czech Republic Koruna',
    DKK: 'Denmark Krone',
    DOP: 'Dominican Republic Peso',
    XCD: 'East Caribbean Dollar',
    EGP: 'Egypt Pound',
    SVC: 'El Salvador Colon',
    EEK: 'Estonia Kroon',
    EUR: 'Euro Member Countries',
    FKP: 'Falkland Islands (Malvinas) Pound',
    FJD: 'Fiji Dollar',
    GHC: 'Ghana Cedis',
    GIP: 'Gibraltar Pound',
    GTQ: 'Guatemala Quetzal',
    GGP: 'Guernsey Pound',
    GYD: 'Guyana Dollar',
    HNL: 'Honduras Lempira',
    HKD: 'Hong Kong Dollar',
    HUF: 'Hungary Forint',
    ISK: 'Iceland Krona',
    INR: 'India Rupee',
    IDR: 'Indonesia Rupiah',
    IRR: 'Iran Rial',
    IMP: 'Isle of Man Pound',
    ILS: 'Israel Shekel',
    JMD: 'Jamaica Dollar',
    JPY: 'Japan Yen',
    JEP: 'Jersey Pound',
    KZT: 'Kazakhstan Tenge',
    KPW: 'Korea (North) Won',
    KRW: 'Korea (South) Won',
    KGS: 'Kyrgyzstan Som',
    LAK: 'Laos Kip',
    LVL: 'Latvia Lat',
    LBP: 'Lebanon Pound',
    LRD: 'Liberia Dollar',
    LTL: 'Lithuania Litas',
    MKD: 'Macedonia Denar',
    MYR: 'Malaysia Ringgit',
    MUR: 'Mauritius Rupee',
    MXN: 'Mexico Peso',
    MNT: 'Mongolia Tughrik',
    MZN: 'Mozambique Metical',
    NAD: 'Namibia Dollar',
    NPR: 'Nepal Rupee',
    ANG: 'Netherlands Antilles Guilder',
    NZD: 'New Zealand Dollar',
    NIO: 'Nicaragua Cordoba',
    NGN: 'Nigeria Naira',
    NOK: 'Norway Krone',
    OMR: 'Oman Rial',
    PKR: 'Pakistan Rupee',
    PAB: 'Panama Balboa',
    PYG: 'Paraguay Guarani',
    PEN: 'Peru Nuevo Sol',
    PHP: 'Philippines Peso',
    PLN: 'Poland Zloty',
    QAR: 'Qatar Riyal',
    RON: 'Romania New Leu',
    RUB: 'Russia Ruble',
    SHP: 'Saint Helena Pound',
    SAR: 'Saudi Arabia Riyal',
    RSD: 'Serbia Dinar',
    SCR: 'Seychelles Rupee',
    SGD: 'Singapore Dollar',
    SBD: 'Solomon Islands Dollar',
    SOS: 'Somalia Shilling',
    ZAR: 'South Africa Rand',
    LKR: 'Sri Lanka Rupee',
    SEK: 'Sweden Krona',
    CHF: 'Switzerland Franc',
    SRD: 'Suriname Dollar',
    SYP: 'Syria Pound',
    TWD: 'Taiwan New Dollar',
    THB: 'Thailand Baht',
    TTD: 'Trinidad and Tobago Dollar',
    TRY: 'Turkey Lira',
    TRL: 'Turkey Lira',
    TVD: 'Tuvalu Dollar',
    UAH: 'Ukraine Hryvna',
    GBP: 'United Kingdom Pound',
    USD: 'United States Dollar',
    UYU: 'Uruguay Peso',
    UZS: 'Uzbekistan Som',
    VEF: 'Venezuela Bolivar',
    VND: 'Viet Nam Dong',
    YER: 'Yemen Rial',
    ZWD: 'Zimbabwe Dollar'
  };

  return list[code];
}
