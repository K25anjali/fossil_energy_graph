import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  ResponsiveContainer,
  ReferenceLine,
  Label,
  Line
} from 'recharts';
import { gasData, coalData, oilData } from './data';

const App = () => {
  const [isTooltipActive, setIsTooltipActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640); // Tailwind "sm"
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOutsideClick = (event) => {
    if (chartRef.current && !chartRef.current.contains(event.target)) {
      setIsTooltipActive(false);
    }
  };

  const handleChartInteraction = () => {
    setIsTooltipActive(true);
  };

  const colors = {
    coalElectricity: "#154a45",
    coalOther: "#457473",
    gasElectricity: "#17159e",
    gasOther: "#1717fc",
    oilElectricity: "#941819",
    oilOther: "#ac3d3e",
  };

  const CustomLegend = () => {
    const legendData = [
      { name: "Coal|Electricity", color: "#154a45" },
      { name: "Coal|Other", color: "#457473" },
      { name: "Gas|Electricity", color: "#17159e" },
      { name: "Gas|Other", color: "#1717fc" },
      { name: "Oil|Electricity", color: "#941819" },
      { name: "Oil|Other", color: "#ac3d3e" },
    ];

    return (
      <div className="flex flex-col lg:flex-col md:flex-row justify-center gap-8 max-lg:mb-10">
        {/* Fossil Use Section */}
        <div className="flex flex-col">
          <h1 className="font-semibold mb-2">Fossil use</h1>
          <ul className="flex lg:flex-col flex-row max-lg:flex-wrap gap-2">
            {legendData.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <span
                  className="md:h-5 md:w-5 w-3 h-3"
                  style={{ backgroundColor: item.color }}
                ></span>
                {item.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Domestic Supply Section */}
        <div className="flex flex-col mt-4 lg:mt-2">
          <h1 className="font-semibold mb-2">Domestic Supply</h1>
          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-2">
              <span className="text-black font-bold text-lg">--</span>
              Production
            </li>
          </ul>
        </div>
      </div>
    );
  };


  // Keys for stacked areas/bars
  const historicalKeys = ["production", "electricity", "other"];
  const futureKeys = ["production", "electricity", "other"];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded shadow text-sm md:text-base">
          <p className="font-bold">{`Year: ${label}`}</p>
          {historicalKeys.map((key) =>
            data[key] ? (
              <p key={key} style={{ color: colors[`${data.source}${key[0].toUpperCase() + key.slice(1)}`] }}>
                {`${key}: ${data[key].toFixed(2)}`}
              </p>
            ) : null
          )}
        </div>
      );
    }
    return null;
  };

  const renderChart = (data, source, showAxis = false) => (
    <div className="min-w-[350px] w-full h-84 md:h-[450px] relative">
      <ResponsiveContainer width="100%" height="100%">

        <ComposedChart data={data.map(d => ({ ...d, isFuture: d.year >= 2030, source }))}>
          {/* Heading overlay */}
          <div className="w-full text-center font-bold z-10">
            {source.toUpperCase()}
          </div>
          <CartesianGrid />

          <XAxis
            dataKey="year"
            domain={[2000, 2035]}
            ticks={[2000, 2005, 2010, 2015, 2020, 2030, 2035]}
            tickFormatter={(tick) => [2005, 2015, 2025].includes(tick) ? '' : tick}
            type="number"
            interval={0}
            padding={{ left: 20, right: 20 }}
          />

          {/* Show Y-axis only if showAxis is true */}
          {showAxis && (
            <YAxis
              label={{
                value: 'Fossil Energy Production and use (EJ/Yr)',
                angle: -90,
                position: 'center',
                offset: 50,
                dx: -20,
                fontSize: 18,
                color: 'black',
              }}
              ticks={[0, 5, 10]}
              padding={{ top: 20, bottom: 20 }}
            />
          )}

          <Tooltip content={<CustomTooltip />} isAnimationActive={isTooltipActive} />

          {/* Historical Lines / Areas only */}
          {historicalKeys.map((key) =>
            key === "production" ? (
              <Line
                key={key}
                type="natural"
                dataKey={(d) => (!d.isFuture ? d[key] : null)}
                stroke="#000"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            ) : (
              <Area
                key={key}
                type="monotone"
                dataKey={(d) => (!d.isFuture ? d[key] : null)}
                stroke="transparent"
                fill={colors[`${source}${key[0].toUpperCase() + key.slice(1)}`]}
                fillOpacity={0.8}
              />
            )
          )}

          {/* Future Bars only */}
          {futureKeys
            .filter((key) => key !== "production")
            .map((key) => (
              <Bar
                key={key}
                dataKey={(d) => (!d.isFuture ? 0 : d[key])}
                fill={colors[`${source}${key[0].toUpperCase() + key.slice(1)}`]}
                fillOpacity={0.8}
                barSize={24}
                stackId={1}
              />
            ))}

          {/* ReferenceLine only if showAxis is true */}
          {showAxis && (
            <ReferenceLine x={2030} stroke="none">
              <Label
                value="High Ambition"
                position="bottom"
                fontSize={isMobile ? 10 : 12}
                fill="black"
                dy={isMobile ? 110 : -90}
                dx={isMobile ? 2 : -5}
                angle={-90}
                textAnchor="middle"
                fontWeight="bold"
                style={{ letterSpacing: "1px" }}
              />
            </ReferenceLine>
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );


  return (
    <div
      className="flex flex-col lg:flex-row justify-center items-center min-h-screen bg-gray-100 px-10 space-y-10 md:space-x-10"
      onClick={handleOutsideClick}
      onTouchStart={handleOutsideClick}
    >
      <div className="p-2 w-full max-w-6xl focus:outline-none" ref={chartRef}>
        <h2 className="text-lg md:text-xl font-bold mb-4 text-center">
          Electricity Generation in Australia
        </h2>

        {/* 3 Graphs horizontal scroll */}
        <div
          className="flex gap-2 md:gap-6 overflow-x-auto pb-4"
          onMouseMove={handleChartInteraction}
          onTouchStart={handleChartInteraction}
        >
          {renderChart(coalData, "coal", true)}
          {renderChart(gasData, "gas")}
          {renderChart(oilData, "oil")}
        </div>
      </div>

      {/* custom legend  */}
      <CustomLegend />
    </div>

  );
};

export default App;
