# Charting lib

Displaying customizable timeflow charts.

#### Chart types:
* line 

![Alt text](examples/line_chart.png "Line chart with preview")
* point

![Alt text](examples/point_chart_multiple.png "Multiple point chart with preview")
* curve

![Alt text](examples/curve_chart.png "Multiple curve chart with preview")
* candle (vertical bar)

![Alt text](examples/bar_chart_multiple.png "Multiple bar chart with preview")

#### Allows numeric and no-data values

* Point modal showing numeric data point

![Alt text](examples/point_modal.png "Numeric data point info")

* Point modal showing no-data message

![Alt text](examples/no_data_message.png "No-data info")

## Getting Started

```
let chart = new ChartContainer('.my-selector', config); 
```

## Known issues

* (area charts (line, curve) only) fill colors blinking
* (area charts only) vertical lines bordering areas when fill color used
* preview box not available for high-speed scrolling


### License

MIT License - see the [LICENSE.md](LICENSE.md) file for details

### Acknowledgments

* Thanks to @nikitavbv for code review

Initially built for Telegram Charts Contest for developers.
