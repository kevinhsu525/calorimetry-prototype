// Waveform generation utilities for Calorimetry charts

const TOTAL_HOURS = 24;
const TOTAL_POINTS = TOTAL_HOURS * 60; // 1440 points for 24h (1 per minute)

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
 * Generate breathing-like waveform with natural variations
 * Simulates realistic respiratory patterns with periodic cycles and distinct peaks
 */
function generateBreathingWave(baseline: number, amplitude: number, points: number): number[] {
  const data: number[] = [];
  const minVal = baseline - amplitude * 0.6;
  const maxVal = baseline + amplitude * 0.8;

  // Seed for reproducibility
  const seed = 42;
  let randomState = seed;
  const random = () => {
    randomState = (randomState * 16807 + 0) % 2147483647;
    return (randomState - 1) / 2147483646;
  };

  // Fixed spike positions and properties (relative to total points, 0-1)
  // These create the distinct peaks seen in the reference image
  const spikes = [
    { center: 0.28, height: 0.90, width: 0.012 },   // Left-mid spike
    { center: 0.55, height: 1.50, width: 0.018 },   // Center spike (largest)
    { center: 0.80, height: 1.15, width: 0.015 },  // Right spike
  ];

  for (let i = 0; i < points; i++) {
    const t = i / points;

    // Slow breathing cycle (large waves, ~2-3 cycles across 24h)
    const slowCycle = Math.sin(t * Math.PI * 2 * 2.5) * amplitude * 0.22;

    // Medium fluctuations (faster, smaller waves)
    const mediumCycle = Math.sin(t * Math.PI * 2 * 7.5) * amplitude * 0.12;

    // Fast small noise for natural texture
    const noise = (random() - 0.5) * amplitude * 0.05;

    let value = baseline + slowCycle + mediumCycle + noise;

    // Add spikes with Gaussian-like shape for natural appearance
    for (const spike of spikes) {
      const spikeCenter = spike.center * points;
      const distance = (i - spikeCenter) / points;
      const gaussian = Math.exp(-(distance * distance) / (2 * spike.width * spike.width));
      value += spike.height * amplitude * gaussian;
    }

    // Clamp to valid range
    data.push(Math.max(minVal, Math.min(maxVal, value)));
  }

  // Light smoothing to reduce harsh noise while keeping detail
  const smoothed: number[] = [];
  const windowSize = 2;
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
  const windowSize = 5;
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
 * Uses a separate breathing wave generator for more natural look
 */
function getMVexp24hData(): number[] {
  if (!cachedMVexpData) {
    // Baseline 2.5, amplitude 4.0 -> range roughly 0.1 to 5.7
    cachedMVexpData = generateBreathingWave(2.5, 4.0, TOTAL_POINTS);
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
 * Fixed 24h data, does not change with time range selection
 */
export function generateMVexpWave24h(): string {
  const data = getMVexp24hData();
  // Tighter Y range to make waveform more visible (0.5 to 5.5 covers the data well)
  return dataToSvgPath(data, 0.5, 5.5, 100, 44.523);
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
 * Generate MVexp waveform - always returns full 24h data
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
 * Clear cached sub-chart data (MVexp data is kept fixed)
 */
export function clearWaveformCache(): void {
  // Only clear sub-chart data, keep MVexp data fixed for 24h view
  cachedSubChartData = {};
}
