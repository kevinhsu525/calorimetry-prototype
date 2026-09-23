import React, { useState, useMemo, useRef, useEffect } from 'react';
import Header from './components/Header';
import TimeRangeButtons from './components/TimeRangeButtons';
import Chart from './components/Chart';
import Readings from './components/Readings';
import Spinbox from './components/Spinbox';
import TimeWindowSelector from './components/TimeWindowSelector';
import DynamicTimeAxis from './components/DynamicTimeAxis';
import DisclosureSelector from './components/DisclosureSelector';
import {
  timeRangeToMinutes,
  calculateSelectorWidth,
  generateMVexpWave,
  generateSubChartWindow,
  clearWaveformCache,
} from './utils/waveform';

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
  const [windowStart, setWindowStart] = useState<number>(0);
  const [windowEnd, setWindowEnd] = useState<number>(100);
  const [disclosureStart, setDisclosureStart] = useState<number>(100 - (60 / (24 * 60)) * 100);
  const [disclosureEnd, setDisclosureEnd] = useState<number>(100);
  const disclosureEndRef = useRef(100);

  const maxMinutes = timeRangeToMinutes(selectedTimeRange);
  const selectorWidthPercent = calculateSelectorWidth(selectedTimeRange);

  // Disclosure selector width based on spinbox value (minutes / 24h)
  const disclosureWidthPercent = (spinboxValue / (24 * 60)) * 100;

  // When spinbox value changes, update disclosure selector position
  useEffect(() => {
    const width = (spinboxValue / (24 * 60)) * 100;
    const end = disclosureEndRef.current;
    const newStart = end - width;
    if (newStart < 0) {
      setDisclosureStart(0);
      setDisclosureEnd(width);
      disclosureEndRef.current = width;
    } else {
      setDisclosureStart(newStart);
    }
  }, [spinboxValue]);

  // Generate 24h MVexp wave
  const mvexpPath = useMemo(() => generateMVexpWave(selectedTimeRange), [selectedTimeRange]);

  // Generate sub-chart waves based on time window
  const subChartPaths = useMemo(() => {
    const paths: Record<string, string> = {};
    const widthPercent = windowEnd - windowStart;
    chartTitles.forEach((title) => {
      paths[title] = generateSubChartWindow(title, windowStart, widthPercent);
    });
    return paths;
  }, [windowStart, windowEnd, selectedTimeRange]);

  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value);
    // Set spinbox to the new max value
    const newMax = timeRangeToMinutes(value);
    setSpinboxValue(newMax);
    // Reset window to show latest data
    const width = calculateSelectorWidth(value);
    setWindowStart(100 - width);
    setWindowEnd(100);
    // Clear cache to regenerate waveforms
    clearWaveformCache();
  };

  const handleWindowChange = (start: number, end: number) => {
    setWindowStart(start);
    setWindowEnd(end);
  };

  const handleDisclosureWindowChange = (start: number, end: number) => {
    setDisclosureStart(start);
    setDisclosureEnd(end);
    disclosureEndRef.current = end;
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
              overlay={
                <TimeWindowSelector
                  selectorWidthPercent={selectorWidthPercent}
                  onWindowChange={handleWindowChange}
                />
              }
            />
          </div>

          {/* Disclosure Area */}
          <div className="bg-[#141415] border-2 border-[#b39cf1] rounded p-3 flex flex-col gap-2 flex-1 min-h-0 overflow-hidden relative">
              {/* Charts with Disclosure Selector */}
              <div className="relative flex-1">
                <DisclosureSelector
                  startPercent={disclosureStart}
                  selectorWidthPercent={disclosureWidthPercent}
                  onWindowChange={handleDisclosureWindowChange}
                />
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
              </div>

              {/* Time Range Picker Area - Dynamic Time Axis */}
              <div className="flex flex-col gap-2 pl-[104px] shrink-0">
                <DynamicTimeAxis windowStart={windowStart} windowEnd={windowEnd} />
              </div>

              {/* Flex spacer to push Spinbox to bottom */}
              <div className="flex-1 min-h-0" />

              {/* Spinbox */}
              <Spinbox value={spinboxValue} maxValue={maxMinutes} onChange={setSpinboxValue} />
          </div>
        </div>

        {/* Right Panel - Readings */}
        <div className="w-[274px] bg-[#141415] rounded p-4 shrink-0 overflow-hidden" style={{ height: '859px' }}>
          <Readings spinboxValue={spinboxValue} disclosureStart={disclosureStart} disclosureEnd={disclosureEnd} />
        </div>
      </div>
    </div>
  );
};

export default App;
