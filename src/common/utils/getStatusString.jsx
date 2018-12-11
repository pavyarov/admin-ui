import { FormattedMessage } from 'react-intl';
import { STATUSES } from 'common/constants';

export const getStatusString = (status) => {
  switch (status) {
    case STATUSES.CREATED:
      return <FormattedMessage id={'pipelineStatus.created'} defaultMessage={'Created'} />;
    case STATUSES.QUEUED:
      return <FormattedMessage id={'pipelineStatus.queued'} defaultMessage={'Queued'} />;
    case STATUSES.IN_PROGRESS:
      return <FormattedMessage id={'pipelineStatus.in_progress'} defaultMessage={'In progress'} />;
    case STATUSES.FAILED:
      return <FormattedMessage id={'pipelineStatus.failed'} defaultMessage={'Failed'} />;
    case STATUSES.DONE:
      return <FormattedMessage id={'pipelineStatus.done'} defaultMessage={'Done'} />;
    default:
      return status;
  }
};
