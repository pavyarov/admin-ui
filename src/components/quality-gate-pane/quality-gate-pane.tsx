import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';
import {
  Button, Modal, Panel, Icons, GeneralAlerts,
} from '@drill4j/ui-kit';
import { Form } from 'react-final-form';

import { QualityGateSettings as QualityGate, ConditionSetting } from 'types/quality-gate-type';
import { useGeneralAlertMessage } from 'hooks';
import { QualityGateStatus } from './quality-gate-status';
import { QualityGateSettings } from './quality-gate-settings';
import { validateQualityGate } from './validate-quality-gate';
import { updateQualityGateSettings } from './api';

import styles from './quality-gate-pane.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onToggle: (value: boolean) => void;
  qualityGateSettings: QualityGate;
  agentId: string;
  pluginId: string;
}

const qualityGatePane = BEM(styles);

export const QualityGatePane = qualityGatePane(
  ({
    className,
    isOpen,
    onToggle,
    qualityGateSettings: {
      configured, conditionSettingByType, qualityGate, metrics,
    },
    agentId,
    pluginId,
  }: Props) => {
    const { generalAlertMessage, showGeneralAlertMessage } = useGeneralAlertMessage();
    const StatusIcon = Icons[qualityGate.status];
    const initialValues = {
      isEditing: !configured,
      coverage: {
        enabled: conditionSettingByType.coverage?.enabled,
        condition: {
          ...conditionSettingByType.coverage?.condition,
          value: conditionSettingByType.coverage?.enabled ? conditionSettingByType.coverage.condition.value : undefined,
        },
      } as ConditionSetting,
      risks: {
        enabled: conditionSettingByType.risks?.enabled,
        condition: {
          ...conditionSettingByType.risks?.condition,
          value: conditionSettingByType.risks?.enabled ? conditionSettingByType.risks.condition.value : undefined,
        },
      } as ConditionSetting,
      tests: {
        enabled: conditionSettingByType.tests?.enabled,
        condition: {
          ...conditionSettingByType.tests?.condition,
          value: conditionSettingByType.tests?.enabled ? conditionSettingByType.tests.condition.value : undefined,
        },
      } as ConditionSetting,
    };
    return (
      <Modal isOpen={isOpen} onToggle={onToggle}>
        <div className={className}>
          <Form
            onSubmit={(values) => updateQualityGateSettings(agentId, pluginId, showGeneralAlertMessage)(values)}
            initialValues={initialValues}
            validate={validateQualityGate}
            render={({
              values, handleSubmit, invalid, form, pristine,
            }) => (
              <>
                <Header align="space-between">
                  <Title data-test="quality-gate-pane:header-title">Quality Gate</Title>
                  {configured && !values.isEditing && (
                    <StatusIconWrapper type={qualityGate.status}>
                      <StatusIcon width={24} height={24} data-test="quality-gate-pane:header-status-icon" />
                    </StatusIconWrapper>
                  )}
                </Header>
                <GeneralAlerts type="INFO" data-test="quality-gate-pane:general-alerts:info">
                  {configured && !values.isEditing
                    ? 'Meet all conditions to pass the quality gate.'
                    : 'Choose the metrics and define their threshold.'}
                </GeneralAlerts>
                {generalAlertMessage?.type && (
                  <GeneralAlerts type={generalAlertMessage.type}>
                    {generalAlertMessage.text}
                  </GeneralAlerts>
                )}
                {configured && !values.isEditing
                  ? (
                    <QualityGateStatus
                      qualityGateSettings={{
                        conditionSettingByType,
                        qualityGate,
                        metrics,
                      }}
                      agentId={agentId}
                      pluginId={pluginId}
                    />
                  )
                  : <QualityGateSettings conditionSettingByType={values} />}
                <ActionsPanel>
                  {configured && !values.isEditing ? (
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => form.change('isEditing', !values.isEditing)}
                      data-test="quality-gate-pane:edit-button"
                      disabled={Boolean(generalAlertMessage?.text)}
                    >
                      Edit
                    </Button>
                  )
                    : (
                      <Button
                        type="primary"
                        size="large"
                        disabled={invalid || pristine}
                        onClick={handleSubmit}
                        data-test="quality-gate-pane:save-button"
                      >
                        Save
                      </Button>
                    )}
                  {configured && values.isEditing && (
                    <Button
                      type="secondary"
                      size="large"
                      onClick={() => form.change('isEditing', !values.isEditing)}
                      data-test="quality-gate-pane:back-button"
                    >
                      <Icons.Expander width={8} height={14} rotate={180} />
                      <span>Back</span>
                    </Button>
                  )}
                  <Button
                    type="secondary"
                    size="large"
                    onClick={() => onToggle(false)}
                    data-test="quality-gate-pane:cancel-button"
                  >
                    Cancel
                  </Button>
                </ActionsPanel>
              </>
            )}
          />
        </div>
      </Modal>
    );
  },
);

const Header = qualityGatePane.header(Panel);
const StatusIconWrapper = qualityGatePane.statusIconWrapper('div');
const Title = qualityGatePane.title('div');
const ActionsPanel = qualityGatePane.actionsPanel('div');
