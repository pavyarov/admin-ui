import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';
import { NavLink, useParams } from 'react-router-dom';
import { Panel, Tooltip } from '@drill4j/ui-kit';

import { percentFormatter } from 'utils';
import { BuildCoverage } from 'types/build-coverage';
import { Methods } from 'types/methods';
import { COVERAGE_TYPES_COLOR } from 'common/constants';
import { ParentBuild } from 'types/parent-build';
import { SingleBar, CoverageSectionTooltip } from 'components';
import { useBuildVersion } from 'hooks';
import { usePreviousBuildCoverage } from '../../../coverage-plugin/use-previous-build-coverage';
import { Section } from '../section';

import styles from './coverage-section.module.scss';

interface Props {
  className?: string;
}

const coverageSection = BEM(styles);

export const CoverageSection = coverageSection(({ className }: Props) => {
  const { version: previousBuildVersion = '' } = useBuildVersion<ParentBuild>('/data/parent') || {};
  const { percentage: previousBuildCodeCoverage = 0 } = usePreviousBuildCoverage(previousBuildVersion) || {};
  const { percentage: buildCodeCoverage = 0, finishedScopesCount = 0 } = useBuildVersion<BuildCoverage>('/build/coverage') || {};
  const {
    all: {
      total: allMethodsTotalCount = 0,
      covered: allMethodsCoveredCount = 0,
    } = {},
    new: {
      total: newMethodsTotalCount = 0,
      covered: newMethodsCoveredCount = 0,
    } = {},
    modified: {
      total: modifiedMethodsTotalCount = 0,
      covered: modifiedMethodsCoveredCount = 0,
    } = {},
  } = useBuildVersion<Methods>('/build/methods') || {};
  const { agentId = '' } = useParams<{ agentId: string }>();
  const tooltipData = {
    totalCovered: {
      total: allMethodsTotalCount,
      covered: allMethodsCoveredCount,
    },
    new: {
      total: newMethodsTotalCount,
      covered: newMethodsCoveredCount,
    },
    modified: {
      total: modifiedMethodsTotalCount,
      covered: modifiedMethodsCoveredCount,
    },
  };
  const buildDiff = percentFormatter(buildCodeCoverage) - percentFormatter(previousBuildCodeCoverage);
  const isFirstBuild = !previousBuildVersion;

  return (
    <div className={className}>
      <Section
        label="Build Coverage"
        info={`${percentFormatter(buildCodeCoverage)}%`}
        graph={(
          <Tooltip
            customStyle={{ left: 'calc(50% - 2px)', bottom: 'calc(100% + 12px)' }}
            message={<CoverageSectionTooltip data={tooltipData} />}
          >
            <SingleBar
              width={108}
              height={128}
              color={COVERAGE_TYPES_COLOR.TOTAL}
              percent={percentFormatter(buildCodeCoverage)}
            />
          </Tooltip>
        )}
        additionalInfo={(
          <Panel>
            {Boolean(buildDiff) && !isFirstBuild && finishedScopesCount > 0
              && (
                <BuildInfo>
                  {`${buildDiff > 0 ? '+' : '-'} ${percentFormatter(Math.abs(buildDiff))}% vs`}
                  <Link to={`/full-page/${agentId}/${previousBuildVersion}/dashboard`}>
                    &nbsp;Build {previousBuildVersion}
                  </Link>
                </BuildInfo>
              )}
          </Panel>
        )}
      />
    </div>
  );
});

const Link = coverageSection.link(NavLink);
const BuildInfo = coverageSection.buildInfo('div');
