import React from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from '@styled-icons/boxicons-regular/ChevronDown';
import { Github } from '@styled-icons/fa-brands/Github';
import { Slack } from '@styled-icons/fa-brands/Slack';
import { Twitter } from '@styled-icons/fa-brands/Twitter';
import { Blog } from '@styled-icons/icomoon/Blog';
import { Mail } from '@styled-icons/material/Mail';
import { FormattedMessage, injectIntl } from 'react-intl';
import styled from 'styled-components';

import Container from './Container';
import { Box, Flex } from './Grid';
import Link from './Link';
import StyledLink from './StyledLink';
import StyledRoundButton from './StyledRoundButton';
import { withUser } from './UserProvider';

const ListItem = styled.li`
  list-style: none;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  padding-top: 10px;
  cursor: pointer;
  a:not(:hover) {
    color: #313233;
  }
`;

const SubListItem = styled(ListItem)`
  padding-bottom: 10px;
`;

class TopBarMobileMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewSolutionsMenu: false, viewProductsMenu: false, viewCompanyMenu: false };
  }

  render() {
    const { showMobileMenu, closeMenu } = this.props;

    if (!showMobileMenu) {
      return null;
    }

    return (
      <Container
        bg="white.full"
        width="100%"
        position="absolute"
        right={[0, 16]}
        top={[69, 75]}
        p={3}
        zIndex={3000}
        borderRadius="0px 0px 16px 16px"
        boxShadow="0px 8px 12px rgba(20, 20, 20, 0.16)"
        data-cy="user-menu"
      >
        <Box as="ul" my={2} pl={0} pb="36px">
          <ListItem>
            <Flex
              justifyContent="space-between"
              onClick={() => this.setState(({ viewSolutionsMenu }) => ({ viewSolutionsMenu: !viewSolutionsMenu }))}
            >
              <FormattedMessage defaultMessage="Solutions" />
              <ChevronDown size={20} />
            </Flex>
            {this.state.viewSolutionsMenu && (
              <Box as="ul" my={2} pl="12px">
                {/* TODO: Add this part back when the /collectives page is designed*/}
                {/* <ListItem>*/}
                {/*  <Link href="/collectives" onClick={closeMenu}>*/}
                {/*    <FormattedMessage id="pricing.forCollective" defaultMessage="For Collectives" />*/}
                {/*  </Link>*/}
                {/* </ListItem>*/}
                <SubListItem>
                  <Link href="/become-a-sponsor" onClick={closeMenu}>
                    <FormattedMessage defaultMessage="For Contributors" />
                  </Link>
                </SubListItem>
                <SubListItem>
                  <Link href="/become-a-host" onClick={closeMenu}>
                    <FormattedMessage id="pricing.fiscalHost" defaultMessage="For Fiscal Hosts" />
                  </Link>
                </SubListItem>
              </Box>
            )}
          </ListItem>
          <hr />
          <ListItem>
            <Flex
              justifyContent="space-between"
              onClick={() => this.setState(({ viewProductsMenu }) => ({ viewProductsMenu: !viewProductsMenu }))}
            >
              <FormattedMessage id="ContributionType.Product" defaultMessage="Product" />
              <ChevronDown size={20} />
            </Flex>
            {this.state.viewProductsMenu && (
              <Box as="ul" my={2} pl="12px">
                <SubListItem>
                  <Link href="/pricing" onClick={closeMenu}>
                    <FormattedMessage id="menu.pricing" defaultMessage="Pricing" />
                  </Link>
                </SubListItem>
                <SubListItem>
                  <Link href="/how-it-works" onClick={closeMenu}>
                    <FormattedMessage id="menu.howItWorks" defaultMessage="How it Works" />
                  </Link>
                </SubListItem>
                <SubListItem>
                  <Link href="/fiscal-hosting" onClick={closeMenu}>
                    <FormattedMessage id="editCollective.fiscalHosting" defaultMessage="Fiscal Hosting" />
                  </Link>
                </SubListItem>
              </Box>
            )}
          </ListItem>
          <hr />
          <ListItem>
            <Flex
              justifyContent="space-between"
              onClick={() => this.setState(({ viewCompanyMenu }) => ({ viewCompanyMenu: !viewCompanyMenu }))}
            >
              <FormattedMessage id="company" defaultMessage="Company" />
              <ChevronDown size={20} />
            </Flex>
            {this.state.viewCompanyMenu && (
              <Box as="ul" my={2} pl="12px">
                <SubListItem>
                  <a href="https://blog.opencollective.com/" onClick={closeMenu}>
                    <FormattedMessage id="company.blog" defaultMessage="Blog" />
                  </a>
                </SubListItem>
                <SubListItem>
                  <Link href="/e2c" onClick={closeMenu}>
                    <FormattedMessage id="OC.e2c" defaultMessage="Exit to Community" />
                  </Link>
                </SubListItem>
              </Box>
            )}
          </ListItem>
          <hr />
          <ListItem>
            <Link href="/help" onClick={closeMenu}>
              <FormattedMessage defaultMessage="Help & Support" />
            </Link>
          </ListItem>
        </Box>
        <Container
          display="flex"
          alignItems="center"
          width={1}
          p={2}
          order={['2', null, '3']}
          borderRadius={16}
          background="#F7F8FA"
          justifyContent="space-between"
        >
          <StyledLink href="https://blog.opencollective.com/" openInNewTab onClick={closeMenu}>
            <StyledRoundButton size={40}>
              <Blog size={17} color="#9D9FA3" />
            </StyledRoundButton>
          </StyledLink>
          <StyledLink href="https://twitter.com/opencollect" openInNewTab onClick={closeMenu}>
            <StyledRoundButton size={40}>
              <Twitter size={17} color="#9D9FA3" />
            </StyledRoundButton>
          </StyledLink>
          <StyledLink href="https://github.com/opencollective" openInNewTab onClick={closeMenu}>
            <StyledRoundButton size={40}>
              <Github size={17} color="#9D9FA3" />
            </StyledRoundButton>
          </StyledLink>
          <StyledLink href="https://slack.opencollective.com" openInNewTab onClick={closeMenu}>
            <StyledRoundButton size={40}>
              <Slack size={17} color="#9D9FA3" />
            </StyledRoundButton>
          </StyledLink>
          <StyledLink href="mailto:info@opencollective.com" openInNewTab onClick={closeMenu}>
            <StyledRoundButton size={40}>
              <Mail size={19} color="#9D9FA3" />
            </StyledRoundButton>
          </StyledLink>
        </Container>
      </Container>
    );
  }
}

TopBarMobileMenu.propTypes = {
  showMobileMenu: PropTypes.bool,
  closeMenu: PropTypes.func,
};

export default injectIntl(withUser(TopBarMobileMenu));
