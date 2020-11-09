import * as React from 'react';

import { TestSummary } from 'types/test-summary';
import { TestTypeSummary } from 'types/test-type-summary';
import { TableActionsProvider } from 'modules/table-actions';
import { TestDetails } from '../test-details';
import { useBuildVersion } from '../use-build-version';
import { ProjectTestsCards } from '../project-tests-cards';

export const Tests = () => {
  const allTests = useBuildVersion<TestSummary>({ topic: '/build/summary/tests/all' }) || {};
  const testsByType = useBuildVersion<TestTypeSummary[]>({ topic: '/build/summary/tests/by-type' }) || [];
  return (
    <>
      <ProjectTestsCards allTests={allTests} testsByType={testsByType} />
      <TableActionsProvider>
        <TestDetails
          topic="/build/tests-usages"
          coveredMethodsTopic="/build/tests/covered-methods"
        />
      </TableActionsProvider>
    </>
  );
};
