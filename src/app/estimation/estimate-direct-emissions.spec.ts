import { desktop, laptop, network, server } from './device-type';
import { estimateDirectEmissions } from './estimate-direct-emissions';
import { estimateEnergyEmissions } from './estimate-energy-emissions';

it('should return no emissions if all device counts are empty', () => {
  const deviceCounts = { laptopCount: 0, desktopCount: 0, serverCount: 0, networkCount: 0 };
  expect(estimateDirectEmissions(deviceCounts, 'global')).toBe(0);
});

it('should return emissions from specified amounts of devices', () => {
  const deviceCounts = { laptopCount: 1, desktopCount: 2, serverCount: 3, networkCount: 4 };
  const estimateLaptopEnergy = spyOn(laptop, 'estimateYearlyEnergy').and.returnValue(1);
  const estimateDesktopEnergy = spyOn(desktop, 'estimateYearlyEnergy').and.returnValue(2);
  const estimateServerEnergy = spyOn(server, 'estimateYearlyEnergy').and.returnValue(3);
  const estimateNetworkEnergy = spyOn(network, 'estimateYearlyEnergy').and.returnValue(4);

  const totalEstimatedEmissions = estimateEnergyEmissions(10, 'global');
  expect(estimateDirectEmissions(deviceCounts, 'global')).toBeCloseTo(totalEstimatedEmissions);
  expect(estimateLaptopEnergy).toHaveBeenCalledOnceWith(1);
  expect(estimateDesktopEnergy).toHaveBeenCalledOnceWith(2);
  expect(estimateServerEnergy).toHaveBeenCalledOnceWith(3);
  expect(estimateNetworkEnergy).toHaveBeenCalledOnceWith(4);
});