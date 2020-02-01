import React from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import windowSize from 'react-window-size';
import { timeFormat } from "d3-time-format";
import { ChartCanvas, Chart } from "react-stockcharts";
import { LabelAnnotation, Annotate } from "react-stockcharts/lib/annotation";
import {
  BarSeries,
  CandlestickSeries,
  LineSeries,
  MACDSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
  CrossHairCursor,
  EdgeIndicator,
  CurrentCoordinate,
  MouseCoordinateX,
  MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {
  OHLCTooltip,
  MACDTooltip,
  MovingAverageTooltip,
} from "react-stockcharts/lib/tooltip";
import { sma, macd } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PatternsDisplayer from './PatternsDisplayer';

const annotationProps = {
      fontFamily: "Glyphicons Halflings",
      fontSize: 10,
      fill: "rgba(0,46,120,0.7)",
      opacity: 0.8,
      text: "▲",
      y: ({ yScale }) => yScale.range()[0] + 20,
      onClick: () => {},
      tooltip: d => timeFormat("%B")(d.date),
      // onMouseOver: console.log.bind(console),
    };

const macdCalculator = macd()
.options({
  fast: 12,
  slow: 26,
  signal: 9,
})
.merge((d, c) => {d.macd = c;})
.accessor(d => d.macd);

const sma10 = sma()
  .id(0)
  .stroke('rgba(100,0,10,0.5)')
  .options({ windowSize: 10 })
  .merge((d, c) => { d.sma10 = c; })
  .accessor(d => d.sma10);

const sma20 = sma()
  .id(0)
  .stroke('rgba(200,0,10,0.5)')
  .options({ windowSize: 20 })
  .merge((d, c) => { d.sma20 = c; })
  .accessor(d => d.sma20);

const sma50 = sma()
  .id(2)
  .stroke('orange')
  .options({ windowSize: 50 })
  .merge((d, c) => { d.sma50 = c; })
  .accessor(d => d.sma50);

const sma200 = sma()
  .id(2)
  .stroke('rgba(20,20,190,0.5)')
  .options({ windowSize: 200 })
  .merge((d, c) => { d.sma200 = c; })
  .accessor(d => d.sma200);

const smaVolume50 = sma()
  .id(3)
  .options({ windowSize: 50, sourcePath: "volume" })
  .merge((d, c) => { d.smaVolume50 = c; })
  .accessor(d => d.smaVolume50);

const macdAppearance = {
  width: 7,
  stroke: {
    macd: 'rgba(170,0,0,0.5)',
    signal: 'rgba(1,70,32,0.5)',
  },
  fill: {
    divergence: "#00468b"
  },
};

const candlesAppearance = {
  fill: function fill(d) {
    return d.close > d.open ? "rgba(0,166,81,0.7)" : "rgba(204,36,36,0.5)";
  },
  widthRatio: 0.8,
};

class ChartBig extends React.Component {
  render() {
    const { shift = 0, numSticksToDisplay = 120, data: initialData, width, ratio, height = 300, windowWidth, ticker, name, type } = this.props;
    const { copied } = this.state;

    if (!initialData) return null;
    if (!initialData.length) return null;
    if (initialData.length - 2 - shift < 0) return null;
    const patterns = initialData[initialData.length - 1 - shift].patterns || initialData[initialData.length - 2 - shift].patterns;
    const maxWindowSize = 9999;
    const dataToCalculate = initialData.slice(-maxWindowSize);
    const calculatedData = macdCalculator(smaVolume50(sma200(sma50(sma20(sma10(dataToCalculate))))));
    const xScaleProvider = discontinuousTimeScaleProvider
      .inputDateAccessor(d => d.date);
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(calculatedData);
    const start = xAccessor(last(data));
    const end = xAccessor(data[Math.max(0, data.length - numSticksToDisplay)]);
    const xExtents = [start - shift, end - shift];
    const gridHeight = height;
    const gridWidth = width;
    const showGrid = true;
    const yGrid = showGrid ? { innerTickSize: -1 * gridWidth, tickStrokeDasharray: 'ShortDot' } : {};
    const xGrid = showGrid ? { innerTickSize: -1 * gridHeight, tickStrokeDasharray: 'ShortDot' } : {};
    let ticks = 5;
    if (windowWidth < 720) {
      ticks = 2;
    }
    const btnClass = copied ? 'react-components-show-url btn btn-sm btn-danger disabled font-10' : 'react-components-show-url btn btn-sm btn-warning font-10';
    const btnText = copied ? 'Copied' : 'Copy Img';

    return (
      <div className='row no-gutters chart-chart bg-lightgray-ultra-5 margin-bottom-10 react-components-show-button'>
        <CopyToClipboard text={`https://i.earningsfly.com/${ticker}_daily.png`}
          onCopy={() => this.setState({ copied: true })}
        >
          <button className={btnClass} value={btnText}>{btnText}</button>
        </CopyToClipboard>
        <ChartCanvas height={height * 1.2}
          seriesName={`${ticker} - ${name} ${type} chart`}
          ratio={ratio}
          width={width}
          clip={false}
          panEvent
          zoomEvent={false}
          // onLoadMore={this.props.onLoadMoreData}
          padding={5}
          margin={{ left: 5, right: windowWidth > 720 ? 50 : 35, top: 10, bottom: 40 }}
          type={'hybrid'}
          data={data}
          xScale={xScale}
          xAccessor={xAccessor}
          displayXAccessor={displayXAccessor}
          xExtents={xExtents}
        >
          <Chart id={1}
            height={height * 0.8}
            yExtents={[d => [d.high, d.low], sma10.accessor(), sma20.accessor(), sma50.accessor(), sma200.accessor()]}
            origin={(w, h) => [0, 0]}
            padding={{ top: 10, bottom: 20 }}
          >
            <XAxis tickStroke={'#bbbbbb'} axisAt='bottom' orient='bottom' ticks={ticks} {...xGrid} />
            <YAxis tickStroke={'#bbbbbb'} axisAt='right' orient='right' ticks={5} {...yGrid} />
            <MouseCoordinateY
              at='right'
              orient='right'
              displayFormat={format(".1f")}
            />
            <CandlestickSeries {...candlesAppearance} />
            <LineSeries yAccessor={sma10.accessor()} stroke={sma10.stroke()} />
            <LineSeries yAccessor={sma20.accessor()} stroke={sma20.stroke()} />
            <LineSeries yAccessor={sma50.accessor()} stroke={sma50.stroke()} />
            <LineSeries yAccessor={sma200.accessor()} stroke={sma200.stroke()} />

            <OHLCTooltip origin={[0, 0]} />
            <MovingAverageTooltip
              options={[
                {
                  yAccessor: sma10.accessor(),
                  type: "SMA",
                  stroke: sma10.stroke(),
                  windowSize: sma10.options().windowSize,
                },
                {
                  yAccessor: sma20.accessor(),
                  type: "SMA",
                  stroke: sma20.stroke(),
                  windowSize: sma20.options().windowSize,
                },
                {
                  yAccessor: sma50.accessor(),
                  type: "SMA",
                  stroke: sma50.stroke(),
                  windowSize: sma50.options().windowSize,
                },
                {
                  yAccessor: sma200.accessor(),
                  type: "SMA",
                  stroke: sma200.stroke(),
                  windowSize: sma200.options().windowSize,
                },
              ]}
            />
            <Annotate
              with={LabelAnnotation}
              when={d => d.patterns}
              usingProps={annotationProps}
            />
          </Chart>
          <Chart id={2}
            yExtents={[d => d.volume, smaVolume50.accessor()]}
            height={height * 0.2}
            origin={(w, h) => [0, h * (0.58)]}
          >
            <MouseCoordinateY
              at='left'
              orient='left'
              displayFormat={format(".4s")}
            />

            <BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "rgba(0,166,81,0.3)" : "rgba(204,36,36,0.3)"} />
            <CurrentCoordinate yAccessor={smaVolume50.accessor()} fill={smaVolume50.stroke()} />
            <CurrentCoordinate yAccessor={d => d.volume} fill='#9B0A47' />
            <EdgeIndicator itemType='last' orient='right' edgeAt='right'
              yAccessor={d => d.volume} displayFormat={format(".4s")} fill={'black'}
            />
          </Chart>
          <Chart id={3}
            yExtents={macdCalculator.accessor()}
            height={height * 0.2}
            origin={(w, h) => [0, h * (0.87)]}
          >
            <YAxis tickStroke={'#cccccc'} axisAt='right' orient='right' ticks={5} {...yGrid} />
            <MouseCoordinateX
              at='bottom'
              orient='bottom'
              displayFormat={timeFormat('%Y-%m-%d')}
            />
            <MouseCoordinateY
              at='right'
              orient='right'
              displayFormat={format('.2f')}
            />

            <MACDSeries yAccessor={d => d.macd}
              {...macdAppearance}
            />
            <MACDTooltip
              origin={[0, 0]}
              yAccessor={d => d.macd}
              options={macdCalculator.options()}
              appearance={macdAppearance}
            />
          </Chart>
          <CrossHairCursor />
        </ChartCanvas>
        <PatternsDisplayer patterns={patterns} />
      </div>
    );
  }
}

ChartBig.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['svg', 'hybrid']).isRequired,
};

ChartBig.defaultProps = {
  type: "svg",
};

// eslint-disable-next-line
ChartBig = fitWidth(ChartBig);

export default windowSize(ChartBig);
