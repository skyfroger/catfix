import 'react-i18next';

import {resources} from '../../src/i18n/config';

declare module "react-i18next" {
    interface CustomTypeOptions {
        resources: resources
      }
}