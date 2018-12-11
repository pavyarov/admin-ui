import classNames from 'classnames/bind';
import styles from './dotsPreloader.scss';

const cx = classNames.bind(styles);

export const DotsPreloader = () => (
  <div className={cx('dots-preloader')}>
    <div className={cx('dot')} />
    <div className={cx('dot')} />
    <div className={cx('dot')} />
    <div className={cx('dot')} />
    <div className={cx('dot')} />
  </div>
);
