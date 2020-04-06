// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/cuint/lib/uint32.js":[function(require,module,exports) {
var define;
/**
	C-like unsigned 32 bits integers in Javascript
	Copyright (C) 2013, Pierre Curto
	MIT license
 */
;(function (root) {

	// Local cache for typical radices
	var radixPowerCache = {
		36: UINT32( Math.pow(36, 5) )
	,	16: UINT32( Math.pow(16, 7) )
	,	10: UINT32( Math.pow(10, 9) )
	,	2:  UINT32( Math.pow(2, 30) )
	}
	var radixCache = {
		36: UINT32(36)
	,	16: UINT32(16)
	,	10: UINT32(10)
	,	2:  UINT32(2)
	}

	/**
	 *	Represents an unsigned 32 bits integer
	 * @constructor
	 * @param {Number|String|Number} low bits     | integer as a string 		 | integer as a number
	 * @param {Number|Number|Undefined} high bits | radix (optional, default=10)
	 * @return 
	 */
	function UINT32 (l, h) {
		if ( !(this instanceof UINT32) )
			return new UINT32(l, h)

		this._low = 0
		this._high = 0
		this.remainder = null
		if (typeof h == 'undefined')
			return fromNumber.call(this, l)

		if (typeof l == 'string')
			return fromString.call(this, l, h)

		fromBits.call(this, l, h)
	}

	/**
	 * Set the current _UINT32_ object with its low and high bits
	 * @method fromBits
	 * @param {Number} low bits
	 * @param {Number} high bits
	 * @return ThisExpression
	 */
	function fromBits (l, h) {
		this._low = l | 0
		this._high = h | 0

		return this
	}
	UINT32.prototype.fromBits = fromBits

	/**
	 * Set the current _UINT32_ object from a number
	 * @method fromNumber
	 * @param {Number} number
	 * @return ThisExpression
	 */
	function fromNumber (value) {
		this._low = value & 0xFFFF
		this._high = value >>> 16

		return this
	}
	UINT32.prototype.fromNumber = fromNumber

	/**
	 * Set the current _UINT32_ object from a string
	 * @method fromString
	 * @param {String} integer as a string
	 * @param {Number} radix (optional, default=10)
	 * @return ThisExpression
	 */
	function fromString (s, radix) {
		var value = parseInt(s, radix || 10)

		this._low = value & 0xFFFF
		this._high = value >>> 16

		return this
	}
	UINT32.prototype.fromString = fromString

	/**
	 * Convert this _UINT32_ to a number
	 * @method toNumber
	 * @return {Number} the converted UINT32
	 */
	UINT32.prototype.toNumber = function () {
		return (this._high * 65536) + this._low
	}

	/**
	 * Convert this _UINT32_ to a string
	 * @method toString
	 * @param {Number} radix (optional, default=10)
	 * @return {String} the converted UINT32
	 */
	UINT32.prototype.toString = function (radix) {
		return this.toNumber().toString(radix || 10)
	}

	/**
	 * Add two _UINT32_. The current _UINT32_ stores the result
	 * @method add
	 * @param {Object} other UINT32
	 * @return ThisExpression
	 */
	UINT32.prototype.add = function (other) {
		var a00 = this._low + other._low
		var a16 = a00 >>> 16

		a16 += this._high + other._high

		this._low = a00 & 0xFFFF
		this._high = a16 & 0xFFFF

		return this
	}

	/**
	 * Subtract two _UINT32_. The current _UINT32_ stores the result
	 * @method subtract
	 * @param {Object} other UINT32
	 * @return ThisExpression
	 */
	UINT32.prototype.subtract = function (other) {
		//TODO inline
		return this.add( other.clone().negate() )
	}

	/**
	 * Multiply two _UINT32_. The current _UINT32_ stores the result
	 * @method multiply
	 * @param {Object} other UINT32
	 * @return ThisExpression
	 */
	UINT32.prototype.multiply = function (other) {
		/*
			a = a00 + a16
			b = b00 + b16
			a*b = (a00 + a16)(b00 + b16)
				= a00b00 + a00b16 + a16b00 + a16b16

			a16b16 overflows the 32bits
		 */
		var a16 = this._high
		var a00 = this._low
		var b16 = other._high
		var b00 = other._low

/* Removed to increase speed under normal circumstances (i.e. not multiplying by 0 or 1)
		// this == 0 or other == 1: nothing to do
		if ((a00 == 0 && a16 == 0) || (b00 == 1 && b16 == 0)) return this

		// other == 0 or this == 1: this = other
		if ((b00 == 0 && b16 == 0) || (a00 == 1 && a16 == 0)) {
			this._low = other._low
			this._high = other._high
			return this
		}
*/

		var c16, c00
		c00 = a00 * b00
		c16 = c00 >>> 16

		c16 += a16 * b00
		c16 &= 0xFFFF		// Not required but improves performance
		c16 += a00 * b16

		this._low = c00 & 0xFFFF
		this._high = c16 & 0xFFFF

		return this
	}

	/**
	 * Divide two _UINT32_. The current _UINT32_ stores the result.
	 * The remainder is made available as the _remainder_ property on
	 * the _UINT32_ object. It can be null, meaning there are no remainder.
	 * @method div
	 * @param {Object} other UINT32
	 * @return ThisExpression
	 */
	UINT32.prototype.div = function (other) {
		if ( (other._low == 0) && (other._high == 0) ) throw Error('division by zero')

		// other == 1
		if (other._high == 0 && other._low == 1) {
			this.remainder = new UINT32(0)
			return this
		}

		// other > this: 0
		if ( other.gt(this) ) {
			this.remainder = this.clone()
			this._low = 0
			this._high = 0
			return this
		}
		// other == this: 1
		if ( this.eq(other) ) {
			this.remainder = new UINT32(0)
			this._low = 1
			this._high = 0
			return this
		}

		// Shift the divisor left until it is higher than the dividend
		var _other = other.clone()
		var i = -1
		while ( !this.lt(_other) ) {
			// High bit can overflow the default 16bits
			// Its ok since we right shift after this loop
			// The overflown bit must be kept though
			_other.shiftLeft(1, true)
			i++
		}

		// Set the remainder
		this.remainder = this.clone()
		// Initialize the current result to 0
		this._low = 0
		this._high = 0
		for (; i >= 0; i--) {
			_other.shiftRight(1)
			// If shifted divisor is smaller than the dividend
			// then subtract it from the dividend
			if ( !this.remainder.lt(_other) ) {
				this.remainder.subtract(_other)
				// Update the current result
				if (i >= 16) {
					this._high |= 1 << (i - 16)
				} else {
					this._low |= 1 << i
				}
			}
		}

		return this
	}

	/**
	 * Negate the current _UINT32_
	 * @method negate
	 * @return ThisExpression
	 */
	UINT32.prototype.negate = function () {
		var v = ( ~this._low & 0xFFFF ) + 1
		this._low = v & 0xFFFF
		this._high = (~this._high + (v >>> 16)) & 0xFFFF

		return this
	}

	/**
	 * Equals
	 * @method eq
	 * @param {Object} other UINT32
	 * @return {Boolean}
	 */
	UINT32.prototype.equals = UINT32.prototype.eq = function (other) {
		return (this._low == other._low) && (this._high == other._high)
	}

	/**
	 * Greater than (strict)
	 * @method gt
	 * @param {Object} other UINT32
	 * @return {Boolean}
	 */
	UINT32.prototype.greaterThan = UINT32.prototype.gt = function (other) {
		if (this._high > other._high) return true
		if (this._high < other._high) return false
		return this._low > other._low
	}

	/**
	 * Less than (strict)
	 * @method lt
	 * @param {Object} other UINT32
	 * @return {Boolean}
	 */
	UINT32.prototype.lessThan = UINT32.prototype.lt = function (other) {
		if (this._high < other._high) return true
		if (this._high > other._high) return false
		return this._low < other._low
	}

	/**
	 * Bitwise OR
	 * @method or
	 * @param {Object} other UINT32
	 * @return ThisExpression
	 */
	UINT32.prototype.or = function (other) {
		this._low |= other._low
		this._high |= other._high

		return this
	}

	/**
	 * Bitwise AND
	 * @method and
	 * @param {Object} other UINT32
	 * @return ThisExpression
	 */
	UINT32.prototype.and = function (other) {
		this._low &= other._low
		this._high &= other._high

		return this
	}

	/**
	 * Bitwise NOT
	 * @method not
	 * @return ThisExpression
	 */
	UINT32.prototype.not = function() {
		this._low = ~this._low & 0xFFFF
		this._high = ~this._high & 0xFFFF

		return this
	}

	/**
	 * Bitwise XOR
	 * @method xor
	 * @param {Object} other UINT32
	 * @return ThisExpression
	 */
	UINT32.prototype.xor = function (other) {
		this._low ^= other._low
		this._high ^= other._high

		return this
	}

	/**
	 * Bitwise shift right
	 * @method shiftRight
	 * @param {Number} number of bits to shift
	 * @return ThisExpression
	 */
	UINT32.prototype.shiftRight = UINT32.prototype.shiftr = function (n) {
		if (n > 16) {
			this._low = this._high >> (n - 16)
			this._high = 0
		} else if (n == 16) {
			this._low = this._high
			this._high = 0
		} else {
			this._low = (this._low >> n) | ( (this._high << (16-n)) & 0xFFFF )
			this._high >>= n
		}

		return this
	}

	/**
	 * Bitwise shift left
	 * @method shiftLeft
	 * @param {Number} number of bits to shift
	 * @param {Boolean} allow overflow
	 * @return ThisExpression
	 */
	UINT32.prototype.shiftLeft = UINT32.prototype.shiftl = function (n, allowOverflow) {
		if (n > 16) {
			this._high = this._low << (n - 16)
			this._low = 0
			if (!allowOverflow) {
				this._high &= 0xFFFF
			}
		} else if (n == 16) {
			this._high = this._low
			this._low = 0
		} else {
			this._high = (this._high << n) | (this._low >> (16-n))
			this._low = (this._low << n) & 0xFFFF
			if (!allowOverflow) {
				// Overflow only allowed on the high bits...
				this._high &= 0xFFFF
			}
		}

		return this
	}

	/**
	 * Bitwise rotate left
	 * @method rotl
	 * @param {Number} number of bits to rotate
	 * @return ThisExpression
	 */
	UINT32.prototype.rotateLeft = UINT32.prototype.rotl = function (n) {
		var v = (this._high << 16) | this._low
		v = (v << n) | (v >>> (32 - n))
		this._low = v & 0xFFFF
		this._high = v >>> 16

		return this
	}

	/**
	 * Bitwise rotate right
	 * @method rotr
	 * @param {Number} number of bits to rotate
	 * @return ThisExpression
	 */
	UINT32.prototype.rotateRight = UINT32.prototype.rotr = function (n) {
		var v = (this._high << 16) | this._low
		v = (v >>> n) | (v << (32 - n))
		this._low = v & 0xFFFF
		this._high = v >>> 16

		return this
	}

	/**
	 * Clone the current _UINT32_
	 * @method clone
	 * @return {Object} cloned UINT32
	 */
	UINT32.prototype.clone = function () {
		return new UINT32(this._low, this._high)
	}

	if (typeof define != 'undefined' && define.amd) {
		// AMD / RequireJS
		define([], function () {
			return UINT32
		})
	} else if (typeof module != 'undefined' && module.exports) {
		// Node.js
		module.exports = UINT32
	} else {
		// Browser
		root['UINT32'] = UINT32
	}

})(this)

},{}],"../node_modules/cuint/lib/uint64.js":[function(require,module,exports) {
var define;
/**
	C-like unsigned 64 bits integers in Javascript
	Copyright (C) 2013, Pierre Curto
	MIT license
 */
;(function (root) {

	// Local cache for typical radices
	var radixPowerCache = {
		16: UINT64( Math.pow(16, 5) )
	,	10: UINT64( Math.pow(10, 5) )
	,	2:  UINT64( Math.pow(2, 5) )
	}
	var radixCache = {
		16: UINT64(16)
	,	10: UINT64(10)
	,	2:  UINT64(2)
	}

	/**
	 *	Represents an unsigned 64 bits integer
	 * @constructor
	 * @param {Number} first low bits (8)
	 * @param {Number} second low bits (8)
	 * @param {Number} first high bits (8)
	 * @param {Number} second high bits (8)
	 * or
	 * @param {Number} low bits (32)
	 * @param {Number} high bits (32)
	 * or
	 * @param {String|Number} integer as a string 		 | integer as a number
	 * @param {Number|Undefined} radix (optional, default=10)
	 * @return 
	 */
	function UINT64 (a00, a16, a32, a48) {
		if ( !(this instanceof UINT64) )
			return new UINT64(a00, a16, a32, a48)

		this.remainder = null
		if (typeof a00 == 'string')
			return fromString.call(this, a00, a16)

		if (typeof a16 == 'undefined')
			return fromNumber.call(this, a00)

		fromBits.apply(this, arguments)
	}

	/**
	 * Set the current _UINT64_ object with its low and high bits
	 * @method fromBits
	 * @param {Number} first low bits (8)
	 * @param {Number} second low bits (8)
	 * @param {Number} first high bits (8)
	 * @param {Number} second high bits (8)
	 * or
	 * @param {Number} low bits (32)
	 * @param {Number} high bits (32)
	 * @return ThisExpression
	 */
	function fromBits (a00, a16, a32, a48) {
		if (typeof a32 == 'undefined') {
			this._a00 = a00 & 0xFFFF
			this._a16 = a00 >>> 16
			this._a32 = a16 & 0xFFFF
			this._a48 = a16 >>> 16
			return this
		}

		this._a00 = a00 | 0
		this._a16 = a16 | 0
		this._a32 = a32 | 0
		this._a48 = a48 | 0

		return this
	}
	UINT64.prototype.fromBits = fromBits

	/**
	 * Set the current _UINT64_ object from a number
	 * @method fromNumber
	 * @param {Number} number
	 * @return ThisExpression
	 */
	function fromNumber (value) {
		this._a00 = value & 0xFFFF
		this._a16 = value >>> 16
		this._a32 = 0
		this._a48 = 0

		return this
	}
	UINT64.prototype.fromNumber = fromNumber

	/**
	 * Set the current _UINT64_ object from a string
	 * @method fromString
	 * @param {String} integer as a string
	 * @param {Number} radix (optional, default=10)
	 * @return ThisExpression
	 */
	function fromString (s, radix) {
		radix = radix || 10

		this._a00 = 0
		this._a16 = 0
		this._a32 = 0
		this._a48 = 0

		/*
			In Javascript, bitwise operators only operate on the first 32 bits 
			of a number, even though parseInt() encodes numbers with a 53 bits 
			mantissa.
			Therefore UINT64(<Number>) can only work on 32 bits.
			The radix maximum value is 36 (as per ECMA specs) (26 letters + 10 digits)
			maximum input value is m = 32bits as 1 = 2^32 - 1
			So the maximum substring length n is:
			36^(n+1) - 1 = 2^32 - 1
			36^(n+1) = 2^32
			(n+1)ln(36) = 32ln(2)
			n = 32ln(2)/ln(36) - 1
			n = 5.189644915687692
			n = 5
		 */
		var radixUint = radixPowerCache[radix] || new UINT64( Math.pow(radix, 5) )

		for (var i = 0, len = s.length; i < len; i += 5) {
			var size = Math.min(5, len - i)
			var value = parseInt( s.slice(i, i + size), radix )
			this.multiply(
					size < 5
						? new UINT64( Math.pow(radix, size) )
						: radixUint
				)
				.add( new UINT64(value) )
		}

		return this
	}
	UINT64.prototype.fromString = fromString

	/**
	 * Convert this _UINT64_ to a number (last 32 bits are dropped)
	 * @method toNumber
	 * @return {Number} the converted UINT64
	 */
	UINT64.prototype.toNumber = function () {
		return (this._a16 * 65536) + this._a00
	}

	/**
	 * Convert this _UINT64_ to a string
	 * @method toString
	 * @param {Number} radix (optional, default=10)
	 * @return {String} the converted UINT64
	 */
	UINT64.prototype.toString = function (radix) {
		radix = radix || 10
		var radixUint = radixCache[radix] || new UINT64(radix)

		if ( !this.gt(radixUint) ) return this.toNumber().toString(radix)

		var self = this.clone()
		var res = new Array(64)
		for (var i = 63; i >= 0; i--) {
			self.div(radixUint)
			res[i] = self.remainder.toNumber().toString(radix)
			if ( !self.gt(radixUint) ) break
		}
		res[i-1] = self.toNumber().toString(radix)

		return res.join('')
	}

	/**
	 * Add two _UINT64_. The current _UINT64_ stores the result
	 * @method add
	 * @param {Object} other UINT64
	 * @return ThisExpression
	 */
	UINT64.prototype.add = function (other) {
		var a00 = this._a00 + other._a00

		var a16 = a00 >>> 16
		a16 += this._a16 + other._a16

		var a32 = a16 >>> 16
		a32 += this._a32 + other._a32

		var a48 = a32 >>> 16
		a48 += this._a48 + other._a48

		this._a00 = a00 & 0xFFFF
		this._a16 = a16 & 0xFFFF
		this._a32 = a32 & 0xFFFF
		this._a48 = a48 & 0xFFFF

		return this
	}

	/**
	 * Subtract two _UINT64_. The current _UINT64_ stores the result
	 * @method subtract
	 * @param {Object} other UINT64
	 * @return ThisExpression
	 */
	UINT64.prototype.subtract = function (other) {
		return this.add( other.clone().negate() )
	}

	/**
	 * Multiply two _UINT64_. The current _UINT64_ stores the result
	 * @method multiply
	 * @param {Object} other UINT64
	 * @return ThisExpression
	 */
	UINT64.prototype.multiply = function (other) {
		/*
			a = a00 + a16 + a32 + a48
			b = b00 + b16 + b32 + b48
			a*b = (a00 + a16 + a32 + a48)(b00 + b16 + b32 + b48)
				= a00b00 + a00b16 + a00b32 + a00b48
				+ a16b00 + a16b16 + a16b32 + a16b48
				+ a32b00 + a32b16 + a32b32 + a32b48
				+ a48b00 + a48b16 + a48b32 + a48b48

			a16b48, a32b32, a48b16, a48b32 and a48b48 overflow the 64 bits
			so it comes down to:
			a*b	= a00b00 + a00b16 + a00b32 + a00b48
				+ a16b00 + a16b16 + a16b32
				+ a32b00 + a32b16
				+ a48b00
				= a00b00
				+ a00b16 + a16b00
				+ a00b32 + a16b16 + a32b00
				+ a00b48 + a16b32 + a32b16 + a48b00
		 */
		var a00 = this._a00
		var a16 = this._a16
		var a32 = this._a32
		var a48 = this._a48
		var b00 = other._a00
		var b16 = other._a16
		var b32 = other._a32
		var b48 = other._a48

		var c00 = a00 * b00

		var c16 = c00 >>> 16
		c16 += a00 * b16
		var c32 = c16 >>> 16
		c16 &= 0xFFFF
		c16 += a16 * b00

		c32 += c16 >>> 16
		c32 += a00 * b32
		var c48 = c32 >>> 16
		c32 &= 0xFFFF
		c32 += a16 * b16
		c48 += c32 >>> 16
		c32 &= 0xFFFF
		c32 += a32 * b00

		c48 += c32 >>> 16
		c48 += a00 * b48
		c48 &= 0xFFFF
		c48 += a16 * b32
		c48 &= 0xFFFF
		c48 += a32 * b16
		c48 &= 0xFFFF
		c48 += a48 * b00

		this._a00 = c00 & 0xFFFF
		this._a16 = c16 & 0xFFFF
		this._a32 = c32 & 0xFFFF
		this._a48 = c48 & 0xFFFF

		return this
	}

	/**
	 * Divide two _UINT64_. The current _UINT64_ stores the result.
	 * The remainder is made available as the _remainder_ property on
	 * the _UINT64_ object. It can be null, meaning there are no remainder.
	 * @method div
	 * @param {Object} other UINT64
	 * @return ThisExpression
	 */
	UINT64.prototype.div = function (other) {
		if ( (other._a16 == 0) && (other._a32 == 0) && (other._a48 == 0) ) {
			if (other._a00 == 0) throw Error('division by zero')

			// other == 1: this
			if (other._a00 == 1) {
				this.remainder = new UINT64(0)
				return this
			}
		}

		// other > this: 0
		if ( other.gt(this) ) {
			this.remainder = this.clone()
			this._a00 = 0
			this._a16 = 0
			this._a32 = 0
			this._a48 = 0
			return this
		}
		// other == this: 1
		if ( this.eq(other) ) {
			this.remainder = new UINT64(0)
			this._a00 = 1
			this._a16 = 0
			this._a32 = 0
			this._a48 = 0
			return this
		}

		// Shift the divisor left until it is higher than the dividend
		var _other = other.clone()
		var i = -1
		while ( !this.lt(_other) ) {
			// High bit can overflow the default 16bits
			// Its ok since we right shift after this loop
			// The overflown bit must be kept though
			_other.shiftLeft(1, true)
			i++
		}

		// Set the remainder
		this.remainder = this.clone()
		// Initialize the current result to 0
		this._a00 = 0
		this._a16 = 0
		this._a32 = 0
		this._a48 = 0
		for (; i >= 0; i--) {
			_other.shiftRight(1)
			// If shifted divisor is smaller than the dividend
			// then subtract it from the dividend
			if ( !this.remainder.lt(_other) ) {
				this.remainder.subtract(_other)
				// Update the current result
				if (i >= 48) {
					this._a48 |= 1 << (i - 48)
				} else if (i >= 32) {
					this._a32 |= 1 << (i - 32)
				} else if (i >= 16) {
					this._a16 |= 1 << (i - 16)
				} else {
					this._a00 |= 1 << i
				}
			}
		}

		return this
	}

	/**
	 * Negate the current _UINT64_
	 * @method negate
	 * @return ThisExpression
	 */
	UINT64.prototype.negate = function () {
		var v = ( ~this._a00 & 0xFFFF ) + 1
		this._a00 = v & 0xFFFF
		v = (~this._a16 & 0xFFFF) + (v >>> 16)
		this._a16 = v & 0xFFFF
		v = (~this._a32 & 0xFFFF) + (v >>> 16)
		this._a32 = v & 0xFFFF
		this._a48 = (~this._a48 + (v >>> 16)) & 0xFFFF

		return this
	}

	/**

	 * @method eq
	 * @param {Object} other UINT64
	 * @return {Boolean}
	 */
	UINT64.prototype.equals = UINT64.prototype.eq = function (other) {
		return (this._a48 == other._a48) && (this._a00 == other._a00)
			 && (this._a32 == other._a32) && (this._a16 == other._a16)
	}

	/**
	 * Greater than (strict)
	 * @method gt
	 * @param {Object} other UINT64
	 * @return {Boolean}
	 */
	UINT64.prototype.greaterThan = UINT64.prototype.gt = function (other) {
		if (this._a48 > other._a48) return true
		if (this._a48 < other._a48) return false
		if (this._a32 > other._a32) return true
		if (this._a32 < other._a32) return false
		if (this._a16 > other._a16) return true
		if (this._a16 < other._a16) return false
		return this._a00 > other._a00
	}

	/**
	 * Less than (strict)
	 * @method lt
	 * @param {Object} other UINT64
	 * @return {Boolean}
	 */
	UINT64.prototype.lessThan = UINT64.prototype.lt = function (other) {
		if (this._a48 < other._a48) return true
		if (this._a48 > other._a48) return false
		if (this._a32 < other._a32) return true
		if (this._a32 > other._a32) return false
		if (this._a16 < other._a16) return true
		if (this._a16 > other._a16) return false
		return this._a00 < other._a00
	}

	/**
	 * Bitwise OR
	 * @method or
	 * @param {Object} other UINT64
	 * @return ThisExpression
	 */
	UINT64.prototype.or = function (other) {
		this._a00 |= other._a00
		this._a16 |= other._a16
		this._a32 |= other._a32
		this._a48 |= other._a48

		return this
	}

	/**
	 * Bitwise AND
	 * @method and
	 * @param {Object} other UINT64
	 * @return ThisExpression
	 */
	UINT64.prototype.and = function (other) {
		this._a00 &= other._a00
		this._a16 &= other._a16
		this._a32 &= other._a32
		this._a48 &= other._a48

		return this
	}

	/**
	 * Bitwise XOR
	 * @method xor
	 * @param {Object} other UINT64
	 * @return ThisExpression
	 */
	UINT64.prototype.xor = function (other) {
		this._a00 ^= other._a00
		this._a16 ^= other._a16
		this._a32 ^= other._a32
		this._a48 ^= other._a48

		return this
	}

	/**
	 * Bitwise NOT
	 * @method not
	 * @return ThisExpression
	 */
	UINT64.prototype.not = function() {
		this._a00 = ~this._a00 & 0xFFFF
		this._a16 = ~this._a16 & 0xFFFF
		this._a32 = ~this._a32 & 0xFFFF
		this._a48 = ~this._a48 & 0xFFFF

		return this
	}

	/**
	 * Bitwise shift right
	 * @method shiftRight
	 * @param {Number} number of bits to shift
	 * @return ThisExpression
	 */
	UINT64.prototype.shiftRight = UINT64.prototype.shiftr = function (n) {
		n %= 64
		if (n >= 48) {
			this._a00 = this._a48 >> (n - 48)
			this._a16 = 0
			this._a32 = 0
			this._a48 = 0
		} else if (n >= 32) {
			n -= 32
			this._a00 = ( (this._a32 >> n) | (this._a48 << (16-n)) ) & 0xFFFF
			this._a16 = (this._a48 >> n) & 0xFFFF
			this._a32 = 0
			this._a48 = 0
		} else if (n >= 16) {
			n -= 16
			this._a00 = ( (this._a16 >> n) | (this._a32 << (16-n)) ) & 0xFFFF
			this._a16 = ( (this._a32 >> n) | (this._a48 << (16-n)) ) & 0xFFFF
			this._a32 = (this._a48 >> n) & 0xFFFF
			this._a48 = 0
		} else {
			this._a00 = ( (this._a00 >> n) | (this._a16 << (16-n)) ) & 0xFFFF
			this._a16 = ( (this._a16 >> n) | (this._a32 << (16-n)) ) & 0xFFFF
			this._a32 = ( (this._a32 >> n) | (this._a48 << (16-n)) ) & 0xFFFF
			this._a48 = (this._a48 >> n) & 0xFFFF
		}

		return this
	}

	/**
	 * Bitwise shift left
	 * @method shiftLeft
	 * @param {Number} number of bits to shift
	 * @param {Boolean} allow overflow
	 * @return ThisExpression
	 */
	UINT64.prototype.shiftLeft = UINT64.prototype.shiftl = function (n, allowOverflow) {
		n %= 64
		if (n >= 48) {
			this._a48 = this._a00 << (n - 48)
			this._a32 = 0
			this._a16 = 0
			this._a00 = 0
		} else if (n >= 32) {
			n -= 32
			this._a48 = (this._a16 << n) | (this._a00 >> (16-n))
			this._a32 = (this._a00 << n) & 0xFFFF
			this._a16 = 0
			this._a00 = 0
		} else if (n >= 16) {
			n -= 16
			this._a48 = (this._a32 << n) | (this._a16 >> (16-n))
			this._a32 = ( (this._a16 << n) | (this._a00 >> (16-n)) ) & 0xFFFF
			this._a16 = (this._a00 << n) & 0xFFFF
			this._a00 = 0
		} else {
			this._a48 = (this._a48 << n) | (this._a32 >> (16-n))
			this._a32 = ( (this._a32 << n) | (this._a16 >> (16-n)) ) & 0xFFFF
			this._a16 = ( (this._a16 << n) | (this._a00 >> (16-n)) ) & 0xFFFF
			this._a00 = (this._a00 << n) & 0xFFFF
		}
		if (!allowOverflow) {
			this._a48 &= 0xFFFF
		}

		return this
	}

	/**
	 * Bitwise rotate left
	 * @method rotl
	 * @param {Number} number of bits to rotate
	 * @return ThisExpression
	 */
	UINT64.prototype.rotateLeft = UINT64.prototype.rotl = function (n) {
		n %= 64
		if (n == 0) return this
		if (n >= 32) {
			// A.B.C.D
			// B.C.D.A rotl(16)
			// C.D.A.B rotl(32)
			var v = this._a00
			this._a00 = this._a32
			this._a32 = v
			v = this._a48
			this._a48 = this._a16
			this._a16 = v
			if (n == 32) return this
			n -= 32
		}

		var high = (this._a48 << 16) | this._a32
		var low = (this._a16 << 16) | this._a00

		var _high = (high << n) | (low >>> (32 - n))
		var _low = (low << n) | (high >>> (32 - n))

		this._a00 = _low & 0xFFFF
		this._a16 = _low >>> 16
		this._a32 = _high & 0xFFFF
		this._a48 = _high >>> 16

		return this
	}

	/**
	 * Bitwise rotate right
	 * @method rotr
	 * @param {Number} number of bits to rotate
	 * @return ThisExpression
	 */
	UINT64.prototype.rotateRight = UINT64.prototype.rotr = function (n) {
		n %= 64
		if (n == 0) return this
		if (n >= 32) {
			// A.B.C.D
			// D.A.B.C rotr(16)
			// C.D.A.B rotr(32)
			var v = this._a00
			this._a00 = this._a32
			this._a32 = v
			v = this._a48
			this._a48 = this._a16
			this._a16 = v
			if (n == 32) return this
			n -= 32
		}

		var high = (this._a48 << 16) | this._a32
		var low = (this._a16 << 16) | this._a00

		var _high = (high >>> n) | (low << (32 - n))
		var _low = (low >>> n) | (high << (32 - n))

		this._a00 = _low & 0xFFFF
		this._a16 = _low >>> 16
		this._a32 = _high & 0xFFFF
		this._a48 = _high >>> 16

		return this
	}

	/**
	 * Clone the current _UINT64_
	 * @method clone
	 * @return {Object} cloned UINT64
	 */
	UINT64.prototype.clone = function () {
		return new UINT64(this._a00, this._a16, this._a32, this._a48)
	}

	if (typeof define != 'undefined' && define.amd) {
		// AMD / RequireJS
		define([], function () {
			return UINT64
		})
	} else if (typeof module != 'undefined' && module.exports) {
		// Node.js
		module.exports = UINT64
	} else {
		// Browser
		root['UINT64'] = UINT64
	}

})(this)

},{}],"../node_modules/cuint/index.js":[function(require,module,exports) {
exports.UINT32 = require('./lib/uint32')
exports.UINT64 = require('./lib/uint64')
},{"./lib/uint32":"../node_modules/cuint/lib/uint32.js","./lib/uint64":"../node_modules/cuint/lib/uint64.js"}],"v2/optimizer.js":[function(require,module,exports) {
const randfloat = (arr, min, max, basePrice, cb = v => v) => {
  arr.push([min, max].map(v => v * basePrice).map(v => v + 0.99999).map(v => Math.trunc(v)).map(cb));
};

const pattern0 = basePrice => {
  const probabilities = [];
  const current = [];

  for (let decPhaseLen1 = 2; decPhaseLen1 <= 3; decPhaseLen1++) {
    const decPhaseLen2 = 5 - decPhaseLen1;

    for (let hiPhaseLen1 = 0; hiPhaseLen1 <= 6; hiPhaseLen1++) {
      const hiPhaseLen2and3 = 7 - hiPhaseLen1;

      for (let hiPhaseLen3 = 0; hiPhaseLen3 < hiPhaseLen2and3; hiPhaseLen3++) {
        // high phase 1
        for (let i = 0; i < hiPhaseLen1; i++) {
          randfloat(current, 0.9, 1.4, basePrice);
        } // decreasing phase 1


        for (let i = 0; i < decPhaseLen1; i++) {
          randfloat(current, 0.6 - 0.04 * i - 0.06 * i, 0.8 - 0.04 * i, basePrice);
        } // high phase 2


        for (let i = 0; i < hiPhaseLen2and3 - hiPhaseLen3; i++) {
          randfloat(current, 0.9, 1.4, basePrice);
        } // decreasing phase 2


        for (let i = 0; i < decPhaseLen2; i++) {
          randfloat(current, 0.6 - 0.04 * i - 0.06 * i, 0.8 - 0.04 * i, basePrice);
        } // high phase 3


        for (let i = 0; i < hiPhaseLen3; i++) {
          randfloat(current, 0.9, 1.4, basePrice);
        } // commit probability


        probabilities.push([...current]);
        current.length = 0;
      }
    }
  }

  return probabilities;
};

const pattern1 = basePrice => {
  const probabilities = [];
  const current = [];

  for (let peakStart = 3; peakStart <= 9; peakStart++) {
    let work = 2;

    for (; work < peakStart; work++) {
      randfloat(current, 0.85 - 0.03 * (work - 2) - 0.02 * (work - 2), 0.9 - 0.03 * (work - 2), basePrice);
    }

    randfloat(current, 0.9, 1.4, basePrice);
    randfloat(current, 1.4, 2.0, basePrice);
    randfloat(current, 2.0, 6.0, basePrice);
    randfloat(current, 1.4, 2.0, basePrice);
    randfloat(current, 0.9, 1.4, basePrice);
    work += 5;

    for (; work < 14; work++) {
      randfloat(current, 0.4, 0.9, basePrice);
    } // commit probability


    probabilities.push([...current]);
    current.length = 0;
  }

  return probabilities;
};

const pattern2 = basePrice => {
  const current = [];
  let work = 2;

  for (; work < 14; work++) {
    randfloat(current, 0.9 - 0.05 - 0.03 * (work - 2) - 0.02 * (work - 2), 0.9 - 0.03 * (work - 2), basePrice);
  }

  return [current];
};

const pattern3 = basePrice => {
  const probabilities = [];
  const current = [];

  for (let peakStart = 0; peakStart <= 9; peakStart++) {
    let work = 2;

    for (; work < peakStart; work++) {
      randfloat(current, 0.4 - 0.03 * (work - 2) - 0.02 * (work - 2), 0.9 - 0.03 * (work - 2), basePrice);
    }

    randfloat(current, 0.9, 1.4, basePrice);
    randfloat(current, 0.9, 1.4, basePrice);
    randfloat(current, 1.4, 2.0, basePrice, v => v - 1);
    randfloat(current, 1.4, 2.0, basePrice);
    randfloat(current, 1.4, 2.0, basePrice, v => v - 1);
    work += 5;

    for (let i = work; work < 14; work++) {
      randfloat(current, 0.4 - 0.03 * (work - i) - 0.02 * (work - i), 0.9 - 0.03 * (work - i), basePrice);
    }

    probabilities.push([...current]);
    current.length = 0;
  }

  return probabilities;
};

const explodeBasePrices = fn => {
  return Array.from({
    length: 21
  }, (v, i) => i + 90).reduce((prev, basePrice) => [...prev, ...fn(basePrice)], []);
};

const filterByPattern = filters => pattern => pattern.every(([min, max], i) => filters[i + 1] ? min <= filters[i + 1] && max >= filters[i + 1] : true);

const possiblePatterns = filters => {
  const patterns = Array.from({
    length: 4
  }, (v, i) => i);
  const fns = [pattern0, pattern1, pattern2, pattern3];
  const result = [];
  patterns.forEach(fn => {
    let posibilities;
    const basePrice = filters[0];

    if (!basePrice || basePrice < 90 || basePrice > 110) {
      posibilities = explodeBasePrices(fns[fn]);
    } else {
      posibilities = fns[fn](filters[0]);
    }

    const filtered = posibilities.filter(filterByPattern(filters));
    result.push(filtered);
  });
  return result;
}; // Take all patternsOptions and make them single [min, max] values.


const minMaxReducer = (prev, current) => {
  return prev.map(([min, max], i) => {
    const [newMin, newMax] = current[i];
    return [min > newMin ? newMin : min, max < newMax ? newMax : max];
  });
};

const averageReducer = (prev, current) => {
  return prev.map(([avg, count, flag], i) => {
    const [min, max] = current[i];
    if (!flag) return [(avg + count + min + max) / 4, 4, true];
    return [(avg * count + min + max) / (count + 2), count + 2, true];
  });
};

const patternReducer = (patternsCategories, reducer = minMaxReducer) => {
  const allPatterns = patternsCategories.reduce((acc, current) => [...acc, ...current], []);
  if (allPatterns.length === 0) return [];
  if (allPatterns.length === 1) return [...allPatterns, ...allPatterns].reduce(reducer);
  return allPatterns.reduce(reducer);
};

module.exports = {
  possiblePatterns,
  patternReducer,
  minMaxReducer,
  averageReducer
};
},{}],"v2/calculator.js":[function(require,module,exports) {
const {
  UINT32,
  UINT64
} = require("cuint");

const {
  possiblePatterns,
  patternReducer
} = require("./optimizer");

const initCalc = (arg, plus) => UINT32(0x6c078965).multiply(arg.clone().xor(arg.clone().shiftRight(30))).add(UINT32(plus));

const initContext = seed => {
  const $c0 = initCalc(UINT32(seed), 1);
  const $c1 = initCalc($c0, 2);
  const $c2 = initCalc($c1, 3);
  const $c3 = initCalc($c2, 4);
  return [$c0, $c1, $c2, $c3];
};

const getUINT32 = $c => {
  const [$c0, $c1, $c2, $c3] = $c;
  const n = $c0.clone().xor($c0.clone().shiftLeft(11));
  $c.splice(0, 5, $c1, $c2, $c3, n.clone().xor(n.clone().shiftRight(8)).xor($c3).xor($c3.clone().shiftRight(19)));
  return $c[3].clone();
};

const randint = ($c, min, max) => {
  return UINT64(getUINT32($c).toNumber()).multiply(UINT64(max).subtract(UINT64(min)).add(UINT64(1))).shiftRight(32).add(UINT64(min)).toNumber();
};

const randfloat = ($c, a, b) => {
  const val = UINT32(0x3f800000).or(getUINT32($c).shiftRight(9)).toNumber();
  const view = new DataView(new ArrayBuffer(32));
  view.setUint32(0, val);
  const valf = view.getFloat32();
  return a + (valf - 1.0) * (b - a);
};

const randbool = $c => {
  return getUINT32($c).and(UINT32(0x80000000)).toNumber();
};

const intceil = val => {
  return Math.trunc(val + 0.99999);
};

function* calculate(seed, pattern) {
  const $c = initContext(seed);
  const basePrice = randint($c, 90, 110);
  yield basePrice;
  const chance = randint($c, 0, 99); // select the next pattern

  let whatPattern;

  switch (pattern) {
    case 0:
      if (chance < 20) {
        whatPattern = 0;
      } else if (chance < 50) {
        whatPattern = 1;
      } else if (chance < 65) {
        whatPattern = 2;
      } else {
        whatPattern = 3;
      }

      break;

    case 1:
      if (chance < 50) {
        whatPattern = 0;
      } else if (chance < 55) {
        whatPattern = 1;
      } else if (chance < 75) {
        whatPattern = 2;
      } else {
        whatPattern = 3;
      }

      break;

    case 2:
      if (chance < 25) {
        whatPattern = 0;
      } else if (chance < 70) {
        whatPattern = 1;
      } else if (chance < 75) {
        whatPattern = 2;
      } else {
        whatPattern = 3;
      }

      break;

    case 3:
      if (chance < 45) {
        whatPattern = 0;
      } else if (chance < 70) {
        whatPattern = 1;
      } else if (chance < 85) {
        whatPattern = 2;
      } else {
        whatPattern = 3;
      }

      break;

    default:
      whatPattern = 2;
      break;
  }

  yield whatPattern;
  const sellPrices = new Array(14);
  sellPrices[0] = basePrice;
  sellPrices[1] = basePrice;
  let work;
  let decPhaseLen1;
  let decPhaseLen2;
  let peakStart;
  let hiPhaseLen1;
  let hiPhaseLen2and3;
  let hiPhaseLen3;
  let rate;

  switch (whatPattern) {
    case 0:
      // PATTERN 0: high, decreasing, high, decreasing, high
      work = 2;
      decPhaseLen1 = randbool($c) ? 3 : 2;
      decPhaseLen2 = 5 - decPhaseLen1;
      hiPhaseLen1 = randint($c, 0, 6);
      hiPhaseLen2and3 = 7 - hiPhaseLen1;
      hiPhaseLen3 = randint($c, 0, hiPhaseLen2and3 - 1); // high phase 1

      for (let i = 0; i < hiPhaseLen1; i += 1) {
        yield sellPrices[work++] = intceil(randfloat($c, 0.9, 1.4) * basePrice);
      } // decreasing phase 1


      rate = randfloat($c, 0.8, 0.6);

      for (let i = 0; i < decPhaseLen1; i++) {
        yield sellPrices[work++] = intceil(rate * basePrice);
        rate -= 0.04;
        rate -= randfloat($c, 0, 0.06);
      } // high phase 2


      for (let i = 0; i < hiPhaseLen2and3 - hiPhaseLen3; i++) {
        yield sellPrices[work++] = intceil(randfloat($c, 0.9, 1.4) * basePrice);
      } // decreasing phase 2


      rate = randfloat($c, 0.8, 0.6);

      for (let i = 0; i < decPhaseLen2; i++) {
        yield sellPrices[work++] = intceil(rate * basePrice);
        rate -= 0.04;
        rate -= randfloat($c, 0, 0.06);
      } // high phase 3


      for (let i = 0; i < hiPhaseLen3; i++) {
        yield sellPrices[work++] = intceil(randfloat($c, 0.9, 1.4) * basePrice);
      }

      break;

    case 1:
      // PATTERN 1: decreasing middle, high spike, random low
      peakStart = randint($c, 3, 9);
      rate = randfloat($c, 0.9, 0.85);

      for (work = 2; work < peakStart; work++) {
        yield sellPrices[work] = intceil(rate * basePrice);
        rate -= 0.03;
        rate -= randfloat($c, 0, 0.02);
      }

      yield sellPrices[work++] = intceil(randfloat($c, 0.9, 1.4) * basePrice);
      yield sellPrices[work++] = intceil(randfloat($c, 1.4, 2.0) * basePrice);
      yield sellPrices[work++] = intceil(randfloat($c, 2.0, 6.0) * basePrice);
      yield sellPrices[work++] = intceil(randfloat($c, 1.4, 2.0) * basePrice);
      yield sellPrices[work++] = intceil(randfloat($c, 0.9, 1.4) * basePrice);

      for (; work < 14; work++) {
        yield sellPrices[work] = intceil(randfloat($c, 0.4, 0.9) * basePrice);
      }

      break;

    case 2:
      // PATTERN 2: consistently decreasing
      rate = 0.9;
      rate -= randfloat($c, 0, 0.05);

      for (work = 2; work < 14; work++) {
        yield sellPrices[work] = intceil(rate * basePrice);
        rate -= 0.03;
        rate -= randfloat($c, 0, 0.02);
      }

      break;

    case 3:
      // PATTERN 3: decreasing, spike, decreasing
      peakStart = randint($c, 2, 9); // decreasing phase before the peak

      rate = randfloat($c, 0.9, 0.4);

      for (work = 2; work < peakStart; work++) {
        yield sellPrices[work] = intceil(rate * basePrice);
        rate -= 0.03;
        rate -= randfloat($c, 0, 0.02);
      }

      yield sellPrices[work++] = intceil(randfloat($c, 0.9, 1.4) * basePrice);
      yield sellPrices[work++] = intceil(randfloat($c, 0.9, 1.4) * basePrice);
      rate = randfloat($c, 1.4, 2.0);
      yield sellPrices[work++] = intceil(randfloat($c, 1.4, rate) * basePrice) - 1;
      yield sellPrices[work++] = intceil(rate * basePrice);
      yield sellPrices[work++] = intceil(randfloat($c, 1.4, rate) * basePrice) - 1; // decreasing phase after the peak

      if (work < 14) {
        rate = randfloat($c, 0.9, 0.4);

        for (; work < 14; work++) {
          yield sellPrices[work] = intceil(rate * basePrice);
          rate -= 0.03;
          rate -= randfloat($c, 0, 0.02);
        }
      }

      break;

    default:
      break;
  }
}

const $average = (array, index, count, next) => array.splice(index, 1, (count * array[index] + next) / (count + 1));

const $minMax = (current, result) => {
  if (current[0] > result) current.splice(0, 1, result);
  if (current[1] < result) current.splice(1, 1, result);
};

const makePaternFilter = patterns => {
  return patterns.map((options, i) => [options.length, i]).filter(([v]) => v).map(([, i]) => i);
};

const optimizeFilters = filters => {
  const [basePrice = 0] = filters;
  const patterns = possiblePatterns(filters);
  const minMaxPatterns = patternReducer(patterns); // Create a copy, with size 14. [baseprice, patterns, ...weekPrices]

  const $filters = Array.from({
    length: 14
  }, (val, i) => filters[i + 1] || 0);
  const patternFilter = makePaternFilter(patterns);
  return $filters.map((filter, index) => {
    if (index === 0) {
      return [basePrice] || minMaxPatterns[0];
    }

    if (index === 1) {
      return patternFilter;
    }

    return filter ? [filter, filter] : minMaxPatterns[index];
  });
};

function* yieldCalculate(filters = []) {
  let count = 0;
  let total = 0;
  const average = Array.from({
    length: 13
  }, () => 0);
  const minMax = Array.from({
    length: 13
  }, () => [Infinity, -Infinity]);
  const results = Array.from({
    length: 13
  }, () => 0);
  const $filters = optimizeFilters(filters);
  const randomStart = Math.trunc(Math.random() * 0xffffffff);

  for (let i = 0; i < 0xffffffff; i++) {
    for (let ii = 0; ii < 4; ii++) {
      const calculator = calculate((randomStart + i) % 0xffffffff, ii);
      const success = $filters.every((filter, index) => {
        const {
          value
        } = calculator.next(); // Short circuit more useless iterations

        if (index === 0 && !filter.includes(value)) ii += 4;
        if (index === 1 && !filter.includes(value)) ii += 4; // Copy the resulting array

        results.splice(index, 1, value);
        const [min, max] = filter;
        return min <= value && max >= value;
      });

      if (success) {
        // eslint-disable-next-line no-loop-func
        results.forEach((result, index) => {
          $average(average, index, count, result);
          $minMax(minMax[index], result);
        });
        count += 1;
      }
    }

    total += 1;
    yield [total, count, minMax, average];
  }
}

function* yieldCalculateByTime(filters = [], ms) {
  const calculator = yieldCalculate(filters);
  let flag = Date.now();
  let result = calculator.next();

  while (!result.done) {
    if (Date.now() - flag > ms) {
      yield result.value;
      flag = Date.now();
    }

    result = calculator.next();
  }
}

module.exports = {
  yieldCalculate,
  yieldCalculateByTime,
  initContext,
  randint,
  randfloat,
  randbool
};
},{"cuint":"../node_modules/cuint/index.js","./optimizer":"v2/optimizer.js"}],"v2/worker.js":[function(require,module,exports) {
const {
  yieldCalculateByTime
} = require("./calculator");

let paused;
let instance;
let result;

const workUnit = () => {
  if (!instance) return;
  result = instance.next();

  if (!result.done && !paused) {
    setTimeout(workUnit, 0);
  }

  postMessage(result);
};

onmessage = ({
  data: [action, ...args]
}) => {
  console.log("worker message received", action);

  switch (action) {
    case "start":
      paused = false;
      instance = yieldCalculateByTime(args, 1000);
      workUnit();
      break;

    case "pause":
      paused = true;
      break;

    case "stop":
      paused = true;
      instance = null;
      break;

    case "restart":
      paused = false;
      if (!instance) instance = yieldCalculateByTime(args, 1000);
      workUnit();
      break;

    default:
      break;
  }
};
},{"./calculator":"v2/calculator.js"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55283" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","v2/worker.js"], null)
//# sourceMappingURL=/worker.53c1c96d.js.map