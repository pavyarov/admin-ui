import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';

import { Card } from '../card';
import { MethodsSection } from './methods-section';
import { NewMethodsModal } from '../new-methods-modal';
import { Coverage } from '../../../../types/coverage';
import { NewMethodsCoverage } from '../../../../types/new-methods-coverage';

import styles from './project-methods-card.module.scss';

interface Props {
  className?: string;
  agentId: string;
  buildVersion: string;
  coverage: Coverage;
  newMethodsCoverage: NewMethodsCoverage;
  header?: React.ReactNode;
  newMethodsTopic: string;
}

const projectMethodsCard = BEM(styles);

export const ProjectMethodsCard = projectMethodsCard(
  ({
    className,
    header,
    coverage: { methodsCount = 0, uncoveredMethodsCount = 0 },
    newMethodsCoverage: { methodsCount: newMethodsCoverage = 0, methodsCovered = 0 },
    agentId,
    buildVersion,
    newMethodsTopic,
  }: Props) => {
    const [isNewMethodsModalOpen, setIsNewMethodsModalOpen] = React.useState(false);
    return (
      <div className={className}>
        <Card header={header}>
          <MethodsSection
            header="TOTAL"
            totalCount={methodsCount}
            coveredMethodsCount={methodsCount - uncoveredMethodsCount}
            missedMethodsCount={uncoveredMethodsCount}
            excludedMethodsCount={0}
          />
          <MethodsSection
            header="MODIFIED & NEW"
            totalCount={newMethodsCoverage}
            coveredMethodsCount={methodsCovered}
            missedMethodsCount={newMethodsCoverage - methodsCovered}
            excludedMethodsCount={0}
            onTotalClick={() => setIsNewMethodsModalOpen(true)}
          />
        </Card>
        {isNewMethodsModalOpen && (
          <NewMethodsModal
            agentId={agentId}
            buildVersion={buildVersion}
            isOpen={isNewMethodsModalOpen}
            onToggle={setIsNewMethodsModalOpen}
            newMethodsTopic={newMethodsTopic}
          />
        )}
      </div>
    );
  },
);
