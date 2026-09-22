// Waveform generation utilities for Calorimetry charts

/**
 * Convert time range string to minutes
 */
export function timeRangeToMinutes(range: string): number {
  const map: Record<string, number> = {
    '30 min': 30,
    '1 h': 60,
    '2 h': 120,
    '3 h': 180,
    '6 h': 360,
  };
  return map[range] || 60;
}

/**
 * Generate smooth random waveform data using random walk with smoothing
 * @param baseline - center value of the waveform
 * @param amplitude - maximum deviation from baseline
 * @param points - number of data points to generate
 * @returns Array of data points
 */
export function generateWaveData(
  baseline: number,
  amplitude: number,
  points: number
): number[] {
  const data: number[] = [];
  let current = baseline;
  const minVal = baseline - amplitude;
  const maxVal = baseline + amplitude;

  for (let i = 0; i < points; i++) {
    // Random walk with small steps
    const change = (Math.random() - 0.5) * amplitude * 0.15;
    current += change;
    // Clamp to valid range
    current = Math.max(minVal, Math.min(maxVal, current));
    data.push(current);
  }

  // Apply smoothing (moving average)
  const smoothed: number[] = [];
  const windowSize = 3;
  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    let count = 0;
    for (let j = Math.max(0, i - windowSize); j <= Math.min(data.length - 1, i + windowSize); j++) {
      sum += data[j];
      count++;
    }
    smoothed.push(sum / count);
  }

  return smoothed;
}

/**
 * Convert data points to SVG path string
 * @param data - array of data values
 * @param minValue - minimum value for Y-axis scaling
 * @param maxValue - maximum value for Y-axis scaling
 * @param viewBoxWidth - SVG viewBox width
 * @param viewBoxHeight - SVG viewBox height
 * @returns SVG path string
 */
export function dataToSvgPath(
  data: number[],
  minValue: number,
  maxValue: number,
  viewBoxWidth: number,
  viewBoxHeight: number
): string {
  const range = maxValue - minValue;
  if (data.length === 0) return '';

  // Map data value to Y coordinate (invert because SVG Y grows downward)
  const mapY = (value: number) => {
    return ((maxValue - value) / range) * viewBoxHeight;
  };

  const stepX = viewBoxWidth / (data.length - 1);
  let path = `M0 ${mapY(data[0]).toFixed(2)}`;

  for (let i = 1; i < data.length; i++) {
    const x = (i * stepX).toFixed(2);
    const y = mapY(data[i]).toFixed(2);
    path += ` L${x} ${y}`;
  }

  return path;
}

/**
 * Generate MVexp waveform data based on time range
 * Normal range: 2.2 - 3.8 L/min, baseline ~3.0
 */
export function generateMVexpWave(range: string): string {
  const minutes = timeRangeToMinutes(range);
  // More points for longer time ranges
  const points = Math.max(50, minutes);
  const data = generateWaveData(3.0, 1.5, points);
  return dataToSvgPath(data, 0, 6, 100, 44.523);
}

/**
 * Generate sub-chart waveform data
 */
export function generateSubChartWave(
  title: string,
  range: string
): string {
  const minutes = timeRangeToMinutes(range);
  const points = Math.max(50, minutes);

  let baseline: number;
  let amplitude: number;
  let minVal: number;
  let maxVal: number;

  switch (title) {
    case 'VCO2':
      baseline = 150;
      amplitude = 60;
      minVal = 0;
      maxVal = 200;
      break;
    case 'VO2':
      baseline = 180;
      amplitude = 50;
      minVal = 0;
      maxVal = 200;
      break;
    case 'RQ':
      baseline = 1.0;
      amplitude = 0.25;
      minVal = 0.5;
      maxVal = 1.5;
      break;
    case 'EE':
      baseline = 1200;
      amplitude = 300;
      minVal = 0;
      maxVal = 1500;
      break;
    default:
      baseline = 50;
      amplitude = 10;
      minVal = 0;
      maxVal = 100;
  }

  const data = generateWaveData(baseline, amplitude, points);
  return dataToSvgPath(data, minVal, maxVal, 100, 34);
}
