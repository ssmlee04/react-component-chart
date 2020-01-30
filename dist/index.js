"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _d3Format = require("d3-format");

var _reactWindowSize = _interopRequireDefault(require("react-window-size"));

var _d3TimeFormat = require("d3-time-format");

var _reactStockcharts = require("react-stockcharts");

var _annotation = require("react-stockcharts/lib/annotation");

var _series = require("react-stockcharts/lib/series");

var _axes = require("react-stockcharts/lib/axes");

var _coordinates = require("react-stockcharts/lib/coordinates");

var _scale = require("react-stockcharts/lib/scale");

var _tooltip = require("react-stockcharts/lib/tooltip");

var _indicator = require("react-stockcharts/lib/indicator");

var _helper = require("react-stockcharts/lib/helper");

var _utils = require("react-stockcharts/lib/utils");

var _PatternsDisplayer = _interopRequireDefault(require("./PatternsDisplayer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var annotationProps = {
  fontFamily: "Glyphicons Halflings",
  fontSize: 10,
  fill: "rgba(0,46,120,0.7)",
  opacity: 0.8,
  text: "▲",
  y: function y(_ref) {
    var yScale = _ref.yScale;
    return yScale.range()[0] + 20;
  },
  onClick: function onClick() {},
  tooltip: function tooltip(d) {
    return (0, _d3TimeFormat.timeFormat)("%B")(d.date);
  } // onMouseOver: console.log.bind(console),

};
var macdCalculator = (0, _indicator.macd)().options({
  fast: 12,
  slow: 26,
  signal: 9
}).merge(function (d, c) {
  d.macd = c;
}).accessor(function (d) {
  return d.macd;
});
var sma20 = (0, _indicator.sma)().id(0).stroke('rgba(200,0,10,0.5)').options({
  windowSize: 20
}).merge(function (d, c) {
  d.sma20 = c;
}).accessor(function (d) {
  return d.sma20;
});
var sma50 = (0, _indicator.sma)().id(2).stroke('orange').options({
  windowSize: 50
}).merge(function (d, c) {
  d.sma50 = c;
}).accessor(function (d) {
  return d.sma50;
});
var sma200 = (0, _indicator.sma)().id(2).stroke('rgba(20,20,190,0.5)').options({
  windowSize: 200
}).merge(function (d, c) {
  d.sma200 = c;
}).accessor(function (d) {
  return d.sma200;
});
var smaVolume50 = (0, _indicator.sma)().id(3).options({
  windowSize: 50,
  sourcePath: "volume"
}).merge(function (d, c) {
  d.smaVolume50 = c;
}).accessor(function (d) {
  return d.smaVolume50;
});
var macdAppearance = {
  width: 7,
  stroke: {
    macd: 'rgba(170,0,0,0.5)',
    signal: 'rgba(1,70,32,0.5)'
  },
  fill: {
    divergence: "#00468b"
  }
};
var candlesAppearance = {
  fill: function fill(d) {
    return d.close > d.open ? "rgba(0,166,81,0.7)" : "rgba(204,36,36,0.5)";
  },
  widthRatio: 0.8
};

var ChartBig =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ChartBig, _React$Component);

  function ChartBig() {
    _classCallCheck(this, ChartBig);

    return _possibleConstructorReturn(this, _getPrototypeOf(ChartBig).apply(this, arguments));
  }

  _createClass(ChartBig, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          _this$props$shift = _this$props.shift,
          shift = _this$props$shift === void 0 ? 0 : _this$props$shift,
          _this$props$numSticks = _this$props.numSticksToDisplay,
          numSticksToDisplay = _this$props$numSticks === void 0 ? 120 : _this$props$numSticks,
          initialData = _this$props.data,
          width = _this$props.width,
          ratio = _this$props.ratio,
          _this$props$height = _this$props.height,
          height = _this$props$height === void 0 ? 300 : _this$props$height,
          windowWidth = _this$props.windowWidth;
      if (!initialData) return null;
      if (!initialData.length) return null;
      if (initialData.length - 2 - shift < 0) return null;
      var patterns = initialData[initialData.length - 1 - shift].patterns || initialData[initialData.length - 2 - shift].patterns;
      var maxWindowSize = 9999;
      var dataToCalculate = initialData.slice(-maxWindowSize);
      var calculatedData = macdCalculator(smaVolume50(sma200(sma50(sma20(dataToCalculate)))));

      var xScaleProvider = _scale.discontinuousTimeScaleProvider.inputDateAccessor(function (d) {
        return d.date;
      });

      var _xScaleProvider = xScaleProvider(calculatedData),
          data = _xScaleProvider.data,
          xScale = _xScaleProvider.xScale,
          xAccessor = _xScaleProvider.xAccessor,
          displayXAccessor = _xScaleProvider.displayXAccessor;

      var start = xAccessor((0, _utils.last)(data));
      var end = xAccessor(data[Math.max(0, data.length - numSticksToDisplay)]);
      var xExtents = [start - shift, end - shift];
      var gridHeight = height;
      var gridWidth = width;
      var showGrid = true;
      var yGrid = showGrid ? {
        innerTickSize: -1 * gridWidth
      } : {};
      var xGrid = showGrid ? {
        innerTickSize: -1 * gridHeight
      } : {};
      var ticks = 5;

      if (windowWidth < 720) {
        ticks = 2;
      }

      return _react["default"].createElement("div", {
        className: "row no-gutters chart-chart bg-lightgray-ultra-5 margin-bottom-10"
      }, _react["default"].createElement(_reactStockcharts.ChartCanvas, {
        height: height * 1.2 // seriesName={seriesName}
        ,
        ratio: ratio,
        width: width,
        clip: false,
        panEvent: true,
        zoomEvent: false // onLoadMore={this.props.onLoadMoreData}
        ,
        padding: 5,
        margin: {
          left: 5,
          right: windowWidth > 720 ? 50 : 35,
          top: 10,
          bottom: 40
        },
        type: 'hybrid',
        data: data,
        xScale: xScale,
        xAccessor: xAccessor,
        displayXAccessor: displayXAccessor,
        xExtents: xExtents
      }, _react["default"].createElement(_reactStockcharts.Chart, {
        id: 1,
        height: height * 0.8,
        yExtents: [function (d) {
          return [d.high, d.low];
        }, sma20.accessor(), sma50.accessor(), sma200.accessor()],
        origin: function origin(w, h) {
          return [0, 0];
        },
        padding: {
          top: 10,
          bottom: 20
        }
      }, _react["default"].createElement(_axes.XAxis, _extends({
        tickStroke: '#999999',
        axisAt: "bottom",
        orient: "bottom",
        ticks: ticks
      }, xGrid)), _react["default"].createElement(_axes.YAxis, _extends({
        tickStroke: '#cccccc',
        axisAt: "right",
        orient: "right",
        ticks: 5
      }, yGrid)), _react["default"].createElement(_coordinates.MouseCoordinateY, {
        at: "right",
        orient: "right",
        displayFormat: (0, _d3Format.format)(".1f")
      }), _react["default"].createElement(_series.CandlestickSeries, candlesAppearance), _react["default"].createElement(_series.LineSeries, {
        yAccessor: sma20.accessor(),
        stroke: sma20.stroke()
      }), _react["default"].createElement(_series.LineSeries, {
        yAccessor: sma50.accessor(),
        stroke: sma50.stroke()
      }), _react["default"].createElement(_series.LineSeries, {
        yAccessor: sma200.accessor(),
        stroke: sma200.stroke()
      }), _react["default"].createElement(_tooltip.OHLCTooltip, {
        origin: [0, 0]
      }), _react["default"].createElement(_tooltip.MovingAverageTooltip, {
        options: [{
          yAccessor: sma20.accessor(),
          type: "SMA",
          stroke: sma20.stroke(),
          windowSize: sma20.options().windowSize
        }, {
          yAccessor: sma50.accessor(),
          type: "SMA",
          stroke: sma50.stroke(),
          windowSize: sma50.options().windowSize
        }, {
          yAccessor: sma200.accessor(),
          type: "SMA",
          stroke: sma200.stroke(),
          windowSize: sma200.options().windowSize
        }]
      }), _react["default"].createElement(_annotation.Annotate, {
        "with": _annotation.LabelAnnotation,
        when: function when(d) {
          return d.patterns;
        },
        usingProps: annotationProps
      })), _react["default"].createElement(_reactStockcharts.Chart, {
        id: 2,
        yExtents: [function (d) {
          return d.volume;
        }, smaVolume50.accessor()],
        height: height * 0.2,
        origin: function origin(w, h) {
          return [0, h * 0.58];
        }
      }, _react["default"].createElement(_coordinates.MouseCoordinateY, {
        at: "left",
        orient: "left",
        displayFormat: (0, _d3Format.format)(".4s")
      }), _react["default"].createElement(_series.BarSeries, {
        yAccessor: function yAccessor(d) {
          return d.volume;
        },
        fill: function fill(d) {
          return d.close > d.open ? "rgba(0,166,81,0.3)" : "rgba(204,36,36,0.3)";
        }
      }), _react["default"].createElement(_coordinates.CurrentCoordinate, {
        yAccessor: smaVolume50.accessor(),
        fill: smaVolume50.stroke()
      }), _react["default"].createElement(_coordinates.CurrentCoordinate, {
        yAccessor: function yAccessor(d) {
          return d.volume;
        },
        fill: "#9B0A47"
      }), _react["default"].createElement(_coordinates.EdgeIndicator, {
        itemType: "last",
        orient: "right",
        edgeAt: "right",
        yAccessor: function yAccessor(d) {
          return d.volume;
        },
        displayFormat: (0, _d3Format.format)(".4s"),
        fill: 'black'
      })), _react["default"].createElement(_reactStockcharts.Chart, {
        id: 3,
        yExtents: macdCalculator.accessor(),
        height: height * 0.2,
        origin: function origin(w, h) {
          return [0, h * 0.87];
        }
      }, _react["default"].createElement(_axes.YAxis, _extends({
        tickStroke: '#cccccc',
        axisAt: "right",
        orient: "right",
        ticks: 5
      }, yGrid)), _react["default"].createElement(_coordinates.MouseCoordinateX, {
        at: "bottom",
        orient: "bottom",
        displayFormat: (0, _d3TimeFormat.timeFormat)('%Y-%m-%d')
      }), _react["default"].createElement(_coordinates.MouseCoordinateY, {
        at: "right",
        orient: "right",
        displayFormat: (0, _d3Format.format)('.2f')
      }), _react["default"].createElement(_series.MACDSeries, _extends({
        yAccessor: function yAccessor(d) {
          return d.macd;
        }
      }, macdAppearance)), _react["default"].createElement(_tooltip.MACDTooltip, {
        origin: [0, 0],
        yAccessor: function yAccessor(d) {
          return d.macd;
        },
        options: macdCalculator.options(),
        appearance: macdAppearance
      })), _react["default"].createElement(_coordinates.CrossHairCursor, null)), _react["default"].createElement(_PatternsDisplayer["default"], {
        patterns: patterns
      }));
    }
  }]);

  return ChartBig;
}(_react["default"].Component);

ChartBig.propTypes = {
  data: _propTypes["default"].array.isRequired,
  width: _propTypes["default"].number.isRequired,
  ratio: _propTypes["default"].number.isRequired,
  type: _propTypes["default"].oneOf(['svg', 'hybrid']).isRequired
};
ChartBig.defaultProps = {
  type: "svg"
}; // eslint-disable-next-line

ChartBig = (0, _helper.fitWidth)(ChartBig);

var _default = (0, _reactWindowSize["default"])(ChartBig);

exports["default"] = _default;