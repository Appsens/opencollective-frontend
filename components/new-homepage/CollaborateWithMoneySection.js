import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { Box, Flex } from '../Grid';
import NextIllustration from '../home/HomeNextIllustration';
import { H2, H5, P } from '../Text';

const messages = defineMessages({
  'home.payment': {
    id: 'home.payment',
    defaultMessage: 'Payment',
  },
  'home.payment.description': {
    id: 'home.payment.description',
    defaultMessage: 'Accept funds, transfer money, pay people and create invoices.',
  },
  'home.fundraising': {
    id: 'home.fundraising',
    defaultMessage: 'Fundraising',
  },
  'home.fundraising.description': {
    id: 'home.fundraising.description',
    defaultMessage: 'Publicly display your budget and transactions to build trust from contributors and donors.',
  },
  'home.communityEngagement': {
    id: 'home.communityEngagement',
    defaultMessage: 'Community engagement',
  },
  'home.communityEngagement.description': {
    id: 'home.communityEngagement.description',
    defaultMessage:
      'Post updates, create events, connect your website, or use your Open Collective page with your custom url.',
  },
  'home.reporting': {
    id: 'home.reporting',
    defaultMessage: 'Reporting',
  },
  'home.reporting.description': {
    id: 'home.reporting.description',
    defaultMessage:
      'No more messy spreadsheets. Open Collective updates live to make reporting easy. Auditors and grantmakers love us!',
  },
  'home.accounting': {
    id: 'home.accounting',
    defaultMessage: 'Accounting',
  },
  'home.accounting.description': {
    id: 'home.accounting.description',
    defaultMessage: 'No need to balance your checkbook. It’s all accessible here on the platform.',
  },
});

const features = ['payment', 'fundraising', 'communityEngagement', 'reporting', 'accounting'];

const CollaborateWithMoney = () => {
  const intl = useIntl();

  return (
    <Flex px="16px" flexDirection="column" alignItems="center" my="64px">
      <Flex flexDirection={['column', 'row']} alignItems="center">
        <Box width={['206px']}>
          <NextIllustration src="/static/images/new-home/collaborate-with-money.png" width={239} height={257} />
        </Box>
        <Box maxWidth={['288px', '421px', '594px']} textAlign={['center', 'left']} ml={[null, '40px']}>
          <H2
            letterSpacing={['-0.008em', '-0.04em']}
            fontSize={['32px', '40px']}
            lineHeight={['40px', '48px']}
            color="primary.900"
            fontWeight="700"
            mb={['8px', 3]}
          >
            <FormattedMessage id="home.collaborateWithMoney" defaultMessage={'Collaborate with money.'} />
          </H2>

          <P
            fontSize={['16px', '18px', '20px']}
            lineHeight={['24px', '26px', '28px']}
            fontWeight="500"
            color="black.800"
            letterSpacing={[null, null, '-0.008em']}
          >
            <FormattedMessage
              id="home.collaborateWithMoney.description"
              defaultMessage={'A shared account to fundraise and manage money, connect with your people, and more.'}
            />
          </P>
        </Box>
      </Flex>
      <Flex
        flexDirection={['column', 'row']}
        flexWrap="wrap"
        my="48px"
        mb={[null, null, 0]}
        maxWidth={['288px', '724px', '1024px', null, '1280px']}
        justifyContent="center"
      >
        {features.map(feature => (
          <Box
            key={feature}
            mb={[4, null, '78px']}
            width={['288px', '195px', '288px']}
            mx={[null, '12px', '23px', null, '56px']}
          >
            <Box mb="18px">
              <NextIllustration
                width={56}
                height={56}
                src={`/static/images/new-home/${feature}-icon.png`}
                alt={`${feature} illustration`}
              />
            </Box>
            <Box>
              <H5 fontWeight="700" fontSize="20px" lineHeight="28px" letterSpacing="-0.008em" color="black.800" mb={3}>
                {intl.formatMessage(messages[`home.${feature}`])}
              </H5>
              <P fontSize="18px" lineHeight="26px" color="black.700   ">
                {intl.formatMessage(messages[`home.${feature}.description`])}
              </P>
            </Box>
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};

export default CollaborateWithMoney;
