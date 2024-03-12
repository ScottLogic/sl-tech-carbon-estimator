import { desktop, laptop, network, server } from './device-type';
import { estimateUpstreamEmissions } from './estimate-upstream-emissions';

it('should return no emissions if all device counts are empty', () => {
  const deviceCounts = { laptopCount: 0, desktopCount: 0, serverCount: 0, networkCount: 0 };
  expect(estimateUpstreamEmissions(deviceCounts)).toBe(0);
});

it('should return emissions from specified amounts of devices', () => {
  const deviceCounts = { laptopCount: 1, desktopCount: 2, serverCount: 3, networkCount: 4 };
  const estimateLaptopEmissions = spyOn(laptop, 'estimateYearlyUpstreamEmissions').and.returnValue(1);
  const estimateDesktopEmissions = spyOn(desktop, 'estimateYearlyUpstreamEmissions').and.returnValue(2);
  const estimateServerEmissions = spyOn(server, 'estimateYearlyUpstreamEmissions').and.returnValue(3);
  const estimateNetworkEmissions = spyOn(network, 'estimateYearlyUpstreamEmissions').and.returnValue(4);

  expect(estimateUpstreamEmissions(deviceCounts)).toBe(10);
  expect(estimateLaptopEmissions).toHaveBeenCalledOnceWith(1);
  expect(estimateDesktopEmissions).toHaveBeenCalledOnceWith(2);
  expect(estimateServerEmissions).toHaveBeenCalledOnceWith(3);
  expect(estimateNetworkEmissions).toHaveBeenCalledOnceWith(4);
});
