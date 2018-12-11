const urlBase = '/v1/';

export const URLS = {
  connections: (id) => (id ? `${urlBase}connections?object_id=${id}` : `${urlBase}connections`),
  connectionsByType: (type) => `${urlBase}connections?connection_type=${type}`,
  connectionSchema: (id) => `${urlBase}connections/describe?object_id=${id}`,
  connectionTest: () => `${urlBase}connections/test`,

  executionLogs: (id) => `${urlBase}executions/logs?object_id=${id}`,

  pipelines: (id) => (id ? `${urlBase}pipelines?object_id=${id}` : `${urlBase}pipelines`),
  pipelinesNameExists: (name) => `${urlBase}pipelines/name_exists?pipeline_name=${name}`,
  pipelineExecutions: (id) => `${urlBase}pipelines/executions?object_id=${id}`,
  pipelinesExecute: (id) => `${urlBase}pipelines/execute?object_id=${id}`,

  sessionLogin: () => `${urlBase}sessions/login`,
  sessionLogout: () => `${urlBase}sessions/logout`,

  user: () => `${urlBase}users`,
};
