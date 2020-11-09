import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';

import {
  useTableActionsDispatch, toggleOrder, useTableActionsState,
} from 'modules';
import { DefaultHeaderCell } from './default-header-cell';

import styles from './table.module.scss';

interface Props {
  className?: string;
  columns: any[];
}

export const TableHeader = BEM(styles).header(({ columns, className }: Props) => {
  const dispatch = useTableActionsDispatch();
  const { sort: [sort] } = useTableActionsState();
  return (
    <thead className={className}>
      <tr>
        {columns.map((column) => {
          const {
            name, width, HeaderCell, align = 'left',
          } = column;
          return (
            <th key={name} style={{ width }} align={align}>
              {HeaderCell
                ? HeaderCell({ column })
                : <DefaultHeaderCell column={column} sort={sort} onSort={({ field }) => dispatch(toggleOrder(field))} />}
            </th>
          );
        })}
      </tr>
    </thead>
  );
});
