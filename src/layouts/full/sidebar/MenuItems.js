import {
  IconAperture, IconCopy, IconLayoutDashboard, IconLogin, IconMoodHappy, IconTypography, IconUserPlus
} from '@tabler/icons-react';
import { IconFileSpreadsheet,IconUserCog ,IconHistory} from '@tabler/icons-react';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    id: uniqueId(),
    title: 'Home',
    icon: IconLayoutDashboard,
    href: '/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Xếp lịch thi',
    icon: IconFileSpreadsheet,
    href: '/excel',
  },
  {
    id: uniqueId(),
    title: 'Xếp coi thi',
    icon: IconFileSpreadsheet,
    href: '/excel2',
  },
  {
    id: uniqueId(),
    title: 'Quản lý giảng viên coi thi',
    icon: IconUserCog,
    href: '/teacher'
  },
  {
    id: uniqueId(),
    title: 'Lịch sử xếp lịch thi',
    icon: IconHistory,
    href: '/history'
  },
];

export default Menuitems;
