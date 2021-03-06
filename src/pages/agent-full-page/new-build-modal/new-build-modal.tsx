import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';
import { Button, Popup } from '@drill4j/ui-kit';

import { Notification } from 'types/notificaiton';
import { readNotification } from '../api';
import { BuildUpdates } from './build-updates';
import { RecommendedActions } from './recommended-actions';
import { Header } from './header';

import styles from './new-build-modal.module.scss';

interface Props {
  className?: string;
  isOpen: boolean;
  onToggle: (value: boolean) => void;
  notification: Notification;
}

const newBuildModal = BEM(styles);

export const NewBuildModal = newBuildModal(
  ({
    className,
    isOpen,
    onToggle,
    notification: {
      id = '',
      message: {
        prevId, buildDiff = {}, recommendations = [],
      } = {},
    },
  }: Props) => {
    React.useEffect(() => {
      id && readNotification(id);
    }, [id]);

    return (
      <Popup
        isOpen={isOpen}
        onToggle={onToggle}
        header={<Header prevBuildVersion={prevId} />}
        type="info"
        closeOnFadeClick
      >
        <div className={className}>
          <Content>
            <Section>
              <BuildUpdates
                buildDiff={{
                  new: buildDiff?.new,
                  modified: buildDiff?.modified,
                  deleted: buildDiff?.deleted,
                }}
              />
            </Section>
            {recommendations.length > 0 && (
              <Section>
                <RecommendedActions recommendations={recommendations} />
              </Section>
            )}
            <Button type="primary" size="large" onClick={() => onToggle(false)}>
              Ok, Got it!
            </Button>
          </Content>
        </div>
      </Popup>
    );
  },
);

const Content = newBuildModal.content('div');
const Section = newBuildModal.section('div');
