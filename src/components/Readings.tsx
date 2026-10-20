import React, { useState, useEffect } from 'react';
import Divider from './Divider';
import { getWindowData } from '../utils/waveform';

interface ReadingsProps {
  spinboxValue: number;
  disclosureStart?: number;
  disclosureEnd?: number;
}

const ValuePair: React.FC<{ label: string; value: string; unit: string }> = ({ label, value, unit }) => (
  <div className="flex flex-col gap-1 items-center text-center">
    <span className="text-[#babdc0] text-lg leading-6">{label}</span>
    <span className="text-[#f9f9fa] text-[30px] leading-9">{value}</span>
    <span className="text-[#babdc0] text-lg leading-6">{unit}</span>
  </div>
);

const Readings: React.FC<ReadingsProps> = ({ spinboxValue, disclosureStart = 0, disclosureEnd = 100 }) => {
  const [displayValues, setDisplayValues] = useState<string[]>([]);

  useEffect(() => {
    if (disclosureEnd <= disclosureStart) {
      setDisplayValues([]);
      return;
    }

    // Get actual window data from waveforms
    const vco2Data = getWindowData('VCO2', disclosureStart, disclosureEnd);
    const vo2Data = getWindowData('VO2', disclosureStart, disclosureEnd);
    const rqData = getWindowData('RQ', disclosureStart, disclosureEnd);
    const eeData = getWindowData('EE', disclosureStart, disclosureEnd);

    if (vco2Data.length === 0 || vo2Data.length === 0) {
      setDisplayValues([]);
      return;
    }

    // Calculate averages
    const avgVCO2 = vco2Data.reduce((a, b) => a + b, 0) / vco2Data.length;
    const avgVO2 = vo2Data.reduce((a, b) => a + b, 0) / vo2Data.length;
    const avgRQ = rqData.reduce((a, b) => a + b, 0) / rqData.length;
    const avgEE = eeData.reduce((a, b) => a + b, 0) / eeData.length;

    // Calculate CV (coefficient of variation)
    const vco2Std = Math.sqrt(vco2Data.reduce((sum, val) => sum + Math.pow(val - avgVCO2, 2), 0) / vco2Data.length);
    const vco2CV = (vco2Std / avgVCO2) * 100;

    const vo2Std = Math.sqrt(vo2Data.reduce((sum, val) => sum + Math.pow(val - avgVO2, 2), 0) / vo2Data.length);
    const vo2CV = (vo2Std / avgVO2) * 100;

    // Update display values
    const newValues = [
      avgVCO2.toFixed(0),
      vco2CV.toFixed(1),
      avgVO2.toFixed(0),
      vo2CV.toFixed(1),
      avgRQ.toFixed(2),
      avgEE.toFixed(0),
      (avgEE / 1.81).toFixed(0), // EE/m2
      (avgEE / 70).toFixed(0),   // EE/kg
    ];

    setDisplayValues(newValues);
  }, [spinboxValue, disclosureStart, disclosureEnd]);

  const labels = [
    'Avg. VCO2',
    'VCO2 CV',
    'Avg. VO2',
    'VO2 CV',
    'Avg. RQ',
    'Avg. EE',
    'Avg. EE/m2',
    'Avg. EE/kg',
  ];

  const units = [
    'ml/min',
    '%',
    'ml/min',
    '%',
    ' ',
    'kcal/day',
    'kcal/day/m',
    'kcal/day/kg',
  ];

  const prefixes = [
    '',
    '',
    '',
    '',
    '> ',
    '',
    '',
    '',
  ];

  return (
    <div className="flex flex-col gap-[60px] w-full">
      {/* Avg. VCO2 / VCO2 CV */}
      <div className="grid grid-cols-[1fr_auto_1fr] w-full">
        <ValuePair label={labels[0]} value={prefixes[0] + displayValues[0]} unit={units[0]} />
        <div className="w-px bg-[#373b3d] self-stretch" />
        <ValuePair label={labels[1]} value={prefixes[1] + displayValues[1]} unit={units[1]} />
      </div>

      {/* Avg. VO2 / VO2 CV */}
      <div className="grid grid-cols-[1fr_auto_1fr] w-full">
        <ValuePair label={labels[2]} value={prefixes[2] + displayValues[2]} unit={units[2]} />
        <div className="w-px bg-[#373b3d] self-stretch" />
        <ValuePair label={labels[3]} value={prefixes[3] + displayValues[3]} unit={units[3]} />
      </div>

      {/* Avg. RQ / Avg. EE */}
      <div className="grid grid-cols-[1fr_auto_1fr] w-full">
        <ValuePair label={labels[4]} value={prefixes[4] + displayValues[4]} unit={units[4]} />
        <div className="w-px bg-[#373b3d] self-stretch" />
        <ValuePair label={labels[5]} value={prefixes[5] + displayValues[5]} unit={units[5]} />
      </div>

      {/* Avg. EE/m2 / Avg. EE/kg */}
      <div className="grid grid-cols-[1fr_auto_1fr] w-full">
        <ValuePair label={labels[6]} value={prefixes[6] + displayValues[6]} unit={units[6]} />
        <div className="w-px bg-[#373b3d] self-stretch" />
        <ValuePair label={labels[7]} value={prefixes[7] + displayValues[7]} unit={units[7]} />
      </div>

      <Divider />

      {/* BSA / Weight */}
      <div className="grid grid-cols-[1fr_auto_1fr] w-full">
        <ValuePair label="BSA" value="1.81" unit="m2" />
        <div className="w-px bg-[#373b3d] self-stretch" />
        <ValuePair label="Weight" value="70" unit="Kg" />
      </div>
    </div>
  );
};

export default Readings;
