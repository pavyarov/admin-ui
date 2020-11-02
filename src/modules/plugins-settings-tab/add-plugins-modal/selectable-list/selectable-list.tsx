import * as React from 'react';
import { BEM, div } from '@redneckz/react-bem-helper';
import {
  Badge, Icons, Inputs, Panel,
} from '@drill4j/ui-kit';

import styles from './selectable-list.module.scss';

interface Props {
  className?: string;
  data: Array<{ [key: string]: any }>;
  idKey: string;
  footer?: React.ReactNode;
  selectedRows: string[];
  onSelect: (selectedItems: any) => any;
}

const selectableList = BEM(styles);

export const SelectableList = selectableList(
  ({
    className, data, onSelect, idKey, selectedRows,
  }: Props) => (
    <div className={className}>
      {data.map((plugin) => (
        <Element key={plugin[idKey]} selected={selectedRows.includes(plugin[idKey])}>
          <Plugin
            selected={selectedRows.includes(plugin[idKey])}
            selectable={plugin.relation !== 'Installed'}
          >
            {plugin.relation !== 'Installed' && (
              <Checkbox
                onChange={() => {
                  selectedRows.includes(plugin[idKey])
                    ? onSelect(
                      selectedRows.filter((selectedItem) => selectedItem !== plugin[idKey]),
                    )
                    : onSelect([...selectedRows, plugin[idKey]]);
                }}
                checked={selectedRows.includes(plugin[idKey])}
              />
            )}
            <PluginsIconWrapper selected={selectedRows.includes(plugin[idKey])}>
              <Icons.Test2Code />
            </PluginsIconWrapper>
            <Panel direction="column" verticalAlign="start">
              <Panel>
                <PluginName>{plugin.name}</PluginName>
                {plugin.relation && (
                  <PluginRelation
                    color={plugin.relation === 'Installed' ? 'gray' : 'green'}
                  >
                    {plugin.relation}
                  </PluginRelation>
                )}
                {plugin.version && <PluginVersion>{plugin.version}</PluginVersion>}
              </Panel>
              <PluginDescription title={plugin.description}>
                {plugin.description}
              </PluginDescription>
            </Panel>
          </Plugin>
        </Element>
      ))}
    </div>
  ),
);

const Element = selectableList.element(div({} as { selected?: boolean }));
const PluginRelation = selectableList.pluginRelation(Badge);
const Plugin = selectableList.plugin(div({} as { selected?: boolean; selectable?: boolean }));
const Checkbox = selectableList.checkbox(Inputs.Checkbox);
const PluginsIconWrapper = selectableList.pluginsIconWrapper(div({} as { selected?: boolean }));
const PluginName = selectableList.pluginName('div');
const PluginVersion = selectableList.pluginVersion('div');
const PluginDescription = selectableList.pluginDescription('span');
