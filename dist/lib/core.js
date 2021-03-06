var EventEmitter, HTTPSRequest, MWSBool, MWSClient, MWSComplexList, MWSComplexParam, MWSEnum, MWSEnumList, MWSParam, MWSParamList, MWSRequest, MWSResponse, MWSService, MWSTimestamp, MWS_LOCALES, MWS_MARKETPLACES, MWS_SIGNATURE_METHOD, MWS_SIGNATURE_VERSION, crypto, qs, types, url, xml2js,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

EventEmitter = require("events").EventEmitter;

HTTPSRequest = require("request");

url = require('url');

qs = require("querystring");

crypto = require("crypto");

xml2js = require('xml2js');

MWS_SIGNATURE_METHOD = 'HmacSHA256';

MWS_SIGNATURE_VERSION = 2;

MWS_MARKETPLACES = {
  ATVPDKIKX0DER: 'US',
  A1F83G8C2ARO7P: 'UK',
  A13V1IB3VIYZZH: 'FR',
  A1PA6795UKMFR9: 'DE',
  APJ6JRA9NG5V4: 'IT',
  A1RKKUPIHCS9HS: 'ES',
  A2EUQ1WTGCTBG2: 'CA',
  AAHKV2X7AFYLW: 'CN',
  A1VC38T7YXB528: 'JP',
  A21TJRUUN4KGV: 'IN',
  US: 'ATVPDKIKX0DER',
  UK: 'A1F83G8C2ARO7P',
  FR: 'A13V1IB3VIYZZH',
  DE: 'A1PA6795UKMFR9',
  IT: 'APJ6JRA9NG5V4',
  ES: 'A1RKKUPIHCS9HS',
  CA: 'A2EUQ1WTGCTBG2',
  CN: 'AAHKV2X7AFYLW',
  JP: 'A1VC38T7YXB528',
  IN: 'A21TJRUUN4KGV'
};

MWS_LOCALES = {
  US: {
    host: "mws.amazonservices.com",
    country: 'UnitedStates',
    currency: 'USD',
    domain: 'www.amazon.com',
    salesChannel: 'Amazon.com',
    marketplaceId: MWS_MARKETPLACES.US,
    charset: 'iso-8859-1'
  },
  UK: {
    host: "mws-eu.amazonservices.com",
    country: 'UnitedKingdom',
    currency: 'GBP',
    domain: 'www.amazon.co.uk',
    salesChannel: 'Amazon.co.uk',
    marketplaceId: MWS_MARKETPLACES.UK,
    charset: 'iso-8859-1'
  },
  FR: {
    host: "mws-eu.amazonservices.com",
    country: 'France',
    currency: 'EUR',
    domain: 'www.amazon.fr',
    salesChannel: 'Amazon.fr',
    marketplaceId: MWS_MARKETPLACES.FR,
    charset: 'iso-8859-1'
  },
  DE: {
    host: "mws-eu.amazonservices.com",
    country: 'Germany',
    currency: 'EUR',
    domain: 'www.amazon.de',
    salesChannel: 'Amazon.de',
    marketplaceId: MWS_MARKETPLACES.DE,
    charset: 'iso-8859-1'
  },
  IT: {
    host: "mws-eu.amazonservices.com",
    country: 'Italy',
    currency: 'EUR',
    domain: 'www.amazon.it',
    salesChannel: 'Amazon.it',
    marketplaceId: MWS_MARKETPLACES.IT,
    charset: 'iso-8859-1'
  },
  ES: {
    host: "mws-eu.amazonservices.com",
    country: 'Spain',
    currency: 'EUR',
    domain: 'www.amazon.es',
    salesChannel: 'Amazon.es',
    marketplaceId: MWS_MARKETPLACES.ES,
    charset: 'iso-8859-1'
  },
  CA: {
    host: "mws.amazonservices.ca",
    country: 'Canada',
    currency: 'CAD',
    domain: 'www.amazon.ca',
    salesChannel: 'Amazon.ca',
    marketplaceId: MWS_MARKETPLACES.CA,
    charset: 'iso-8859-1'
  },
  CN: {
    host: "mws.amazonservices.cn",
    country: 'China',
    currency: 'CNY',
    domain: 'www.amazon.cn',
    salesChannel: 'Amazon.cn',
    marketplaceId: MWS_MARKETPLACES.CN,
    charset: 'UTF-8'
  },
  JP: {
    host: "mws.amazonservices.jp",
    country: 'Japan',
    currency: 'JPY',
    domain: 'www.amazon.jp',
    salesChannel: 'Amazon.jp',
    marketplaceId: MWS_MARKETPLACES.JP,
    charset: 'Shift_JIS'
  },
  IN: {
    host: "mws.amazonservices.in",
    country: 'India',
    currency: 'INR',
    domain: 'www.amazon.in',
    salesChannel: 'Amazon.in',
    marketplaceId: MWS_MARKETPLACES.IN,
    charset: 'UTF-8'
  }
};

