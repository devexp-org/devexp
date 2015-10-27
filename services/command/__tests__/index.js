import { constructRegexp } from '../../command';
import { forEach } from 'lodash';

function makeCommonCases(command) {
  return [
    `${command}`,
    ` ${command}`,
    `Lorem ipsum dolor sit amet ${command}`,
    `Lorem ipsum dolor sit amet, ${command} consectetur adipisicing elit.`,
    `Lorem ipsum dolor sit amet,\n ${command} consectetur adipisicing elit.`,
    `Lorem ipsum dolor sit amet,\n ${command}\n consectetur adipisicing elit.`
  ];
}

describe('service/command#constructRegexp', () => {
  const testCases = [
    {
      test: '\/start',
      positive: makeCommonCases('/start')
    },
    {
      test: '\/?([^!]|^)ok|\/?([^!]|^)ок',
      positive: [].concat(
        makeCommonCases('/ok'), makeCommonCases('ok'),
        makeCommonCases('/ок'), makeCommonCases('ок')
      ),
      negative: [].concat(makeCommonCases('/!ok'), makeCommonCases('!ok'))
    },
    {
      test: '\/?!ok|\/?!ок$$',
      positive: [].concat(makeCommonCases('/!ok'), makeCommonCases('!ok')),
      negative: [].concat(makeCommonCases('/ok'), makeCommonCases('ok'))
    },
    {
      test: '\/busy',
      positive: makeCommonCases('/busy')
    },
    {
      test: '\/change',
      positive: makeCommonCases('/change')
    },
    {
      test: '\/add|\\+@?[\\w]+',
      positive: [].concat(
        makeCommonCases('/add user'), makeCommonCases('/add @user'),
        makeCommonCases('+user'), makeCommonCases('+@user')
      )
    },
    {
      test: '\/?ping',
      positive: [].concat(
        makeCommonCases('/ping'),
        makeCommonCases('ping')
      )
    }
  ];

  testCases.forEach(command => {
    const regexp = constructRegexp(command.test);

    forEach(command.positive, c => {
      it('should find command in text for regexp — ' + command.test, () => {
        assert.match(c, regexp);
      });
    });

    forEach(command.negative, c => {
      it('should not find command in text for regexp — ' + command.test, () => {
        assert.notMatch(c, regexp);
      });
    });
  });
});
