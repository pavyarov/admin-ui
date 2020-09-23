import { RisksSummary } from './risks-summary';
import { TestTypeSummary } from './test-type-summary';

interface Count {
  covered?: number;
  total?: number;
}

export interface BuildCoverage {
  percentage?: number;
  byTestType?: TestTypeSummary[];
  uncoveredMethodsCount?: number;
  finishedScopesCount?: number;
  risks?: RisksSummary;
  count?: Count;
  riskCount?: Count;
  classCount?: Count;
  methodCount?: Count;
  packageCount?: Count;
}
