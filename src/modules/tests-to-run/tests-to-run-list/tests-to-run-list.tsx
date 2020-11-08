import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';
import {
  Table, Column, Icons,
} from '@drill4j/ui-kit';

import { Cells, SearchPanel } from 'components';
import { TestCoverageInfo } from 'types/test-coverage-info';
import { useBuildVersion } from 'hooks';
import { CoveredMethodsByTestSidebar } from 'modules';
import { Metrics } from 'types/metrics';
import { capitalize } from 'utils';
import { TestsToRunHeader } from './tests-to-run-header';

import styles from './tests-to-run-list.module.scss';

interface Props {
  className?: string;
  agentType?: string;
}

const testsToRunList = BEM(styles);

export const TestsToRunList = testsToRunList(({ className, agentType = 'Agent' }: Props) => {
  const [selectedTest, setSelectedTest] = React.useState('');
  const [search, setSearch] = React.useState({ fieldName: 'name', value: '' });
  const testsToRun = useBuildVersion<TestCoverageInfo[]>('/build/tests-to-run', search) || [];
  const { tests: testToRunCount = 0 } = useBuildVersion<Metrics>('/data/stats') || {};
  return (
    <div className={className}>
      <TestsToRunHeader agentType={agentType} testsToRunCount={testToRunCount} />
      <Title data-test="tests-to-run-list:title">SUGGESTED TESTS</Title>
      <div>
        <SearchPanel
          onSearch={(value) => setSearch({ ...search, value })}
          searchQuery={search.value}
          searchResult={testsToRun.length}
          placeholder="Search tests by name"
        >
          Displaying {testsToRun.length} of {testsToRun.length} tests
        </SearchPanel>
        <Table data={testsToRun} idKey="name" columnsSize="medium">
          <Column
            name="name"
            label="Name"
            Cell={({ value }) => (
              <Cells.Compound cellName={value} cellAdditionalInfo="&ndash;" icon={<Icons.Test />} />
            )}
          />
          <Column
            name="type"
            label="Test type"
            width="108px"
            Cell={({ value }) => (
              <>
                {capitalize(value)}
              </>
            )}
          />
          <Column
            name="stats.result"
            label="State"
            Cell={({ item: { toRun } }) => (
              toRun ? <>To run</> : <Done>Done</Done>
            )}
            width="68px"
          />
          <Column
            name="coverage.percentage"
            label="Coverage, %"
            Cell={({ value, item: { toRun } }) => (toRun ? null : <Cells.Coverage value={value} />)}
            align="right"
            width="98px"
          />
          <Column
            name="coverage.methodCount.covered"
            label="Methods covered"
            Cell={({ value, item: { id = '', toRun } }) => (
              toRun ? null : (
                <Cells.Clickable
                  onClick={() => setSelectedTest(id)}
                  disabled={!value}
                >
                  {value}
                </Cells.Clickable>
              )
            )}
            align="right"
            width="162px"
          />
          <Column
            name="stats.duration"
            label="Duration"
            Cell={({ value, item: { toRun } }) => (toRun ? null : <Cells.Duration value={value} />)}
            align="right"
            width="118px"
          />,
        </Table>
      </div>
      {Boolean(selectedTest) && (
        <CoveredMethodsByTestSidebar
          isOpen={Boolean(selectedTest)}
          onToggle={() => setSelectedTest('')}
          testId={selectedTest}
          topicCoveredMethodsByTest="/build/tests/covered-methods"
        />
      )}
    </div>
  );
});

const Title = testsToRunList.title('span');
const Done = testsToRunList.done('span');
