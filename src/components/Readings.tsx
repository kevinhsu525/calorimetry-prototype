import React, { useState, useEffect } from 'react';
import Divider from './Divider';

interface ReadingsProps {
  spinboxValue: number;
}

interface ReadingItem {
  label: string;
  baseValue: number;
  unit: string;
  prefix?: string;
  decimals: number;
}

const baseReadings: ReadingItem[] = [
  { label: 'Avg. VCO2', baseValue: 152, unit: 'ml/min', decimals: 0 },
  { label: 'VCO2 CV', baseValue: 1.5, unit: '%', decimals: 1 },
  { label: 'Avg. VO2', baseValue: 115, unit: 'ml/min', decimals: 0 },
  { label: 'VO2 CV', baseValue: 1.4, unit: '%', decimals: 1 },
  { label: 'Avg. RQ', baseValue: 1.3, unit: ' ', prefix: '> ', decimals: 1 },
  { label: 'Avg. EE', baseValue: 873, unit: 'kcal/day', decimals: 0 },
  { label: 'Avg. EE/m2', baseValue: 482, unit: 'kcal/day/m', decimals: 0 },
  { label: 'Avg. EE/kg', baseValue: 12, unit: 'kcal/day/kg', decimals: 0 },
];

interface ValuePairProps {
  label: string;
  value: string;
  unit: string;
}

const ValuePair: React.FC<ValuePairProps> = ({ label, value, unit }) => (
  <div className="flex flex-col gap-1 items-center text-center w-[86px]">
    <span className="text-[#babdc0] text-lg leading-6">{label}</span>
    <span className="text-[#f9f9fa] text-[30px] leading-9">{value}</span>
    <span className="text-[#babdc0] text-lg leading-6">{unit}</span>
  </div>
);

const Readings: React.FC<ReadingsProps> = ({ spinboxValue }) => {
  const [displayValues, setDisplayValues] = useState<string[]>(
    baseReadings.map((item) => {
      const prefix = item.prefix || '';
      return prefix + item.baseValue.toFixed(item.decimals);
    })
  );

  useEffect(() => {
    const newValues = baseReadings.map((item) => {
      // Apply ±5 random fluctuation
      const fluctuation = (Math.random() - 0.5) * 10;
      const newValue = Math.max(0, item.baseValue + fluctuation);
      const prefix = item.prefix || '';
      return prefix + newValue.toFixed(item.decimals);
    });
    setDisplayValues(newValues);
  }, [spinboxValue]);

  return (
    <div className="flex flex-col gap-[60px] w-full">
      {/* Avg. VCO2 / VCO2 CV */}
      <div className="flex gap-2 items-center justify-center px-4 w-full">
        <ValuePair label={baseReadings[0].label} value={displayValues[0]} unit={baseReadings[0].unit} />
        <Divider vertical />
        <ValuePair label={baseReadings[1].label} value={displayValues[1]} unit={baseReadings[1].unit} />
      </div>

      {/* Avg. VO2 / VO2 CV */}
      <div className="flex gap-2 items-center justify-center px-4 w-full">
        <ValuePair label={baseReadings[2].label} value={displayValues[2]} unit={baseReadings[2].unit} />
        <Divider vertical />
        <ValuePair label={baseReadings[3].label} value={displayValues[3]} unit={baseReadings[3].unit} />
      </div>

      {/* Avg. RQ / Avg. EE */}
      <div className="flex gap-2 items-center justify-center px-4 w-full">
        <ValuePair label={baseReadings[4].label} value={displayValues[4]} unit={baseReadings[4].unit} />
        <Divider vertical />
        <ValuePair label={baseReadings[5].label} value={displayValues[5]} unit={baseReadings[5].unit} />
      </div>

      {/* Avg. EE/m2 / Avg. EE/kg */}
      <div className="flex gap-2 items-center justify-center px-4 w-full">
        <ValuePair label={baseReadings[6].label} value={displayValues[6]} unit={baseReadings[6].unit} />
        <Divider vertical />
        <ValuePair label={baseReadings[7].label} value={displayValues[7]} unit={baseReadings[7].unit} />
      </div>

      <Divider />

      {/* BSA / Weight */}
      <div className="flex gap-2 items-center justify-center px-4 w-full">
        <ValuePair label="BSA" value="1.81" unit="m2" />
        <Divider vertical />
        <ValuePair label="Weight" value="70" unit="Kg" />
      </div>
    </div>
  );
};

export default Readings;
