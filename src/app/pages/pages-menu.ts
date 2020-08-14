import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Inicio',
    icon: 'shopping-cart-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'IoT Dashboard',
    icon: 'home-outline',
    link: '/pages/iot-dashboard',
  },
  {
    title: 'Cargar Tutores',
    icon: 'upload-outline',
    link: '/pages/upload-data',
    queryParams: { data: 'tutores' }
  },
  {
    title: 'Cargar Alumnos',
    icon: 'upload-outline',
    link: '/pages/upload-data',
    queryParams: { data: 'alumnos' }
  },
  {
    title: 'Miscellaneous',
    icon: 'shuffle-2-outline',
    children: [
      {
        title: '404',
        link: '/pages/miscellaneous/404',
      },
    ],
  },
  {
    title: 'Salir',
    icon: 'unlock-outline',
    link: '/pages/salir',
  },
];
