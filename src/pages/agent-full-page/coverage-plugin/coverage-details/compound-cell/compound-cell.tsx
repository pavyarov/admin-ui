import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';
import { OverflowText } from '@drill4j/ui-kit';

import styles from './compound-cell.module.scss';

interface Props {
  className?: string;
  item?: { [key: string]: string | number };
  pathKey: string;
  icon?: React.ReactNode;
  type?: 'primary' | 'secondary';
}

const compoundCell = BEM(styles);

export const CompoundCell = compoundCell(
  ({
    className, pathKey, icon, item: { name, [pathKey]: path } = {},
  }: Props) => (
    <span className={className}>
      {icon && <Prefix>{icon}</Prefix>}
      <Content>
        <ClassName>{name}</ClassName>
        <ClassPath>{path}</ClassPath>
      </Content>
    </span>
  ),
);

const Prefix = compoundCell.prefix('div');
const Content = compoundCell.content('div');
const ClassName = compoundCell.className(OverflowText);
const ClassPath = compoundCell.classPath(OverflowText);
