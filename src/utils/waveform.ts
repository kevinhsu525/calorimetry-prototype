// Waveform generation utilities for Calorimetry charts

const TOTAL_HOURS = 24;
const POINTS_PER_HOUR = 60; // 1 point per minute
const TOTAL_POINTS = TOTAL_HOURS * POINTS_PER_HOUR; // 1440 points for 24h

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
    const change = (Math.random() - 0.5) * amplitude * 0.15;
    current += change;
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

// Store generated 24h data to keep it consistent
let cachedMVexpData: number[] | null = null;
let cachedSubChartData: Record<string, number[]> = {};

/**
 * Generate or retrieve cached 24h MVexp data
 */
function getMVexp24hData(): number[] {
  if (!cachedMVexpData) {
    cachedMVexpData = generateWaveData(3.0, 1.5, TOTAL_POINTS);
  }
  return cachedMVexpData;
}

/**
 * Generate or retrieve cached 24h sub-chart data
 */
function getSubChart24hData(title: string): number[] {
  if (!cachedSubChartData[title]) {
    let baseline: number;
    let amplitude: number;

    switch (title) {
      case 'VCO2':
        baseline = 150;
        amplitude = 60;
        break;
      case 'VO2':
        baseline = 180;
        amplitude = 50;
        break;
      case 'RQ':
        baseline = 1.0;
        amplitude = 0.25;
        break;
      case 'EE':
        baseline = 1200;
        amplitude = 300;
        break;
      default:
        baseline = 50;
        amplitude = 10;
    }

    cachedSubChartData[title] = generateWaveData(baseline, amplitude, TOTAL_POINTS);
  }
  return cachedSubChartData[title];
}

/**
 * Calculate selector width percentage based on selected time range
 * Width = selectedMinutes / 24h
 */
export function calculateSelectorWidth(selectedRange: string): number {
  const selectedMinutes = timeRangeToMinutes(selectedRange);
  return (selectedMinutes / (TOTAL_HOURS * 60)) * 100;
}

/**
 * Generate MVexp waveform for the full 24h view
 */
export function generateMVexpWave24h(): string {
  const data = getMVexp24hData();
  return dataToSvgPath(data, 0, 6, 100, 44.523);
}

/**
 * Generate sub-chart waveform from a specific time window
 * @param title - chart title
 * @param startPercent - start position (0-100)
 * @param widthPercent - window width as percentage of total
 */
export function generateSubChartWindow(
  title: string,
  startPercent: number,
  widthPercent: number
): string {
  const data24h = getSubChart24hData(title);
  
  const startIndex = Math.floor((startPercent / 100) * TOTAL_POINTS);
  const windowPoints = Math.floor((widthPercent / 100) * TOTAL_POINTS);
  const endIndex = Math.min(startIndex + windowPoints, TOTAL_POINTS);
  
  const windowData = data24h.slice(startIndex, endIndex);
  
  if (windowData.length < 2) {
    // Fallback: return a flat line
    return 'M0 17 L100 17';
  }

  let minVal: number;
  let maxVal: number;

  switch (title) {
    case 'VCO2':
      minVal = 0;
      maxVal = 200;
      break;
    case 'VO2':
      minVal = 0;
      maxVal = 200;
      break;
    case 'RQ':
      minVal = 0.5;
      maxVal = 1.5;
      break;
    case 'EE':
      minVal = 0;
      maxVal = 1500;
      break;
    default:
      minVal = 0;
      maxVal = 100;
  }

  return dataToSvgPath(windowData, minVal, maxVal, 100, 34);
}

/**
 * Generate MVexp waveform from a specific time window (for sub-chart detail view)
 * Not used directly - MVexp always shows 24h
 */
export function generateMVexpWave(_range: string): string {
  return generateMVexpWave24h();
}

/**
 * Legacy function for sub-chart waveform (generates full 24h now)
 */
export function generateSubChartWave(
  title: string,
  _range: string
): string {
  const data24h = getSubChart24hData(title);
  
  let minVal: number;
  let maxVal: number;

  switch (title) {
    case 'VCO2':
      minVal = 0;
      maxVal = 200;
      break;
    case 'VO2':
      minVal = 0;
      maxVal = 200;
      break;
    case 'RQ':
      minVal = 0.5;
      maxVal = 1.5;
      break;
    case 'EE':
      minVal = 0;
      maxVal = 1500;
      break;
    default:
      minVal = 0;
      maxVal = 100;
  }

  return dataToSvgPath(data24h, minVal, maxVal, 100, 34);
}

/**
 * Clear cached data (useful when regenerating)
 */
export function clearWaveformCache(): void {
  cachedMVexpData = null;
  cachedSubChartData = {};
}
