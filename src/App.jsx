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
  Line,
  ReferenceArea
} from 'recharts';
import { gasData, coalData, oilData } from './data';
import CustomLegend from './CustomLegend';

const App = () => {
  const [isTooltipActive, setIsTooltipActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
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
      <h1 className="md:w-[294px] w-[282px] text-center max-md:text-sm font-bold z-10 absolute bg-gray-200 top-0 left-16 border">
        {source.toUpperCase()}
      </h1>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data.map(d => ({ ...d, isFuture: d.year >= 2030, source }))}>
          <CartesianGrid />

          <XAxis
            dataKey="year"
            domain={[2000, 2035]}
            ticks={[2000, 2005, 2010, 2015, 2020, 2030, 2035]}
            tickFormatter={(tick) => {
              if ([2005, 2015, 2025].includes(tick)) return '';
              if (tick === 2030) return "'30";
              if (tick === 2035) return "'35";
              return tick;
            }}
            type="number"
            interval={0}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis
            label={
              showAxis
                ? {
                  value: 'Fossil Energy Production and use (EJ/Yr)',
                  angle: -90,
                  position: 'center',
                  offset: 50,
                  dx: -20,
                  fontSize: 18,
                  color: 'black',
                }
                : null
            }
            ticks={[0, 5, 10]}
            tickFormatter={(value) => (showAxis ? value : '')}
            padding={{ top: 30, bottom: 20 }}
          />

          <Tooltip content={<CustomTooltip />} isAnimationActive={isTooltipActive} />

          {/* Historical Areas first to ensure Line is on top */}
          {historicalKeys
            .filter((key) => key !== "production") // Render areas first
            .map((key) => (
              <Area
                key={key}
                type="monotone"
                dataKey={(d) => (!d.isFuture ? d[key] : null)}
                stroke="transparent"
                fill={colors[`${source}${key[0].toUpperCase() + key.slice(1)}`]}
                fillOpacity={0.8}
                pointerEvents="none" // Prevent areas from capturing hover events
              />
            ))}

          {/* Historical Production Line last to ensure it's on top */}
          {historicalKeys
            .filter((key) => key === "production")
            .map((key) => (
              <Line
                key={key}
                type="natural"
                dataKey={(d) => (!d.isFuture ? d[key] : null)}
                stroke="#000000"
                fill='white'
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                isAnimationActive={false}
              />
            ))}

          {/* Future Bars */}
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
