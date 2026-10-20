// Waveform generation utilities for Calorimetry charts

const TOTAL_HOURS = 24;
const TOTAL_POINTS = TOTAL_HOURS * 60; // 1440 points for 24h (1 per minute)

// Metabolic cycle data (20-minute cycle, 12 sample points)
// Based on clinical data: VO2 base ~145, VCO2 base ~110
// Increased amplitude for more visible fluctuations in the UI
const VO2_METABOLIC_CYCLE = [145, 185, 200, 185, 155, 130, 120, 135, 165, 195, 185, 145];
const VCO2_METABOLIC_CYCLE = [110, 140, 155, 145, 125, 105, 95, 100, 120, 145, 140, 110];

interface StablePeriod {
  start: number;
  duration: number;
}

/**
 * Generate metabolic wave from cycle data points using linear interpolation
 * Creates smooth periodic waveform from discrete clinical data points
 * Includes multiple stable periods (20-40min each) to simulate realistic metabolic patterns
 * Users need to interact to find the stable periods for caloric calculation
 *
 * Cycle: 12 data points = 20 minutes, repeated 72 times over 24h
 */
function generateMetabolicWave(cycleData: number[], totalPoints: number, baseline: number): number[] {
  const result: number[] = [];
  const cycleLength = cycleData.length;

  // Define multiple stable periods (20-40 minutes each), distributed across 24h
  // Users need to interact to find these stable windows for caloric calculation
  const stablePeriods: StablePeriod[] = [
    { start: Math.floor(totalPoints * 0.12), duration: 25 }, // ~2.9h, 25min
    { start: Math.floor(totalPoints * 0.32), duration: 35 }, // ~7.7h, 35min
    { start: Math.floor(totalPoints * 0.58), duration: 20 }, // ~13.9h, 20min
    { start: Math.floor(totalPoints * 0.82), duration: 30 }, // ~19.7h, 30min
  ];

  // Transition size: 10 points (10 minutes)
  const transitionSize = 10;

  // 12 data points = 20 minutes (cycle repeats 72 times in 24h)
  const cycleMinutes = 20;

  for (let i = 0; i < totalPoints; i++) {
    // Calculate which position in the 20-minute cycle this point belongs to
    const minuteInCycle = i % cycleMinutes;
    const position = (minuteInCycle / cycleMinutes) * cycleLength;
    const index = Math.floor(position) % cycleLength;
    const nextIndex = (index + 1) % cycleLength;
    const fraction = position - Math.floor(position);
    const fluctuatingValue = cycleData[index] + fraction * (cycleData[nextIndex] - cycleData[index]);

    // Check if current point is inside any stable period
    let inStable = false;
    let transitionT = 0;
    let isTransition = false;

    for (const period of stablePeriods) {
      const periodEnd = period.start + period.duration;

      if (i >= period.start && i < periodEnd) {
        // Inside stable period
        inStable = true;
        break;
      } else if (i >= period.start - transitionSize && i < period.start) {
        // Transition into stable period (approaching from left)
        isTransition = true;
        transitionT = Math.max(transitionT, (i - (period.start - transitionSize)) / transitionSize);
      } else if (i >= periodEnd && i < periodEnd + transitionSize) {
        // Transition out of stable period (leaving to right)
        isTransition = true;
        transitionT = Math.max(transitionT, 1 - (i - periodEnd) / transitionSize);
      }
    }

    if (inStable) {
      // Stable period: baseline + tiny noise (<0.5%) to simulate natural variation
      const tinyNoise = baseline * 0.005 * (Math.random() - 0.5);
      result.push(baseline + tinyNoise);
    } else if (isTransition) {
      // Transition period: smooth ramp between fluctuating and stable
      result.push(fluctuatingValue * (1 - transitionT) + baseline * transitionT);
    } else {
      // Fluctuating period: use cycle data
      result.push(fluctuatingValue);
    }
  }

  return result;
}

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
  // Wider width creates smoother, more rounded peaks without sharp breakpoints
  const spikes = [
    { center: 0.28, height: 0.80, width: 0.035 },   // Left-mid spike (wider, rounded)
    { center: 0.55, height: 1.30, width: 0.045 },   // Center spike (largest, widest)
    { center: 0.80, height: 1.00, width: 0.038 },   // Right spike (wider, rounded)
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

  // Moderate smoothing for连贯波形 while keeping detail
  const smoothed: number[] = [];
  const windowSize = 4;
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
    switch (title) {
      case 'VCO2':
        cachedSubChartData[title] = generateMetabolicWave(VCO2_METABOLIC_CYCLE, TOTAL_POINTS, 110);
        break;
      case 'VO2':
        cachedSubChartData[title] = generateMetabolicWave(VO2_METABOLIC_CYCLE, TOTAL_POINTS, 145);
        break;
      case 'RQ': {
        // RQ = VCO2 / VO2
        const vco2Data = getSubChart24hData('VCO2');
        const vo2Data = getSubChart24hData('VO2');
        cachedSubChartData[title] = vco2Data.map((vco2, i) => {
          const vo2 = vo2Data[i];
          return vo2 > 0 ? vco2 / vo2 : 0.75;
        });
        break;
      }
      case 'EE': {
        // EE = 3.941 * VO2 + 1.106 * VCO2, scaled to baseline 850
        const vo2DataEE = getSubChart24hData('VO2');
        const vco2DataEE = getSubChart24hData('VCO2');
        const baseRawEE = 3.941 * 145 + 1.106 * 110; // 693.105
        const scaleFactor = 850 / baseRawEE;
        cachedSubChartData[title] = vo2DataEE.map((vo2, i) => {
          const vco2 = vco2DataEE[i];
          const rawEE = 3.941 * vo2 + 1.106 * vco2;
          return rawEE * scaleFactor;
        });
        break;
      }
      default:
        cachedSubChartData[title] = generateWaveData(50, 10, TOTAL_POINTS);
    }
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
  // Use full 0-6 range to prevent waveform clipping at top/bottom
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
