import React from 'react';
import Divider from './Divider';

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

const Readings: React.FC = () => {
  return (
    <div className="flex flex-col gap-[60px] w-full">
      {/* Avg. VCO2 / VCO2 CV */}
      <div className="flex gap-2 items-center justify-center px-4 w-full">
        <ValuePair label="Avg. VCO2" value="152" unit="ml/min" />
        <Divider vertical />
        <ValuePair label="VCO2 CV" value="1.5" unit="%" />
      </div>

      {/* Avg. VO2 / VO2 CV */}
      <div className="flex gap-2 items-center justify-center px-4 w-full">
        <ValuePair label="Avg. VO2" value="115" unit="ml/min" />
        <Divider vertical />
        <ValuePair label="VO2 CV" value="1.4" unit="%" />
      </div>

      {/* Avg. RQ / Avg. EE */}
      <div className="flex gap-2 items-center justify-center px-4 w-full">
        <ValuePair label="Avg. RQ" value="> 1.3" unit=" " />
        <Divider vertical />
        <ValuePair label="Avg. EE" value="873" unit="kcal/day" />
      </div>

      {/* Avg. EE/m2 / Avg. EE/kg */}
      <div className="flex gap-2 items-center justify-center px-4 w-full">
        <ValuePair label="Avg. EE/m2" value="482" unit="kcal/day/m" />
        <Divider vertical />
        <ValuePair label="Avg. EE/kg" value="12" unit="kcal/day/kg" />
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
