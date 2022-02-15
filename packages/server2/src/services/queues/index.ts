import SettingsSetter from './SiteSettings';
import { suppressQueue } from '../../config/appConfig.json';

if (!suppressQueue) {
  // eslint-disable-next-line no-console
  new SettingsSetter().run().catch(console.error);
}
