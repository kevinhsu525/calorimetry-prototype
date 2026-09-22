import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import TimeRangeButtons from './components/TimeRangeButtons';
import Chart from './components/Chart';
import Readings from './components/Readings';
import Spinbox from './components/Spinbox';
import { timeRangeToMinutes, generateMVexpWave, generateSubChartWave } from './utils/waveform';

const chartTitles = ['VCO2', 'VO2', 'RQ', 'EE'] as const;

const chartMeta: Record<string, { unit: string; maxValue: string; midValue: string; minValue: string; viewBoxHeight: number }> = {
  VCO2: { unit: 'ml/min', maxValue: '200', midValue: '100', minValue: '0', viewBoxHeight: 34 },
  VO2: { unit: 'ml/min', maxValue: '200', midValue: '100', minValue: '0', viewBoxHeight: 48 },
  RQ: { unit: '', maxValue: '1.5', midValue: '1.0', minValue: '0.5', viewBoxHeight: 48 },
  EE: { unit: 'kcal/day', maxValue: '1500', midValue: '750', minValue: '0', viewBoxHeight: 33 },
};

const App: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('1 h');
  const [spinboxValue, setSpinboxValue] = useState<number>(60);

  const maxMinutes = timeRangeToMinutes(selectedTimeRange);

  // Generate waveforms based on selected time range
  const mvexpPath = useMemo(() => generateMVexpWave(selectedTimeRange), [selectedTimeRange]);

  const subChartPaths = useMemo(() => {
    const paths: Record<string, string> = {};
    chartTitles.forEach((title) => {
      paths[title] = generateSubChartWave(title, selectedTimeRange);
    });
    return paths;
  }, [selectedTimeRange]);

  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value);
    // Set spinbox to the new max value
    const newMax = timeRangeToMinutes(value);
    setSpinboxValue(newMax);
  };

  return (
    <div 
      className="bg-[#202324] border border-[#373b3d] flex flex-col"
      style={{ width: '909px', height: '975px' }}
    >
      {/* Header - 68px */}
      <Header />

      {/* Main Content - 907px remaining */}
      <div className="flex flex-1 gap-4 p-6 overflow-hidden" style={{ height: '907px' }}>
        {/* Left Panel - Charts */}
        <div className="flex flex-col gap-3 w-[571px] shrink-0" style={{ height: '859px' }}>
          {/* Primary Time Range + MVexp Chart Container */}
          <div className="bg-[#141415] rounded p-3 flex flex-col gap-2 shrink-0">
            <TimeRangeButtons value={selectedTimeRange} onChange={handleTimeRangeChange} />

            <Chart
              title="MVexp"
              unit="l/min"
              maxValue="6"
              midValue="3"
              minValue="0"
              pathData={mvexpPath}
              viewBoxHeight={44.523}
            />
          </div>

          {/* Disclosure Area */}
          <div className="bg-[#141415] border-2 border-[#b39cf1] rounded p-3 flex flex-col gap-2 flex-1 min-h-0 overflow-hidden">
              {chartTitles.map((title) => {
                const meta = chartMeta[title];
                return (
                  <Chart
                    key={title}
                    compact
                    title={title}
                    unit={meta.unit}
                    maxValue={meta.maxValue}
                    midValue={meta.midValue}
                    minValue={meta.minValue}
                    pathData={subChartPaths[title]}
                    viewBoxHeight={meta.viewBoxHeight}
                  />
                );
              })}

              {/* Time Range Picker Area */}
              <div className="flex flex-col gap-2 pl-[104px] shrink-0">
                <div className="flex justify-between text-[#babdc0] text-sm">
                  <span>15:30</span>
                  <span>21:30</span>
                  <span>03 Mar</span>
                  <span>09:30</span>
                  <span>15:30</span>
                </div>

                <div className="relative h-[20px] flex items-center">
                  <div className="absolute left-[20%] right-[30%] h-full bg-[rgba(190,119,243,0.2)] border-x-2 border-[#b39cf1] rounded-sm" />
                  <div className="absolute left-[20%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-5 bg-[#b39cf1] rounded-full" />
                  <div className="absolute right-[30%] top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-5 bg-[#b39cf1] rounded-sm" />
                </div>
              </div>

              {/* Flex spacer to push Spinbox to bottom */}
              <div className="flex-1 min-h-0" />

              {/* Spinbox */}
              <Spinbox value={spinboxValue} maxValue={maxMinutes} onChange={setSpinboxValue} />
          </div>
        </div>

        {/* Right Panel - Readings */}
        <div className="w-[274px] bg-[#141415] rounded p-4 shrink-0 overflow-hidden" style={{ height: '859px' }}>
          <Readings />
        </div>
      </div>
    </div>
  );
};

export default App;
