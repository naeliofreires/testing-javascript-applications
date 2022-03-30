import { Factory } from 'miragejs';

import faker from '@faker-js/faker';

export default {
  product: Factory.extend({
    title() {
      return faker.fake('{{name.findName}}');
    },
    price() {
      return faker.fake('{{phone.phoneNumber}}');
    },
    image() {
      return faker.fake('{{image.avatar}}');
    },
  }),
};
