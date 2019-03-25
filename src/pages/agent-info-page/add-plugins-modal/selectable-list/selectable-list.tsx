import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';

import { TableCheckbox } from '../../../../components';

import styles from './selectable-list.module.scss';

interface Props {
  className?: string;
  data: any[];
  idKey: string;
  footer?: React.ReactNode;
  selectedRows: string[];
  onSelect: (selectedItems: any) => any;
}

const selectableList = BEM(styles);

export const SelectableList = selectableList(
  ({ className, data, onSelect, idKey, selectedRows }: Props) => {
    return (
      <div className={className}>
        {data.map((element) => (
          <Element key={element[idKey]}>
            <TableCheckbox
              onClick={() => {
                selectedRows.includes(element[idKey])
                  ? onSelect(selectedRows.filter((selectedItem) => selectedItem !== element[idKey]))
                  : onSelect([...selectedRows, element[idKey]]);
              }}
              selected={selectedRows.includes(element[idKey])}
            />
            <div>
              <PluginName>{element.name}</PluginName>
              <PluginDescription>{element.description}</PluginDescription>
            </div>
          </Element>
        ))}
      </div>
    );
  },
);

const Element = selectableList.element('div');
const PluginName = selectableList.pluginName('div');
const PluginDescription = selectableList.pluginDescription('div');
