import React from 'react';
import Header from './components/Header';
import TimeRangeButtons from './components/TimeRangeButtons';
import Chart from './components/Chart';
import Readings from './components/Readings';
import Spinbox from './components/Spinbox';

const chartConfigs = [
  {
    title: 'VCO2',
    unit: 'ml/min',
    maxValue: '200',
    midValue: '100',
    minValue: '0',
    pathData: 'M0 17C20 10 40 24 60 10C80 0 100 17 100 17',
    viewBoxHeight: 34,
  },
  {
    title: 'VO2',
    unit: 'ml/min',
    maxValue: '200',
    midValue: '100',
    minValue: '0',
    pathData: 'M0 24C20 17 40 31 60 17C80 7 100 24 100 24',
    viewBoxHeight: 48,
  },
  {
    title: 'RQ',
    unit: '',
    maxValue: '1.5',
    midValue: '1.0',
    minValue: '0.5',
    pathData: 'M0 24C20 17 40 31 60 17C80 7 100 24 100 24',
    viewBoxHeight: 48,
  },
  {
    title: 'EE',
    unit: 'kcal/day',
    maxValue: '1500',
    midValue: '750',
    minValue: '0',
    pathData: 'M0 16.5C20 9.5 40 23.5 60 9.5C80 0 100 16.5 100 16.5',
    viewBoxHeight: 33,
  },
];

const App: React.FC = () => {
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
          {/* Time Range Buttons */}
          <TimeRangeButtons />

          {/* MVexp Chart (Primary) */}
          <div className="bg-[#141415] rounded p-3 flex flex-col gap-2 shrink-0">
            <Chart
              title="MVexp"
              unit="l/min"
              maxValue="6"
              midValue="3"
              minValue="0"
              pathData="M0 22.262C20 15.087 40 29.437 60 15.087C80 0.737 100 22.262 100 22.262"
              viewBoxHeight={44.523}
            />
          </div>

          {/* Disclosure Area */}
          <div className="border-2 border-[#b39cf1] rounded p-3 flex flex-col gap-2 flex-1 min-h-0 overflow-hidden">
              {chartConfigs.map((config) => (
                <Chart
                  key={config.title}
                  compact
                  title={config.title}
                  unit={config.unit}
                  maxValue={config.maxValue}
                  midValue={config.midValue}
                  minValue={config.minValue}
                  pathData={config.pathData}
                  viewBoxHeight={config.viewBoxHeight}
                />
              ))}

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
              <Spinbox />
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