types = {
  ServiceStatus: {
    GREEN: "The service is operating normally.",
    GREEN_I: "The service is operating normally + additional info provided",
    YELLOW: "The service is experiencing higher than normal error rates or degraded performance.",
    RED: "The service is unabailable or experiencing extremely high error rates."
  }
};

MWSClient = (function(superClass) {
  extend(MWSClient, superClass);

  function MWSClient() {
    var e, extras, j, k, len, options, ref, ref1, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, v;
    options = arguments[0], extras = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (options == null) {
      options = {};
    }
    for (j = 0, len = extras.length; j < len; j++) {
      e = extras[j];
      if (typeof e === 'object') {
        for (k in e) {
          v = e[k];
          options[k] = v;
        }
      }
    }
    if (options.locale != null) {
      if (typeof options.locale !== 'object') {
        options.locale = (ref = MWS_LOCALES[options.locale]) != null ? ref : null;
      }
      this.host = (ref1 = options.host) != null ? ref1 : (ref2 = options.locale.host) != null ? ref2 : "mws.amazonservices.com";
      this.marketplaceId = options.locale.marketplaceId;
      this.country = (ref3 = options.locale.country) != null ? ref3 : void 0;
      this.amazonDomain = (ref4 = options.locale.amazonDomain) != null ? ref4 : void 0;
      this.charset = (ref5 = options.locale.charset) != null ? ref5 : 'UTF-8';
    }
    this.host = (ref6 = this.host) != null ? ref6 : (ref7 = options.host) != null ? ref7 : "mws.amazonservices.com";
    this.port = (ref8 = options.port) != null ? ref8 : 443;
    this.merchantId = (ref9 = options.merchantId) != null ? ref9 : null;
    this.accessKeyId = (ref10 = options.accessKeyId) != null ? ref10 : null;
    this.secretAccessKey = (ref11 = options.secretAccessKey) != null ? ref11 : null;
    if (this.marketplaceId == null) {
      this.marketplaceId = (ref12 = this.marketplaceId) != null ? ref12 : (ref13 = options.marketplaceId) != null ? ref13 : null;
    }
    this.appName = options.appName || 'mws-js';
    this.appVersion = options.appVersion || "0.2.0";
    this.appLanguage = options.appLanguage || "JavaScript";
    this.appHost = (ref14 = options.appHost) != null ? ref14 : void 0;
    this.appPlatform = (ref15 = options.appPlatform) != null ? ref15 : void 0;
    this.proxy = (ref16 = options.proxy) != null ? ref16 : void 0;
    this.strictSSL = (ref17 = options.strictSSL) != null ? ref17 : true;
    options;
  }

  MWSClient.prototype.sign = function(service, q) {
    var hash, j, k, keys, len, path, ref, sorted, stringToSign, v;
    if (q == null) {
      q = {};
    }
    path = (ref = service.path) != null ? ref : '/';
    hash = crypto.createHmac("sha256", this.secretAccessKey);
    if (service.legacy) {
      q['Merchant'] = this.merchantId;
    } else {
      q['SellerId'] = this.merchantId;
    }
    if (q['AWSAccessKeyId'] == null) {
      q['AWSAccessKeyId'] = this.accessKeyId;
    }
    q['SignatureMethod'] = MWS_SIGNATURE_METHOD;
    q['SignatureVersion'] = MWS_SIGNATURE_VERSION;
    sorted = {};
    keys = ((function() {
      var results;
      results = [];
      for (k in q) {
        v = q[k];
        results.push(k);
      }
      return results;
    })()).sort();
    for (j = 0, len = keys.length; j < len; j++) {
      k = keys[j];
      sorted[k] = q[k];
    }
    stringToSign = "POST\n" + this.host + "\n" + path + "\n" + (qs.stringify(sorted));
    stringToSign = stringToSign.replace(/'/g, '%27');
    stringToSign = stringToSign.replace(/\*/g, '%2A');
    stringToSign = stringToSign.replace(/\(/g, '%28');
    stringToSign = stringToSign.replace(/\)/g, '%29');
    q['Signature'] = hash.update(stringToSign).digest('base64');
    return q;
  };

  MWSClient.prototype.invoke = function(request, options, cb) {
    var agentParams, h, q, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, req, reqCallback, reqOptions, v;
    if (request != null ? request.body : void 0) {
      request.md5Calc();
    }
    if (options != null ? options.body : void 0) {
      request.attach(options.body, 'text');
    }
    q = this.sign((ref = (ref1 = options.service) != null ? ref1 : request.service) != null ? ref : null, request.query((ref2 = options.query) != null ? ref2 : {}));
    if (options.headers == null) {
      options.headers = {};
    }
    ref3 = request.headers;
    for (h in ref3) {
      v = ref3[h];
      options.headers[h] = v;
    }
    if (request.body || options.body) {
      if (options.body == null) {
        options.body = request.body;
      }
      if (options.path == null) {
        options.path = '/';
      }
      options.qs = qs.stringify(q);
      if (!options.headers['content-type'].match(';charset')) {
        options.headers['content-type'] += ';charset=' + this.charset;
      }
    } else {
      options.body = qs.stringify(q);
      options.headers['content-type'] = 'application/x-www-form-urlencoded; charset=utf-8';
    }
    options.headers['host'] = this.host;
    agentParams = ["Language=" + this.appLanguage];
    if (this.appHost) {
      agentParams.push("Host=" + this.appHost);
    }
    if (this.appPlatform) {
      agentParams.push("Platform=" + this.appPlatform);
    }
    options.headers['user-agent'] = this.appName + "/" + this.appVersion + " (" + (agentParams.join('; ')) + ")";
    options.headers['content-length'] = options.body.length;
    reqOptions = {
      method: 'POST',
      uri: url.format({
        host: this.host,
        port: this.port,
        protocol: 'https:',
        pathname: (ref4 = (ref5 = options.path) != null ? ref5 : (ref6 = request.service) != null ? ref6.path : void 0) != null ? ref4 : '/',
        search: (ref7 = options.qs) != null ? ref7 : ''
      }),
      headers: options.headers,
      body: options.body,
      proxy: this.proxy,
      strictSSL: this.strictSSL,
      encoding: null
    };
    reqCallback = (function(_this) {
      return function(error, response, body) {
        var mwsres;
        if (error) {
          _this.emit('error', error);
          cb(error, null, body);
          return;
        }
        mwsres = new MWSResponse(response, body, options);
        mwsres.parseHeaders();
        mwsres.parseBody(function(err, parsed) {
          var invokeOpts, nextRequest, ref10, ref8, ref9;
          if ((options.nextTokenCall != null) && (((ref8 = mwsres.result) != null ? (ref9 = ref8.NextToken) != null ? ref9.length : void 0 : void 0) > 0)) {
            invokeOpts = {
              nextTokenCall: options.nextTokenCall
            };
            if (options.nextTokenCallUseHasNext) {
              invokeOpts.nextTokenCallUseHasNext = options.nextTokenCallUseHasNext;
              if (((ref10 = mwsres.result) != null ? ref10.HasNext : void 0) === 'true') {
                mwsres.nextToken = mwsres.result.NextToken;
              }
            } else {
              mwsres.nextToken = mwsres.result.NextToken;
            }
            nextRequest = new options.nextTokenCall({
              NextToken: mwsres.nextToken
            });
            mwsres.getNext = function() {
              var k, opts;
              opts = {};
              for (k in invokeOpts) {
                v = invokeOpts[k];
                opts[k] = v;
              }
              return _this.invoke(nextRequest, opts, cb);
            };
          }
          _this.emit('response', mwsres, parsed);
          return cb(mwsres);
        });
        return mwsres.retry = function() {
          var req;
          return req = HTTPSRequest(reqOptions, reqCallback);
        };
      };
    })(this);
    req = HTTPSRequest(reqOptions, reqCallback);
    return this.emit('request', req, options);
  };

  return MWSClient;

})(EventEmitter);

MWSService = (function() {
  function MWSService(options) {
    var k, v;
    for (k in options) {
      v = options[k];
      this[k] = v;
    }
    if (this.name == null) {
      this.name = null;
    }
    if (this.path == null) {
      this.path = '/';
    }
    if (this.version == null) {
      this.version = '2009-01-01';
    }
    if (this.legacy == null) {
      this.legacy = false;
    }
  }

  return MWSService;

})();

MWSRequest = (function() {
  function MWSRequest(service1, action, params, headers, body1, init) {
    var i, p, pid, ref, ref1, ref2;
    this.service = service1;
    this.action = action;
    this.params = params != null ? params : [];
    this.headers = headers != null ? headers : {};
    this.body = body1 != null ? body1 : null;
    if (init == null) {
      init = {};
    }
    if (this.service == null) {
      this.service = new MWSService;
    }
    ref = this.params;
    for (i in ref) {
      p = ref[i];
      pid = (ref1 = p.name) != null ? ref1 : i;
      if (init[pid] != null) {
        p.set(init[pid]);
      }
      this[pid] = (ref2 = this.params[i]) != null ? ref2 : null;
    }
  }

  MWSRequest.prototype.query = function(q) {
    var i, p, ref, ref1, ref2, ref3, ref4, ref5, ref6, val;
    if (q == null) {
      q = {};
    }
    ref = this.params;
    for (i in ref) {
      p = ref[i];
      val = (ref1 = (ref2 = this[(ref3 = p.name) != null ? ref3 : i]) != null ? ref2 : p) != null ? ref1 : {};
      if (val.render != null) {
        val.render(q);
      } else {
        q[(ref5 = val.name) != null ? ref5 : i] = (ref4 = val.value) != null ? ref4 : p;
      }
    }
    q['Action'] = this.action;
    q['Version'] = (ref6 = this.service.version) != null ? ref6 : '2009-01-01';
    q['Timestamp'] = (new Date()).toISOString();
    return q;
  };

  MWSRequest.prototype.set = function(param, value) {
    var k, ref, results, v;
    if (typeof param === 'object' && value === void 0) {
      results = [];
      for (k in param) {
        v = param[k];
        results.push(this.set(k, v));
      }
      return results;
    } else {
      if (((ref = this[param]) != null ? ref.set : void 0) != null) {
        return this[param].set(value != null ? value : null);
      } else {
        throw param + " is not a valid parameter for this request type";
      }
    }
  };

  MWSRequest.prototype.attach = function(body, format) {
    this.body = body;
    this.headers['content-type'] = format != null ? format : 'text';
    return this.md5Calc();
  };

  MWSRequest.prototype.md5Calc = function() {
    return this.headers['content-md5'] = crypto.createHash('md5').update(this.body).digest("base64");
  };

  return MWSRequest;

})();

MWSResponse = (function() {
  function MWSResponse(response, body, options) {
    var ref;
    if (options == null) {
      options = {};
    }
    this.statusCode = response.statusCode;
    this.headers = response.headers;
    this.body = body != null ? body : null;
    this.meta = {};
    this.options = options;
    this.allowedContentTypes = (ref = options != null ? options.allowedContentTypes : void 0) != null ? ref : [];
  }

  MWSResponse.prototype.parseHeaders = function() {
    var base, header, id, ns, ref, results, value, xreg;
    ref = this.headers;
    results = [];
    for (header in ref) {
      value = ref[header];
      xreg = /x-(\w+)-(.*)/gi.exec(header);
      if (xreg) {
        ns = xreg[1];
        id = xreg[2].replace(/(\-[a-z])/g, function($1) {
          return $1.toUpperCase().replace('-', '');
        });
        if ((base = this.meta)[ns] == null) {
          base[ns] = {};
        }
        results.push(this.meta[ns][id] = value);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  MWSResponse.prototype.parseBody = function(cb) {
    var bodyAsStr, contentType, isXml, md5, parser, ref, ref1, ref2;
    isXml = false;
    contentType = (ref = this.headers['content-type']) != null ? ref : 'text/plain';
    if (contentType.indexOf('text/xml') === 0) {
      this.body = this.body.toString();
      isXml = true;
    }
    if (contentType.indexOf('text/plain') === 0) {
      bodyAsStr = this.body.toString();
      isXml = bodyAsStr.indexOf('<?xml') === 0;
      if (isXml) {
        this.body = bodyAsStr;
      }
    }
    if (isXml) {
      parser = new xml2js.Parser({
        explicitRoot: true,
        normalize: false,
        trim: false
      });
      return parser.parseString(this.body, (function(_this) {
        return function(err, res) {
          var k, ref1, ref2, rtype, v;
          if (err) {
            throw err;
          } else {
            _this.response = res != null ? res : {};
            ref1 = _this.response;
            for (k in ref1) {
              v = ref1[k];
              rtype = /([A-Z]\w+)Response/.exec(k);
              if (rtype) {
                _this.responseType = rtype[1];
                if (_this.responseType === 'Error') {
                  _this.error = (ref2 = v.Error) != null ? ref2 : v;
                  _this.requestI;
                }
                if (v[_this.responseType + "Result"]) {
                  _this.result = v[_this.responseType + "Result"];
                }
                if (v.ResponseMetadata != null) {
                  _this.meta.response = v.ResponseMetadata;
                }
              }
            }
            return cb(err, res);
          }
        };
      })(this));
    } else if (ref1 = this.headers['content-type'], indexOf.call(this.allowedContentTypes, ref1) >= 0) {
      md5 = crypto.createHash('md5').update(this.body).digest("base64");
      if (this.headers['content-md5'] === md5) {
        this.response = this.body;
        return cb(null, this.body);
      } else {
        this.responseType = 'Error';
        this.error = {
          Type: {},
          Code: 'Client_WrongMD5',
          Message: "Invalid MD5 on received content: amazon=" + this.headers['content-md5'] + " , calculated=" + md5
        };
        this.response = null;
        this.responseWithInvalidMD5 = this.body;
        return cb(this.error, null);
      }
    } else {
      this.responseType = 'Error';
      this.error = {
        Type: {},
        Code: 'Client_UknownContent',
        Message: "Unrecognized content format: " + ((ref2 = this.headers['content-type']) != null ? ref2 : 'undefined')
      };
      this.response = null;
      return cb(this.error, null);
    }
  };

  return MWSResponse;

})();

MWSParam = (function() {
  function MWSParam(name, required, value) {
    this.name = name;
    this.required = required != null ? required : false;
    if (value != null) {
      this.set(value);
    }
  }

  MWSParam.prototype.render = function(obj) {
    var val;
    if (obj == null) {
      obj = {};
    }
    val = this.get();
    if (val != null) {
      obj[this.name] = this.get();
      return obj;
    } else if (this.required) {
      throw "Required parameter " + this.name + " must be defined!";
    }
  };

  MWSParam.prototype.get = function() {
    return this.value;
  };

  MWSParam.prototype.set = function(val) {
    this.value = val;
    return this;
  };

  return MWSParam;

})();

MWSBool = (function(superClass) {
  extend(MWSBool, superClass);

  function MWSBool() {
    return MWSBool.__super__.constructor.apply(this, arguments);
  }

  MWSBool.prototype.get = function() {
    if (this.value) {
      return "true";
    } else if (this.value != null) {
      return "false";
    } else {
      return void 0;
    }
  };

  return MWSBool;

})(MWSParam);

MWSTimestamp = (function(superClass) {
  extend(MWSTimestamp, superClass);

  function MWSTimestamp() {
    return MWSTimestamp.__super__.constructor.apply(this, arguments);
  }

  MWSTimestamp.prototype.get = function() {
    var ref;
    if (((ref = this.value) != null ? ref.constructor : void 0) === Date) {
      return this.value.toISOString();
    } else {
      return this.value;
    }
  };

  MWSTimestamp.prototype.set = function(val) {
    var e;
    if (val == null) {
      val = new Date();
    }
    if (val.constructor !== Date) {
      try {
        this.value = new Date(val);
      } catch (_error) {
        e = _error;
        this.value = val;
      }
    } else {
      this.value = val;
    }
    return this;
  };

  return MWSTimestamp;

})(MWSParam);

MWSParamList = (function(superClass) {
  extend(MWSParamList, superClass);

  function MWSParamList(name, type, required, value) {
    this.name = name;
    this.type = type;
    this.required = required;
    MWSParamList.__super__.constructor.call(this, this.name, this.required, value != null ? value : []);
    this.list = true;
  }

  MWSParamList.prototype.render = function(obj) {
    var k, ref, v;
    if (obj == null) {
      obj = {};
    }
    if (this.value.length < 1 && this.required) {
      throw "Required parameter list, " + this.name + " is empty!";
    }
    ref = this.get();
    for (k in ref) {
      v = ref[k];
      obj[k] = v;
    }
    return obj;
  };

  MWSParamList.prototype.clear = function() {
    return this.value = [];
  };

  MWSParamList.prototype.add = function() {
    var vals;
    vals = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return this.value = this.value.concat(vals);
  };

  MWSParamList.prototype.get = function() {
    var count, i, index, j, l, len, len1, list, ref, v;
    index = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    list = {};
    count = 0;
    if (index.length < 1) {
      ref = this.value;
      for (j = 0, len = ref.length; j < len; j++) {
        v = ref[j];
        list[this.name + "." + this.type + "." + (++count)] = v;
      }
    } else {
      for (l = 0, len1 = index.length; l < len1; l++) {
        i = index[l];
        if (this.value[i] == null) {
          throw "ERROR: INVALID INDEX " + i;
        }
        list[this.name + "." + this.type + "." + (++count)] = this.value[i];
      }
    }
    return list;
  };

  MWSParamList.prototype.set = function(val) {
    if (Array.isArray(val)) {
      return this.value = val;
    } else {
      return this.value = [val];
    }
  };

  return MWSParamList;

})(MWSParam);

MWSEnum = (function(superClass) {
  extend(MWSEnum, superClass);

  function MWSEnum(name, members, required, value) {
    this.name = name;
    this.members = members != null ? members : [];
    this.required = required != null ? required : false;
    this.value = null;
    if (value != null) {
      this.set(value);
    }
  }

  MWSEnum.prototype.set = function(val) {
    if (indexOf.call(this.members, val) >= 0) {
      return this.value = val;
    } else if (this.members[val] != null) {
      return this.value = this.members[val];
    } else {
      throw "Invalid enumeration value, '" + val + "', must be a member or index of " + this.members;
    }
  };

  return MWSEnum;

})(MWSParam);

MWSEnumList = (function(superClass) {
  extend(MWSEnumList, superClass);

  function MWSEnumList(name, type, members, required, initValue) {
    var j, len, m, ref;
    this.name = name;
    this.type = type;
    this.members = members;
    this.required = required != null ? required : false;
    this.list = true;
    this.value = {};
    ref = this.members;
    for (j = 0, len = ref.length; j < len; j++) {
      m = ref[j];
      this.value[m] = initValue != null ? initValue : false;
    }
  }

  MWSEnumList.prototype.render = function(obj) {
    var k, onset, v;
    if (obj == null) {
      obj = {};
    }
    onset = this.get();
    if (onset.length < 1 && this.required) {
      throw "Required paremeter list (enum), " + this.name + " is empty!";
    }
    for (k in onset) {
      v = onset[k];
      obj[k] = v;
    }
    return obj;
  };

  MWSEnumList.prototype.enable = function() {
    var results, v, values;
    values = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    results = [];
    for (v in values) {
      if (indexOf.call(this.members, v) >= 0) {
        results.push(this.value[v] = true);
      }
    }
    return results;
  };

  MWSEnumList.prototype.disable = function() {
    var results, v, values;
    values = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    results = [];
    for (v in values) {
      if (indexOf.call(this.members, v) >= 0) {
        results.push(this.value[v] = false);
      }
    }
    return results;
  };

  MWSEnumList.prototype.toggle = function() {
    var results, v, values;
    values = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    results = [];
    for (v in values) {
      if (indexOf.call(this.members, v) >= 0) {
        results.push(this.value[v] = this.value[v] ? false : true);
      }
    }
    return results;
  };

  MWSEnumList.prototype.clear = function() {
    return this.disable(this.members);
  };

  MWSEnumList.prototype.all = function() {
    return this.enable(this.members);
  };

  MWSEnumList.prototype.invert = function() {
    return this.toggle(this.members);
  };

  MWSEnumList.prototype.add = function(value, enabled) {
    if (enabled == null) {
      enabled = true;
    }
    this.members[value] = enabled;
    this.value[value] = enabled;
    return this;
  };

  MWSEnumList.prototype.set = function(values) {
    var j, len, results, val;
    this.value = {};
    if (!Array.isArray(values)) {
      values = [values];
    }
    results = [];
    for (j = 0, len = values.length; j < len; j++) {
      val = values[j];
      if (indexOf.call(this.members, val) >= 0) {
        results.push(this.value[val] = true);
      } else {
        throw "Invalid enumeration value, '" + val + "', must be a member or index of " + this.members;
      }
    }
    return results;
  };

  MWSEnumList.prototype.get = function() {
    var count, k, list, ref, v;
    list = {};
    count = 0;
    ref = this.value;
    for (k in ref) {
      v = ref[k];
      if (v === true) {
        list[this.name + "." + this.type + "." + (++count)] = k;
      }
    }
    return list;
  };

  return MWSEnumList;

})(MWSParamList);

MWSComplexParam = (function(superClass) {
  extend(MWSComplexParam, superClass);

  function MWSComplexParam(name, params, required, value) {
    this.name = name;
    this.params = params;
    this.required = required;
    if (this.params == null) {
      this.params = {};
    }
  }

  MWSComplexParam.prototype.render = function(obj) {
    var fields, k, v;
    if (obj == null) {
      obj = {};
    }
    fields = this.get();
    for (k in fields) {
      v = fields[k];
      if (v === null) {
        throw "Missing required parameter " + k;
      } else {
        obj[k] = v;
      }
    }
    return obj;
  };

  MWSComplexParam.prototype.render = function(obj) {
    var k, n, p, ref, ref1, ref2, v;
    if (obj == null) {
      obj = {};
    }
    ref = this.params;
    for (k in ref) {
      p = ref[k];
      n = (ref1 = p.name) != null ? ref1 : k;
      v = (ref2 = typeof p.get === "function" ? p.get() : void 0) != null ? ref2 : p.value;
      if (v != null) {
        obj[this.name + "." + n] = v;
      } else if (p.required) {
        throw "Missing required parameter " + this.name + "." + n;
      }
    }
    return obj;
  };

  MWSComplexParam.prototype.get = function(field) {
    var k, obj, p, ref, ref1, results;
    if ((field != null) && (this.params[field] != null)) {
      return this.params[field].get();
    } else if (field == null) {
      obj = {};
      ref = this.params;
      results = [];
      for (k in ref) {
        p = ref[k];
        results.push(obj[k] = p);
      }
      return results;
    } else {
      ref1 = this.params;
      for (k in ref1) {
        p = ref1[k];
        if (p.name === field) {
          return p;
        }
      }
      throw "There is no field, " + field + ", in " + this.name;
    }
  };

  MWSComplexParam.prototype.set = function(field, value) {
    var k, ref, results, results1, v;
    if (arguments.length === 1 && typeof field === 'object') {
      results = [];
      for (k in field) {
        v = field[k];
        results.push(this.set(k, v));
      }
      return results;
    } else if (this.params[field] != null) {
      if (this.params[field].set != null) {
        return this.params[field].set(value);
      } else {
        return this.params[field].value = value;
      }
    } else {
      ref = this.params;
      results1 = [];
      for (k in ref) {
        v = ref[k];
        if (v.name.toLowerCase() === field.toLowerCase()) {
          results1.push(this.set(k, value));
        } else {
          results1.push(void 0);
        }
      }
      return results1;
    }
  };

  return MWSComplexParam;

})(MWSParam);

MWSComplexList = (function(superClass) {
  extend(MWSComplexList, superClass);

  function MWSComplexList(name, type, required, value) {
    this.name = name;
    this.type = type;
    this.required = required;
    MWSComplexList.__super__.constructor.call(this, this.name, this.required, value != null ? value : []);
    this.list = true;
  }

  MWSComplexList.prototype.render = function(obj) {
    var k, ref, v;
    if (obj == null) {
      obj = {};
    }
    if (this.value.length < 1 && this.required) {
      throw "Required (complex) parameter list, " + this.name + " is empty!";
    }
    ref = this.get();
    for (k in ref) {
      v = ref[k];
      v.name = k;
      v.render(obj);
    }
    return obj;
  };

  return MWSComplexList;

})(MWSParamList);

module.exports = {
  MARKETPLACES: MWS_MARKETPLACES,
  LOCALES: MWS_LOCALES,
  types: types,
  Client: MWSClient,
  Request: MWSRequest,
  Response: MWSResponse,
  Service: MWSService,
  Param: MWSParam,
  Bool: MWSBool,
  Timestamp: MWSTimestamp,
  ParamList: MWSParamList,
  Enum: MWSEnum,
  EnumList: MWSEnumList,
  ComplexParam: MWSComplexParam,
  ComplexList: MWSComplexList
};
