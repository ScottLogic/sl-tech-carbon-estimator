import { AI_TASK_ENERGY_DATA, AI_PROVIDER_PUE_DATA, AI_ENERGY_DATA_CONFIG, AITaskType, allAiTaskArray, aiTaskArrayFromData } from './ai-energy-data';

describe('AI Energy Data Configuration', () => {
  describe('AI_TASK_ENERGY_DATA', () => {
    it('should contain energy data for all task types except mixed-usage', () => {
      expect(AI_TASK_ENERGY_DATA['text-classification']).toBeDefined();
      expect(AI_TASK_ENERGY_DATA['text-classification'].mean).toBe(0.002);
      expect(AI_TASK_ENERGY_DATA['text-classification'].stdev).toBe(0.001);
      
      expect(AI_TASK_ENERGY_DATA['image-generation']).toBeDefined();
      expect(AI_TASK_ENERGY_DATA['image-generation'].mean).toBe(2.907);
      expect(AI_TASK_ENERGY_DATA['image-generation'].stdev).toBe(3.310);
    });

    it('should have mean and stdev properties for each task type', () => {
      Object.keys(AI_TASK_ENERGY_DATA).forEach(taskType => {
        const data = AI_TASK_ENERGY_DATA[taskType as keyof typeof AI_TASK_ENERGY_DATA];
        expect(data.mean).toBeGreaterThan(0);
        expect(data.stdev).toBeGreaterThanOrEqual(0);
      });
    });

    it('should automatically generate task types from data', () => {
      // The aiTaskArrayFromData should match exactly with the keys in AI_TASK_ENERGY_DATA
      const dataKeys = Object.keys(AI_TASK_ENERGY_DATA).sort();
      const arrayKeys = [...aiTaskArrayFromData].sort();
      
      expect(arrayKeys.length).toBe(dataKeys.length);
      arrayKeys.forEach((key, index) => {
        expect(key).toBe(dataKeys[index]);
      });
    });

    it('should contain exactly 9 task types (excluding mixed-usage)', () => {
      const expectedTaskTypes = [
        'text-classification', 'extractive-qa', 'token-classification',
        'image-classification', 'object-detection', 'text-generation',
        'summarisation', 'image-captioning', 'image-generation'
      ];
      
      const actualTaskTypes = Object.keys(AI_TASK_ENERGY_DATA);
      expect(actualTaskTypes.length).toBe(9);
      
      expectedTaskTypes.forEach(taskType => {
        expect(actualTaskTypes).toContain(taskType);
      });
    });
  });

  describe('Derived Task Arrays', () => {
    it('should include mixed-usage in the complete task array', () => {
      expect(allAiTaskArray).toContain('mixed-usage');
      expect(allAiTaskArray.length).toBe(aiTaskArrayFromData.length + 1);
    });

    it('should not include mixed-usage in the data-derived array', () => {
      const arrayAsStrings = [...aiTaskArrayFromData] as string[];
      expect(arrayAsStrings.includes('mixed-usage')).toBe(false);
    });

    it('should have type-safe task arrays', () => {
      // This test verifies that the arrays are properly typed
      allAiTaskArray.forEach(task => {
        expect(typeof task).toBe('string');
      });
    });
  });

  describe('AI_PROVIDER_PUE_DATA', () => {
    it('should contain PUE data for all providers', () => {
      expect(AI_PROVIDER_PUE_DATA['openai']).toBeDefined();
      expect(AI_PROVIDER_PUE_DATA['openai'].value).toBe(1.12);
      expect(AI_PROVIDER_PUE_DATA['openai'].source).toContain('Microsoft');
      
      expect(AI_PROVIDER_PUE_DATA['google']).toBeDefined();
      expect(AI_PROVIDER_PUE_DATA['google'].value).toBe(1.09);
      
      expect(AI_PROVIDER_PUE_DATA['other']).toBeDefined();
      expect(AI_PROVIDER_PUE_DATA['other'].value).toBe(1.58);
    });

    it('should have value, source, and description for each provider', () => {
      Object.keys(AI_PROVIDER_PUE_DATA).forEach(provider => {
        const data = AI_PROVIDER_PUE_DATA[provider];
        expect(data.value).toBeGreaterThan(1);
        expect(data.source).toBeTruthy();
        expect(data.description).toBeTruthy();
      });
    });

    it('should contain exactly 8 providers', () => {
      const expectedProviders = [
        'openai', 'anthropic', 'google', 'microsoft', 
        'aws', 'meta', 'huggingface', 'other'
      ];
      
      const actualProviders = Object.keys(AI_PROVIDER_PUE_DATA);
      expect(actualProviders.length).toBe(8);
      
      expectedProviders.forEach(provider => {
        expect(actualProviders).toContain(provider);
      });
    });
  });

  describe('AI_ENERGY_DATA_CONFIG', () => {
    it('should contain configuration metadata', () => {
      expect(AI_ENERGY_DATA_CONFIG.version).toBeDefined();
      expect(AI_ENERGY_DATA_CONFIG.lastUpdated).toBeDefined();
      expect(AI_ENERGY_DATA_CONFIG.dataSource).toBeDefined();
      expect(AI_ENERGY_DATA_CONFIG.notes).toBeDefined();
      
      expect(Array.isArray(AI_ENERGY_DATA_CONFIG.notes)).toBe(true);
      expect(AI_ENERGY_DATA_CONFIG.notes.length).toBeGreaterThan(0);
    });

    it('should reference Luccioni et al. (2024) as data source', () => {
      expect(AI_ENERGY_DATA_CONFIG.dataSource).toContain('Luccioni');
      expect(AI_ENERGY_DATA_CONFIG.dataSource).toContain('2024');
    });
  });

  describe('Refactoring Benefits Demo', () => {
    it('should demonstrate how easy it is to add new tasks', () => {
      // This test shows how the refactored structure automatically handles new tasks
      // If we were to add a new task to AI_TASK_ENERGY_DATA, it would:
      
      // 1. Automatically be included in the task type union
      const taskCount = Object.keys(AI_TASK_ENERGY_DATA).length;
      expect(taskCount).toBe(9); // Current count
      
      // 2. Automatically be included in the derived arrays
      expect(aiTaskArrayFromData.length).toBe(taskCount);
      
      // 3. Automatically be available for type checking
      // TypeScript would recognize the new task type immediately
      
      // 4. The complete array would include the new task + mixed-usage
      expect(allAiTaskArray.length).toBe(taskCount + 1);
    });

    it('should maintain type safety automatically', () => {
      // This test verifies that our refactored types are self-consistent
      type DataKeys = keyof typeof AI_TASK_ENERGY_DATA;
      type ArrayItems = typeof aiTaskArrayFromData[number];
      
      // These types should be equivalent - if they weren't, this wouldn't compile
      const testTypeEquivalence = (key: DataKeys): ArrayItems => key;
      const testReverseEquivalence = (item: ArrayItems): DataKeys => item;
      
      expect(testTypeEquivalence).toBeDefined();
      expect(testReverseEquivalence).toBeDefined();
    });

    it('should demonstrate the single source of truth principle', () => {
      // Before refactoring: Multiple arrays needed to be kept in sync
      // After refactoring: Only AI_TASK_ENERGY_DATA needs to be updated
      
      const dataSource = AI_TASK_ENERGY_DATA;
      const derivedArray = aiTaskArrayFromData;
      
      // Verify that the derived array exactly matches the data source
      Object.keys(dataSource).forEach(key => {
        expect(derivedArray).toContain(key as any);
      });
      
      // Verify no extra items in derived array
      expect(derivedArray.length).toBe(Object.keys(dataSource).length);
    });
  });
});