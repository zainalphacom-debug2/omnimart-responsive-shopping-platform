import { DemoOrder } from '../types';

export interface TimelineStageInfo {
  stageIndex: number;
  label: string;
  virtualDay: number;
  virtualDayLabel: string;
  description: string;
  icon: string;
  isCompleted: boolean;
  isCurrent: boolean;
  relativeTimeLabel: string;
}

export const DELIVERY_STAGES: Array<{
  stageIndex: number;
  label: string;
  virtualDay: number;
  secondsThreshold: number;
  description: string;
  statusHeadline: string;
  iconName: string;
}> = [
  {
    stageIndex: 0,
    label: 'Order Placed',
    virtualDay: 0,
    secondsThreshold: 0,
    description: 'Order placed immediately after checkout in OMNIMART virtual system. Inventory reserved.',
    statusHeadline: 'Demo order successfully registered in virtual mall database',
    iconName: 'FileCheck',
  },
  {
    stageIndex: 1,
    label: 'Day 1 — Processing',
    virtualDay: 1,
    secondsThreshold: 30,
    description: 'Virtual fulfillment center verified payment simulation & initiated item picking.',
    statusHeadline: 'Virtual fulfillment center is preparing your parcel',
    iconName: 'Cog',
  },
  {
    stageIndex: 2,
    label: 'Day 2 — Packed',
    virtualDay: 2,
    secondsThreshold: 60,
    description: 'Items securely packed into eco-friendly OMNIMART parcel with simulated tracking barcode.',
    statusHeadline: 'Simulated package sealed and labeled with tracking code',
    iconName: 'PackageCheck',
  },
  {
    stageIndex: 3,
    label: 'Day 3 — Shipped',
    virtualDay: 3,
    secondsThreshold: 90,
    description: 'Transferred to Simulated Regional Logistics Hub. Fast simulated transport in transit.',
    statusHeadline: 'In transit via simulated express logistics network',
    iconName: 'Truck',
  },
  {
    stageIndex: 4,
    label: 'Day 4 — Out for Delivery',
    virtualDay: 4,
    secondsThreshold: 120,
    description: 'Assigned to simulated local courier. Scheduled for delivery to your saved address.',
    statusHeadline: 'Simulated courier is en route to your delivery address',
    iconName: 'MapPin',
  },
  {
    stageIndex: 5,
    label: 'Day 5 — Delivered',
    virtualDay: 5,
    secondsThreshold: 150,
    description: 'Simulated delivery marked completed at your doorstep or reception.',
    statusHeadline: 'Simulated delivery completed! Package marked delivered.',
    iconName: 'BadgeCheck',
  },
];

export interface LiveOrderStatus {
  currentStageIndex: number;
  currentStage: typeof DELIVERY_STAGES[0];
  virtualDay: number;
  virtualDayLabel: string;
  progressPercent: number; // 0 to 100
  elapsedSeconds: number;
  secondsRemainingInStage: number;
  secondsRemainingTotal: number;
  isFullyDelivered: boolean;
  stagesWithStatus: TimelineStageInfo[];
}

export function computeLiveOrderStatus(order: DemoOrder, currentTime: number = Date.now()): LiveOrderStatus {
  const speedSecondsPerDay = order.simulatedSpeedSecondsPerDay || 30;
  const elapsedMs = Math.max(0, currentTime - order.createdAt);
  let elapsedSeconds = Math.floor(elapsedMs / 1000);

  // If user used manual stage override, respect that
  let activeStageIndex = 0;
  if (typeof order.manualStageOverride === 'number') {
    activeStageIndex = Math.min(5, Math.max(0, order.manualStageOverride));
    elapsedSeconds = activeStageIndex * speedSecondsPerDay;
  } else {
    // 0-29s: Stage 0 (Order Placed)
    // 30-59s: Stage 1 (Day 1 — Processing)
    // 60-89s: Stage 2 (Day 2 — Packed)
    // 90-119s: Stage 3 (Day 3 — Shipped)
    // 120-149s: Stage 4 (Day 4 — Out for Delivery)
    // 150s+: Stage 5 (Day 5 — Delivered)
    activeStageIndex = Math.min(5, Math.floor(elapsedSeconds / speedSecondsPerDay));
  }

  const currentStage = DELIVERY_STAGES[activeStageIndex];
  const isFullyDelivered = activeStageIndex >= 5;

  const totalSimulationSeconds = 5 * speedSecondsPerDay; // 150 seconds = Day 5
  const progressPercent = isFullyDelivered
    ? 100
    : Math.min(100, Math.round((elapsedSeconds / totalSimulationSeconds) * 100));

  const secondsRemainingTotal = Math.max(0, totalSimulationSeconds - elapsedSeconds);
  const secondsIntoCurrentStage = elapsedSeconds % speedSecondsPerDay;
  const secondsRemainingInStage = isFullyDelivered ? 0 : speedSecondsPerDay - secondsIntoCurrentStage;

  const stagesWithStatus: TimelineStageInfo[] = DELIVERY_STAGES.map((stg) => {
    const isCompleted = stg.stageIndex < activeStageIndex || isFullyDelivered;
    const isCurrent = stg.stageIndex === activeStageIndex && !isFullyDelivered;

    let relativeTimeLabel = '';
    if (stg.stageIndex === 0) {
      relativeTimeLabel = 'Placed (0s)';
    } else {
      relativeTimeLabel = `+${stg.secondsThreshold}s elapsed`;
    }

    const dayLabel = stg.stageIndex === 0 ? 'Order Placed' : `Day ${stg.virtualDay}`;

    return {
      stageIndex: stg.stageIndex,
      label: stg.label,
      virtualDay: stg.virtualDay,
      virtualDayLabel: dayLabel,
      description: stg.description,
      icon: stg.iconName,
      isCompleted,
      isCurrent,
      relativeTimeLabel,
    };
  });

  const currentDayLabel = currentStage.stageIndex === 0 ? 'Day 0 (Placed)' : `Day ${currentStage.virtualDay}`;

  return {
    currentStageIndex: activeStageIndex,
    currentStage,
    virtualDay: currentStage.virtualDay,
    virtualDayLabel: currentDayLabel,
    progressPercent,
    elapsedSeconds,
    secondsRemainingInStage,
    secondsRemainingTotal,
    isFullyDelivered,
    stagesWithStatus,
  };
}
