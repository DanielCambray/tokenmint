import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  OutlinedInput,
  Card,
  CardHeader,
  CardContent
} from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './css/TokenOwner.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as tokenOwnerActions from '../actions/tokenOwnerActions';
import * as tokenOwnerFundsActions from '../actions/tokenOwnerFundsActions';
import { bindActionCreators } from 'redux';
import initialState from '../reducers/initialState';
import ReactGA from 'react-ga';
import { NO_NETWORK } from '../../api/mintApi';

export class TokenOwner extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // TODO: remove logging when ga works properly
    console.log("Navigate to: /mint/"); // eslint-disable-line no-console
    ReactGA.pageview('/mint/');
  }

  componentDidUpdate(prevProps) {
    // after finishing all checks, send ga
    if (!this.props.checkingNetwork && !this.props.checkingTokenOwnerFunds && !this.props.loadingAccounts) {
      if (this.props.network !== "NO_NETWORK") {
        ReactGA.event({
          category: 'User',
          action: 'has web3'
        });
        if (this.props.network === "main") {
          ReactGA.event({
            category: 'User',
            action: 'has web3 and main net'
          });
          if (!this.props.tokenOwnerHasInsufficientFunds && this.props.tokenOwnerBalance > 0.0000001) {
            ReactGA.event({
              category: 'User',
              action: 'has web3 and main net and has funds'
            });
          }
        }
      }
    }
  }

  handleChange(e) {
    this.props.tokenOwnerActions.setTokenOwner(e.target.value);
    // if selected specific account
    if (e.target.value !== initialState.tokenOwner) {
      this.props.tokenOwnerFundsActions.checkFunds(e.target.value);
    } else {
      this.props.tokenOwnerFundsActions.setTokenOwnerHasInsufficientFunds(false);
    }
  }

  render() {
    const theme = createMuiTheme({
      typography: {
        useNextVariants: true,
      },
      palette: {
        primary: { 500: "#31bfdf" }
      }
    });

    let error = (this.props.accounts.length === 0 || this.props.tokenOwnerHasInsufficientFunds) && !this.props.loadingAccounts && !this.props.checkingTokenOwnerFunds;

    let menuItems;
    let descriptionText;
    if (this.props.loadingAccounts) {
      menuItems = (
        <MenuItem
          value={initialState.tokenOwner}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#31bfdf'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
        >
          Loading accounts...
        </MenuItem>
      );
      descriptionText = "ETH account. This account will be owner of the token!";
    } else if (this.props.accounts.length > 0) {
      menuItems = this.props.accounts.map((account) => (
        <MenuItem
          key={account}
          value={account}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#31bfdf'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
        >
          {account}
        </MenuItem>
      ));
      if (this.props.tokenOwnerHasInsufficientFunds) {
        descriptionText = "This account has insufficient funds. Please top up this account, or select another one, and refresh the page.";
      } else {
        descriptionText = "ETH account. This account will be owner of the token!";
      }
    } else {
      menuItems = (
        <MenuItem
          value={initialState.tokenOwner}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#31bfdf'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
        >
          No available accounts
        </MenuItem>
      );
      descriptionText = this.props.network === NO_NETWORK ?
        "There are no available accounts. Please make sure that you run Metamask or any other Ethereum wallet with at least one UNLOCKED account, and refresh the page." :
        "Ethereum wallet is detected, but there are no accounts available. If you are using Metamask, please LOG IN to it! " +
        "Otherwise you should UNLOCK your wallet or CREATE an account in your wallet.";
    }

    return (
      <Card
        className="card"
      >
        <CardHeader
          title="Token Owner"
          classes={{
            root: "card_header",
            title: "card_header_text"
          }}
        />
        <CardContent
          classes={{
            root: "card_content"
          }}
        >
          <Grid container spacing={8}>
            <Grid item xs={12} md={6}>
              <MuiThemeProvider theme={theme}>
                <FormControl variant="outlined">
                  <InputLabel>Select account</InputLabel>
                  <Select
                    error={error}
                    value={this.props.tokenOwner}
                    onChange={this.handleChange}
                    input={
                      <OutlinedInput
                        labelWidth={this.labelRef ? this.labelRef.offsetWidth : 0}
                        className="select_field"
                      />
                    }
                  >
                    {menuItems}
                  </Select>
                </FormControl>
              </MuiThemeProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                align="left"
                variant="body1"
                className={error ? "typography_error" : "typography"}
              >
                {descriptionText}
              </Typography>
              {this.props.tokenOwnerHasInsufficientFunds &&
                <div>
                  <Typography
                    align="left"
                    variant="body1"
                    className="typography_error_secondary"
                  >
                    <strong>Selected account balance:</strong> {this.props.tokenOwnerBalance.toFixed(6)} ETH
                  </Typography>
                  <Typography
                    align="left"
                    variant="body1"
                    className="typography_error_secondary"
                  >
                    <strong>Minimum required balance:</strong> {(this.props.serviceFee + 0.02).toFixed(6)} ETH plus mining fee
                  </Typography>
                </div>
              }
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

TokenOwner.propTypes = {
  network: PropTypes.string.isRequired,
  tokenOwnerHasInsufficientFunds: PropTypes.bool.isRequired,
  checkingTokenOwnerFunds: PropTypes.bool.isRequired,
  checkingNetwork: PropTypes.bool.isRequired,
  accounts: PropTypes.array.isRequired,
  tokenOwner: PropTypes.string.isRequired,
  tokenOwnerBalance: PropTypes.number.isRequired,
  serviceFee: PropTypes.number.isRequired,
  loadingAccounts: PropTypes.bool.isRequired,
  tokenOwnerActions: PropTypes.object.isRequired,
  tokenOwnerFundsActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
    loadingAccounts: state.loadingAccounts,
    tokenOwner: state.tokenOwner,
    tokenOwnerBalance: state.tokenOwnerBalance,
    serviceFee: state.serviceFee,
    checkingNetwork: state.checkingNetwork,
    checkingTokenOwnerFunds: state.checkingTokenOwnerFunds,
    tokenOwnerHasInsufficientFunds: state.tokenOwnerHasInsufficientFunds,
    network: state.network
  };
}

function mapDispatchToProps(dispatch) {
  return {
    tokenOwnerActions: bindActionCreators(tokenOwnerActions, dispatch),
    tokenOwnerFundsActions: bindActionCreators(tokenOwnerFundsActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TokenOwner);
