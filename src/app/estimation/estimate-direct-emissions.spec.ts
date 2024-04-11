import { ON_PREMISE_AVERAGE_PUE } from './constants';
import { desktop, laptop, network, server } from './device-type';
import { estimateDirectEmissions } from './estimate-direct-emissions';
import { estimateEnergyEmissions } from './estimate-energy-emissions';

it('should return no emissions if all device counts are empty', () => {
  const deviceCounts = { laptopCount: 0, desktopCount: 0, serverCount: 0, networkCount: 0 };
  expect(estimateDirectEmissions(deviceCounts, 'global')).toEqual({
    user: 0,
    server: 0,
    network: 0,
  });
});

it('should return emissions from specified amounts of devices with PUE applied for data centre equipment', () => {
  const deviceCounts = { laptopCount: 1, desktopCount: 2, serverCount: 3, networkCount: 4 };
  const estimateLaptopEnergy = spyOn(laptop, 'estimateYearlyEnergy').and.returnValue(1);
  const estimateDesktopEnergy = spyOn(desktop, 'estimateYearlyEnergy').and.returnValue(2);
  const estimateServerEnergy = spyOn(server, 'estimateYearlyEnergy').and.returnValue(3);
  const estimateNetworkEnergy = spyOn(network, 'estimateYearlyEnergy').and.returnValue(4);

  const expectedUserEnergyEmissions = estimateEnergyEmissions(3, 'global');
  const expectedServerEnergyEmissions = estimateEnergyEmissions(3 * ON_PREMISE_AVERAGE_PUE, 'global');
  const expectedNetworkEnergyEmissions = estimateEnergyEmissions(4 * ON_PREMISE_AVERAGE_PUE, 'global');
  const result = estimateDirectEmissions(deviceCounts, 'global');
  expect(result.user).toEqual(expectedUserEnergyEmissions);
  expect(result.server).toEqual(expectedServerEnergyEmissions);
  expect(result.network).toEqual(expectedNetworkEnergyEmissions);

  expect(estimateLaptopEnergy).toHaveBeenCalledOnceWith(1);
  expect(estimateDesktopEnergy).toHaveBeenCalledOnceWith(2);
  expect(estimateServerEnergy).toHaveBeenCalledOnceWith(3);
  expect(estimateNetworkEnergy).toHaveBeenCalledOnceWith(4);
});
