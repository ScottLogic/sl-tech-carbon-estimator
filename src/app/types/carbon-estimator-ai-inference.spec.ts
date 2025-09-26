import { AIInference, EstimatorValues, getTaskEnergyConsumption, getAIProviderPUE, estimateAIInferenceCO2e, estimateMultipleAITasksCO2e, AITaskUsage, estimateAIInferenceCO2eRange, estimateMultipleAITasksCO2eRange } from './carbon-estimator';

describe('AI Inference Types', () => {
  it('should define AIInference type with required properties', () => {
    const aiInference: AIInference = {
      noAIInference: false,
      primaryTaskType: 'text-generation',
      monthlyInferences: 1000,
      aiServiceProvider: 'openai',
      aiServiceLocation: 'WORLD'
    };

    expect(aiInference.noAIInference).toBe(false);
    expect(aiInference.primaryTaskType).toBe('text-generation');
    expect(aiInference.monthlyInferences).toBe(1000);
    expect(aiInference.aiServiceProvider).toBe('openai');
    expect(aiInference.aiServiceLocation).toBe('WORLD');
  });

  it('should include aiInference in EstimatorValues type', () => {
    const estimatorValues: EstimatorValues = {
      upstream: {
        headCount: 100,
        desktopPercentage: 50,
        employeeLocation: 'WORLD'
      },
      onPremise: {
        estimateServerCount: false,
        serverLocation: 'WORLD',
        numberOfServers: 10
      },
      cloud: {
        noCloudServices: false,
        cloudLocation: 'WORLD',
        cloudPercentage: 50,
        monthlyCloudBill: { min: 0, max: 1000 }
      },
      aiInference: {
        noAIInference: false,
        primaryTaskType: 'text-generation',
        monthlyInferences: 1000,
        aiServiceProvider: 'openai',
        aiServiceLocation: 'WORLD'
      },
      downstream: {
        noDownstream: false,
        customerLocation: 'WORLD',
        monthlyActiveUsers: 100,
        mobilePercentage: 50,
        purposeOfSite: 'average'
      }
    };

    expect(estimatorValues.aiInference).toBeDefined();
    expect(estimatorValues.aiInference.primaryTaskType).toBe('text-generation');
  });

  describe('Energy consumption data by AI task type', () => {
    it('should provide correct energy data for text-classification', () => {
      const energy = getTaskEnergyConsumption('text-classification');
      expect(energy.meanKwhPer1000Inferences).toBe(0.002);
      expect(energy.lowBandKwhPer1000Inferences).toBe(0.001); // mean - stdev
      expect(energy.highBandKwhPer1000Inferences).toBe(0.003); // mean + stdev
    });

    it('should provide correct energy data for extractive-qa', () => {
      const energy = getTaskEnergyConsumption('extractive-qa');
      expect(energy.meanKwhPer1000Inferences).toBe(0.003);
      expect(energy.lowBandKwhPer1000Inferences).toBe(0.002); // 0.003 - 0.001
      expect(energy.highBandKwhPer1000Inferences).toBe(0.004); // 0.003 + 0.001
    });

    it('should provide correct energy data for token-classification', () => {
      const energy = getTaskEnergyConsumption('token-classification');
      expect(energy.meanKwhPer1000Inferences).toBe(0.004);
      expect(energy.lowBandKwhPer1000Inferences).toBe(0.002); // 0.004 - 0.002
      expect(energy.highBandKwhPer1000Inferences).toBe(0.006); // 0.004 + 0.002
    });

    it('should provide correct energy data for image-classification', () => {
      const energy = getTaskEnergyConsumption('image-classification');
      expect(energy.meanKwhPer1000Inferences).toBe(0.007);
      expect(energy.lowBandKwhPer1000Inferences).toBe(0.006); // 0.007 - 0.001
      expect(energy.highBandKwhPer1000Inferences).toBe(0.008); // 0.007 + 0.001
    });

    it('should provide correct energy data for object-detection', () => {
      const energy = getTaskEnergyConsumption('object-detection');
      expect(energy.meanKwhPer1000Inferences).toBe(0.038);
      expect(energy.lowBandKwhPer1000Inferences).toBe(0.018); // 0.038 - 0.020
      expect(energy.highBandKwhPer1000Inferences).toBeCloseTo(0.058, 3); // 0.038 + 0.020
    });

    it('should provide correct energy data for text-generation', () => {
      const energy = getTaskEnergyConsumption('text-generation');
      expect(energy.meanKwhPer1000Inferences).toBe(0.047);
      expect(energy.lowBandKwhPer1000Inferences).toBe(0.017); // 0.047 - 0.030
      expect(energy.highBandKwhPer1000Inferences).toBe(0.077); // 0.047 + 0.030
    });

    it('should provide correct energy data for summarisation', () => {
      const energy = getTaskEnergyConsumption('summarisation');
      expect(energy.meanKwhPer1000Inferences).toBe(0.049);
      expect(energy.lowBandKwhPer1000Inferences).toBe(0.039); // 0.049 - 0.010
      expect(energy.highBandKwhPer1000Inferences).toBeCloseTo(0.059, 3); // 0.049 + 0.010
    });

    it('should provide correct energy data for image-captioning', () => {
      const energy = getTaskEnergyConsumption('image-captioning');
      expect(energy.meanKwhPer1000Inferences).toBe(0.063);
      expect(energy.lowBandKwhPer1000Inferences).toBe(0.043); // 0.063 - 0.020
      expect(energy.highBandKwhPer1000Inferences).toBe(0.083); // 0.063 + 0.020
    });

    it('should provide correct energy data for image-generation', () => {
      const energy = getTaskEnergyConsumption('image-generation');
      expect(energy.meanKwhPer1000Inferences).toBe(2.907);
      expect(energy.lowBandKwhPer1000Inferences).toBe(0); // 2.907 - 3.310 = -0.403, clamped to 0
      expect(energy.highBandKwhPer1000Inferences).toBeCloseTo(6.217, 3); // 2.907 + 3.310
    });

    it('should provide correct energy data for mixed-usage (dynamically calculated from all other task types)', () => {
      const energy = getTaskEnergyConsumption('mixed-usage');
      expect(energy.meanKwhPer1000Inferences).toBeCloseTo(0.347, 3); // Dynamically calculated average
      expect(energy.lowBandKwhPer1000Inferences).toBe(0); // ~0.347 - 0.377 = -0.030, clamped to 0
      expect(energy.highBandKwhPer1000Inferences).toBeCloseTo(0.724, 3); // ~0.347 + 0.377
    });
  });

  describe('getAIProviderPUE', () => {
    it('should provide PUE for OpenAI', () => {
      expect(getAIProviderPUE('openai')).toBe(1.12);
    });

    it('should provide PUE for Anthropic', () => {
      expect(getAIProviderPUE('anthropic')).toBe(1.15);
    });

    it('should provide PUE for Google', () => {
      expect(getAIProviderPUE('google')).toBe(1.09);
    });

    it('should provide PUE for Microsoft', () => {
      expect(getAIProviderPUE('microsoft')).toBe(1.12);
    });

    it('should provide PUE for AWS', () => {
      expect(getAIProviderPUE('aws')).toBe(1.15);
    });

    it('should provide PUE for Meta', () => {
      expect(getAIProviderPUE('meta')).toBe(1.08);
    });

    it('should provide PUE for HuggingFace', () => {
      expect(getAIProviderPUE('huggingface')).toBe(1.15);
    });

    it('should provide PUE for Other providers', () => {
      expect(getAIProviderPUE('other')).toBe(1.58);
    });
  });

  describe('estimateAIInferenceCO2e', () => {
    const carbonIntensity = 500; // gCO2e/kWh - typical global average

    it('should calculate CO2e emissions for text-classification task', () => {
      // Step 1: CO2e per 1,000 = energy per 1,000 (kWh) × PUE × CIF (kg/kWh)
      // CO2e per 1,000 = 0.002 × 1.12 × (500/1000) = 0.00112 kg CO2e per 1,000 inferences
      // Step 2: CO2e total = CO2e per 1,000 × number of requests ÷ 1,000
      // 10,000 monthly inferences × 12 months = 120,000 annual inferences
      // CO2e total = 0.00112 × 120,000 ÷ 1,000 = 0.1344 kg CO2e
      const result = estimateAIInferenceCO2e('text-classification', 10000, 'openai', carbonIntensity);
      expect(result).toBeCloseTo(0.1344, 4);
    });

    it('should calculate CO2e emissions for image-generation task', () => {
      // Step 1: CO2e per 1,000 = energy per 1,000 (kWh) × PUE × CIF (kg/kWh)
      // CO2e per 1,000 = 2.907 × 1.09 × (500/1000) = 1.58431 kg CO2e per 1,000 inferences
      // Step 2: CO2e total = CO2e per 1,000 × number of requests ÷ 1,000
      // 1,000 monthly inferences × 12 months = 12,000 annual inferences
      // CO2e total = 1.58431 × 12,000 ÷ 1,000 = 19.01172 kg CO2e
      const result = estimateAIInferenceCO2e('image-generation', 1000, 'google', carbonIntensity);
      expect(result).toBeCloseTo(19.012, 3);
    });

    it('should calculate CO2e emissions for mixed-usage with different provider', () => {
      // Step 1: CO2e per 1,000 = energy per 1,000 (kWh) × PUE × CIF (kg/kWh)
      // mixed-usage: ~0.347 kWh per 1,000 inferences (dynamically calculated average)
      // CO2e per 1,000 = 0.347 × 1.08 × (500/1000) = 0.18738 kg CO2e per 1,000 inferences
      // Step 2: CO2e total = CO2e per 1,000 × number of requests ÷ 1,000
      // 5,000 monthly inferences × 12 months = 60,000 annual inferences
      // CO2e total = 0.18738 × 60,000 ÷ 1,000 = 11.2428 kg CO2e
      // Actual calculation uses precise mixed-usage value, so expect ~11.232
      const result = estimateAIInferenceCO2e('mixed-usage', 5000, 'meta', carbonIntensity);
      expect(result).toBeCloseTo(11.232, 2);
    });

    it('should handle small inference volumes correctly', () => {
      // Step 1: CO2e per 1,000 = energy per 1,000 (kWh) × PUE × CIF (kg/kWh)
      // CO2e per 1,000 = 0.047 × 1.15 × (500/1000) = 0.027025 kg CO2e per 1,000 inferences
      // Step 2: CO2e total = CO2e per 1,000 × number of requests ÷ 1,000
      // 100 monthly inferences × 12 months = 1,200 annual inferences
      // CO2e total = 0.027025 × 1,200 ÷ 1,000 = 0.03243 kg CO2e
      const result = estimateAIInferenceCO2e('text-generation', 100, 'aws', carbonIntensity);
      expect(result).toBeCloseTo(0.03243, 5);
    });
  });

  describe('estimateMultipleAITasksCO2e', () => {
    const carbonIntensity = 500; // gCO2e/kWh - typical global average

    it('should calculate CO2e emissions for multiple AI tasks', () => {
      const taskUsages: AITaskUsage[] = [
        { taskType: 'text-classification', monthlyInferences: 10000 },
        { taskType: 'image-generation', monthlyInferences: 500 },
        { taskType: 'text-generation', monthlyInferences: 2000 },
      ];

      const result = estimateMultipleAITasksCO2e(taskUsages, 'openai', carbonIntensity);

      // Verify individual task emissions
      expect(result.taskEmissions.length).toBe(3);
      
      // Step 1: CO2e per 1,000 = energy per 1,000 (kWh) × PUE × CIF (kg/kWh)
      // Step 2: CO2e total = CO2e per 1,000 × number of requests ÷ 1,000
      
      // text-classification: CO2e per 1,000 = 0.002 × 1.12 × (500/1000) = 0.00112 kg CO2e per 1,000 inferences
      // CO2e total = 0.00112 × (10000 × 12) ÷ 1000 = 0.1344 kg CO2e
      expect(result.taskEmissions[0].taskType).toBe('text-classification');
      expect(result.taskEmissions[0].monthlyInferences).toBe(10000);
      expect(result.taskEmissions[0].co2eKg).toBeCloseTo(0.1344, 4);
      
      // image-generation: CO2e per 1,000 = 2.907 × 1.12 × (500/1000) = 1.62792 kg CO2e per 1,000 inferences
      // CO2e total = 1.62792 × (500 × 12) ÷ 1000 = 9.76752 kg CO2e
      expect(result.taskEmissions[1].taskType).toBe('image-generation');
      expect(result.taskEmissions[1].monthlyInferences).toBe(500);
      expect(result.taskEmissions[1].co2eKg).toBeCloseTo(9.76752, 4);
      
      // text-generation: CO2e per 1,000 = 0.047 × 1.12 × (500/1000) = 0.02632 kg CO2e per 1,000 inferences
      // CO2e total = 0.02632 × (2000 × 12) ÷ 1000 = 0.6317 kg CO2e
      expect(result.taskEmissions[2].taskType).toBe('text-generation');
      expect(result.taskEmissions[2].monthlyInferences).toBe(2000);
      expect(result.taskEmissions[2].co2eKg).toBeCloseTo(0.6317, 4);

      // Total should be sum of all tasks
      const expectedTotal = 0.1344 + 9.76752 + 0.6317;
      expect(result.totalCO2e).toBeCloseTo(expectedTotal, 4);
    });

    it('should handle empty task list', () => {
      const taskUsages: AITaskUsage[] = [];
      const result = estimateMultipleAITasksCO2e(taskUsages, 'google', carbonIntensity);
      
      expect(result.taskEmissions.length).toBe(0);
      expect(result.totalCO2e).toBe(0);
    });

    it('should handle single task same as individual calculation', () => {
      const taskUsages: AITaskUsage[] = [
        { taskType: 'mixed-usage', monthlyInferences: 3000 },
      ];

      const multipleResult = estimateMultipleAITasksCO2e(taskUsages, 'meta', carbonIntensity);
      const singleResult = estimateAIInferenceCO2e('mixed-usage', 3000, 'meta', carbonIntensity);
      
      expect(multipleResult.taskEmissions.length).toBe(1);
      expect(multipleResult.taskEmissions[0].co2eKg).toBeCloseTo(singleResult, 10);
      expect(multipleResult.totalCO2e).toBeCloseTo(singleResult, 10);
    });

    it('should calculate different providers correctly', () => {
      const taskUsages: AITaskUsage[] = [
        { taskType: 'text-classification', monthlyInferences: 5000 },
        { taskType: 'object-detection', monthlyInferences: 1000 },
      ];

      // Compare Google (PUE 1.09) vs Other (PUE 1.58) 
      const googleResult = estimateMultipleAITasksCO2e(taskUsages, 'google', carbonIntensity);
      const otherResult = estimateMultipleAITasksCO2e(taskUsages, 'other', carbonIntensity);
      
      // Other provider should have higher emissions due to higher PUE
      expect(otherResult.totalCO2e).toBeGreaterThan(googleResult.totalCO2e);
      
      // Ratio should be approximately PUE ratio (1.58/1.09 ≈ 1.45)
      const ratio = otherResult.totalCO2e / googleResult.totalCO2e;
      expect(ratio).toBeCloseTo(1.58 / 1.09, 2);
    });
  });

  describe('estimateAIInferenceCO2eRange', () => {
    const carbonIntensity = 500; // gCO2e/kWh - typical global average

    it('should calculate low, mean, and high CO2e estimates for text-classification', () => {
      // text-classification energy: mean=0.002, stdev=0.001 kWh per 1,000 inferences
      // Low = max(0.002 - 0.001, 0) = 0.001, High = 0.002 + 0.001 = 0.003
      // OpenAI PUE: 1.12, 1000 monthly inferences × 12 = 12,000 annual inferences
      
      // Step 1: CO2e per 1,000 = energy per 1,000 (kWh) × PUE × CIF (kg/kWh)
      // Low: CO2e per 1,000 = 0.001 × 1.12 × (500/1000) = 0.00056 kg CO2e per 1,000 inferences
      // Mean: CO2e per 1,000 = 0.002 × 1.12 × (500/1000) = 0.00112 kg CO2e per 1,000 inferences  
      // High: CO2e per 1,000 = 0.003 × 1.12 × (500/1000) = 0.00168 kg CO2e per 1,000 inferences
      
      // Step 2: CO2e total = CO2e per 1,000 × number of requests ÷ 1,000
      // Low: CO2e total = 0.00056 × 12,000 ÷ 1,000 = 0.00672 kg CO2e
      // Mean: CO2e total = 0.00112 × 12,000 ÷ 1,000 = 0.01344 kg CO2e
      // High: CO2e total = 0.00168 × 12,000 ÷ 1,000 = 0.02016 kg CO2e
      const result = estimateAIInferenceCO2eRange('text-classification', 1000, 'openai', carbonIntensity);
      
      expect(result.low).toBeCloseTo(0.00672, 5);
      expect(result.mean).toBeCloseTo(0.01344, 5);
      expect(result.high).toBeCloseTo(0.02016, 5);
      
      // Sanity checks
      expect(result.low).toBeLessThan(result.mean);
      expect(result.mean).toBeLessThan(result.high);
    });

    it('should calculate ranges for image-generation with high standard deviation', () => {
      // image-generation energy: mean=2.907, stdev=3.310 kWh per 1,000 inferences
      // Low = max(2.907 - 3.310, 0) = 0, High = 2.907 + 3.310 = 6.217
      // Google PUE: 1.09, 500 monthly inferences × 12 = 6,000 annual inferences
      
      // Step 1: CO2e per 1,000 = energy per 1,000 (kWh) × PUE × CIF (kg/kWh)
      // Low: CO2e per 1,000 = 0 × 1.09 × (500/1000) = 0 kg CO2e per 1,000 inferences
      // Mean: CO2e per 1,000 = 2.907 × 1.09 × (500/1000) = 1.58431 kg CO2e per 1,000 inferences
      // High: CO2e per 1,000 = 6.217 × 1.09 × (500/1000) = 3.38827 kg CO2e per 1,000 inferences
      
      // Step 2: CO2e total = CO2e per 1,000 × number of requests ÷ 1,000
      // Low: CO2e total = 0 × 6,000 ÷ 1,000 = 0 kg CO2e
      // Mean: CO2e total = 1.58431 × 6,000 ÷ 1,000 = 9.50586 kg CO2e
      // High: CO2e total = 3.38827 × 6,000 ÷ 1,000 = 20.3296 kg CO2e
      const result = estimateAIInferenceCO2eRange('image-generation', 500, 'google', carbonIntensity);
      
      expect(result.low).toBeCloseTo(0, 5);
      expect(result.mean).toBeCloseTo(9.50586, 4);
      expect(result.high).toBeCloseTo(20.3296, 4);
      
      // Verify the range shows significant uncertainty
      const range = result.high - result.low;
      expect(range).toBeGreaterThan(result.mean);
    });

    it('should handle mixed-usage with dynamic calculation', () => {
      // mixed-usage uses dynamic averaging, so we test the pattern rather than exact values
      const result = estimateAIInferenceCO2eRange('mixed-usage', 2000, 'meta', carbonIntensity);
      
      expect(result.low).toBeGreaterThanOrEqual(0);
      expect(result.low).toBeLessThan(result.mean);
      expect(result.mean).toBeLessThan(result.high);
      expect(result.high).toBeGreaterThan(0);
      
      // Verify the single task mean matches the range mean
      const singleResult = estimateAIInferenceCO2e('mixed-usage', 2000, 'meta', carbonIntensity);
      expect(result.mean).toBeCloseTo(singleResult, 10);
    });
  });

  describe('estimateMultipleAITasksCO2eRange', () => {
    const carbonIntensity = 500; // gCO2e/kWh - typical global average

    it('should calculate ranges for multiple AI tasks', () => {
      const taskUsages: AITaskUsage[] = [
        { taskType: 'text-classification', monthlyInferences: 5000 },
        { taskType: 'image-generation', monthlyInferences: 100 },
      ];

      const result = estimateMultipleAITasksCO2eRange(taskUsages, 'google', carbonIntensity);

      // Verify structure
      expect(result.taskEmissions.length).toBe(2);
      
      // Check first task (text-classification)
      expect(result.taskEmissions[0].taskType).toBe('text-classification');
      expect(result.taskEmissions[0].monthlyInferences).toBe(5000);
      expect(result.taskEmissions[0].co2e.low).toBeLessThan(result.taskEmissions[0].co2e.mean);
      expect(result.taskEmissions[0].co2e.mean).toBeLessThan(result.taskEmissions[0].co2e.high);
      
      // Check second task (image-generation)
      expect(result.taskEmissions[1].taskType).toBe('image-generation');
      expect(result.taskEmissions[1].monthlyInferences).toBe(100);
      expect(result.taskEmissions[1].co2e.low).toBeLessThan(result.taskEmissions[1].co2e.mean);
      expect(result.taskEmissions[1].co2e.mean).toBeLessThan(result.taskEmissions[1].co2e.high);
      
      // Verify totals are sums of individual tasks
      const expectedTotalLow = result.taskEmissions[0].co2e.low + result.taskEmissions[1].co2e.low;
      const expectedTotalMean = result.taskEmissions[0].co2e.mean + result.taskEmissions[1].co2e.mean;
      const expectedTotalHigh = result.taskEmissions[0].co2e.high + result.taskEmissions[1].co2e.high;
      
      expect(result.totalCO2e.low).toBeCloseTo(expectedTotalLow, 10);
      expect(result.totalCO2e.mean).toBeCloseTo(expectedTotalMean, 10);
      expect(result.totalCO2e.high).toBeCloseTo(expectedTotalHigh, 10);
    });

    it('should handle empty task list', () => {
      const taskUsages: AITaskUsage[] = [];
      const result = estimateMultipleAITasksCO2eRange(taskUsages, 'google', carbonIntensity);
      
      expect(result.taskEmissions.length).toBe(0);
      expect(result.totalCO2e.low).toBe(0);
      expect(result.totalCO2e.mean).toBe(0);
      expect(result.totalCO2e.high).toBe(0);
    });

    it('should have mean values matching non-range functions', () => {
      const taskUsages: AITaskUsage[] = [
        { taskType: 'text-generation', monthlyInferences: 1000 },
        { taskType: 'object-detection', monthlyInferences: 500 },
      ];

      const rangeResult = estimateMultipleAITasksCO2eRange(taskUsages, 'aws', carbonIntensity);
      const normalResult = estimateMultipleAITasksCO2e(taskUsages, 'aws', carbonIntensity);
      
      // Mean values should match
      expect(rangeResult.totalCO2e.mean).toBeCloseTo(normalResult.totalCO2e, 10);
      
      // Individual task means should match
      expect(rangeResult.taskEmissions[0].co2e.mean).toBeCloseTo(normalResult.taskEmissions[0].co2eKg, 10);
      expect(rangeResult.taskEmissions[1].co2e.mean).toBeCloseTo(normalResult.taskEmissions[1].co2eKg, 10);
    });
  });
});